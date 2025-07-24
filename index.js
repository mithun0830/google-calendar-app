const { google } = require('googleapis');
const express = require('express');
const Joi = require('joi');
const dotenv = require('dotenv');
const axios = require('axios');
const { JWT } = require('google-auth-library');

dotenv.config();

const app = express();
const path = require('path');
const fs = require('fs');

const FUELIX_API_KEY = process.env.FUELIX_API_KEY;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

// Load service account credentials from environment variables
const SERVICE_ACCOUNT_EMAIL = process.env.SERVICE_ACCOUNT_EMAIL;
const SERVICE_ACCOUNT_PRIVATE_KEY = process.env.SERVICE_ACCOUNT_PRIVATE_KEY;

class GoogleCalendarAPI {
  constructor() {
    try {
      if (!SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_PRIVATE_KEY) {
        throw new Error('Service account credentials are not properly configured in environment variables.');
      }

      // Initialize service account client for read-only operations
      this.serviceAccountClient = new JWT({
        email: SERVICE_ACCOUNT_EMAIL,
        key: SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/calendar.readonly']
      });

      // Create read-only calendar service using service account
      this.calendarServiceReadOnly = google.calendar({ 
        version: 'v3',
        auth: this.serviceAccountClient
      });

      // Initialize OAuth2 client for write operations if credentials are available
      const hasValidOAuth = CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN;
      if (hasValidOAuth) {
        this.oauth2Client = new google.auth.OAuth2(
          CLIENT_ID,
          CLIENT_SECRET
        );
        
        this.oauth2Client.setCredentials({
          refresh_token: REFRESH_TOKEN,
          scope: [
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/calendar'
          ]
        });

        this.calendarServiceReadWrite = google.calendar({
          version: 'v3',
          auth: this.oauth2Client
        });
      } else {
        console.warn('OAuth credentials not configured. Meeting creation will be unavailable.');
      }

    } catch (error) {
      throw new Error(`Failed to initialize calendar services: ${error.message}`);
    }
  }

  async createMeetEvent(eventData) {
    if (!this.calendarServiceReadWrite) {
      throw new Error('OAuth credentials not configured. Cannot create meetings.');
    }
    const event = await this.calendarServiceReadWrite.events.insert({
      calendarId: 'primary',
      resource: {
        ...eventData,
        conferenceData: {
          createRequest: {
            requestId: `meeting-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      },
      conferenceDataVersion: 1
    });
    return event.data;
  }

  async getFreeSlots({ emails, dateTime, duration }) {
    try {
      const startDate = new Date(dateTime);
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999); // End of the same day
      const slotDuration = parseInt(duration) || 30; // Default to 30 minutes if not specified

      const freeBusy = await this.calendarServiceReadOnly.freebusy.query({
        requestBody: {
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          items: emails.map(email => ({ id: email }))
        }
      });

      const allBusySlots = [];
      for (const email of emails) {
        if (freeBusy.data.calendars[email].errors) {
          const error = freeBusy.data.calendars[email].errors[0];
          if (error.reason === 'notFound') {
            throw new Error(`Calendar not found for email: ${email}. Please check if the email is correct and you have the necessary permissions.`);
          } else {
            throw new Error(`Error accessing calendar for ${email}: ${error.reason}`);
          }
        }
        const busySlots = freeBusy.data.calendars[email].busy || [];
        allBusySlots.push(...busySlots);
      }
      
      return this.calculateFreeSlots(startDate, endDate, allBusySlots, slotDuration);
    } catch (error) {
      throw new Error(`Error getting free slots: ${error.message}`);
    }
  }

  calculateFreeSlots(start, end, busySlots, duration = 30) {
    const freeSlots = [];
    const slotDuration = duration;
    let currentTime = new Date(start);

    while (currentTime < end) {
      const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);
      
      if (slotEnd > end) break;

      const isFree = busySlots.every(busy => {
        const busyStart = new Date(busy.start || '');
        const busyEnd = new Date(busy.end || '');
        
        return slotEnd <= busyStart || currentTime >= busyEnd;
      });

      if (isFree) {
        freeSlots.push(this.formatTime(currentTime));
      }

      currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
    }

    return freeSlots.sort((a, b) => new Date(a) - new Date(b));
  }

  formatTime(date) {
    // Return time in ISO 8601 format
    return date.toISOString();
  }
}

// Initialize calendar API only if not accessing swagger documentation
let calendar = null;
try {
  calendar = new GoogleCalendarAPI();
} catch (error) {
  console.warn('Failed to initialize Google Calendar API:', error.message);
}

// Basic request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Specific route handlers
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// API route for free slots
app.post('/api/free-slots', async (req, res) => {
  try {
    const { error, value } = freeSlotsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation Error',
        details: error.details[0].message,
        code: 'VALIDATION_ERROR'
      });
    }

    if (!calendar) {
      return res.status(503).json({
        error: 'Service Unavailable',
        details: 'Calendar service is not initialized. Please check your configuration.',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    const { emails, dateTime, duration } = value;
    const slots = await calendar.getFreeSlots({ emails, dateTime, duration });
    res.json({ slots });
  } catch (error) {
    if (error.message.includes('Calendar not found')) {
      return res.status(404).json({
        error: 'Calendar Not Found',
        details: error.message,
        code: 'CALENDAR_NOT_FOUND'
      });
    }

    if (error.message.includes('Error accessing calendar')) {
      return res.status(403).json({
        error: 'Calendar Access Error',
        details: error.message,
        code: 'CALENDAR_ACCESS_ERROR'
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message,
      code: 'INTERNAL_ERROR'
    });
  }
});

// API route for scheduling a meeting
app.post('/api/schedule-meeting', async (req, res) => {
  try {
    const { error, value } = scheduleMeetingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation Error',
        details: error.details[0].message,
        code: 'VALIDATION_ERROR'
      });
    }

    if (!calendar) {
      return res.status(503).json({
        error: 'Service Unavailable',
        details: 'Calendar service is not initialized. Please check your configuration.',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    const { dateTime, duration, title, description, attendees, timeZone } = value;
    const meetingPayload = generateMeetingPayload(dateTime, duration, title, description, attendees, timeZone);
    const meetingEvent = await calendar.createMeetEvent(meetingPayload);
    res.json({ meetingEvent });
  } catch (error) {
    if (error.message.includes('OAuth credentials not configured')) {
      return res.status(401).json({
        error: 'Authentication Error',
        details: error.message,
        code: 'AUTH_ERROR'
      });
    }
    if (error.message.includes('Calendar not found')) {
      return res.status(404).json({
        error: 'Calendar Not Found',
        details: error.message,
        code: 'CALENDAR_NOT_FOUND'
      });
    }
    res.status(500).json({
      error: 'Internal Server Error',
      details: 'An unexpected error occurred. Please try again later.',
      code: 'INTERNAL_ERROR'
    });
  }
});

function generateMeetingPayload(dateTime, duration, title, description, attendees, timeZone) {
  const startDate = new Date(dateTime);
  const endDate = new Date(startDate.getTime() + duration * 60000);

  return {
    summary: title,
    description: description,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: timeZone
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: timeZone
    },
    attendees: attendees.map(email => ({ email })),
    reminders: {
      useDefault: true
    }
  };
}

// Default 404 handler
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Input validation schemas
const freeSlotsSchema = Joi.object({
  emails: Joi.array().items(Joi.string().email()).min(1).required(),
  dateTime: Joi.date().iso().required(),
  duration: Joi.number().integer().min(15).max(120).default(30),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  attendees: Joi.array().items(Joi.string().email()).optional()
});

const scheduleMeetingSchema = Joi.object({
  dateTime: Joi.date().iso().required(),
  duration: Joi.number().integer().min(15).max(120).default(30),
  title: Joi.string().required(),
  description: Joi.string().required(),
  attendees: Joi.array().items(Joi.string().email()).min(1).required(),
  timeZone: Joi.string().required()
});

const PORT = process.env.PORT || 8086;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { GoogleCalendarAPI, app };
