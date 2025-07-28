const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:8086/oauth2callback';

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Generate auth url
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar'
  ],
  prompt: 'consent' // Force to generate new refresh token
});

// Create local server to handle the callback
const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    if (parsedUrl.pathname === '/oauth2callback') {
      const { code } = parsedUrl.query;
      
      // Get tokens
      const { tokens } = await oauth2Client.getToken(code);
      
      // Update .env file with new refresh token
      const envPath = path.join(__dirname, '.env');
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Replace old refresh token with new one
      envContent = envContent.replace(
        /GOOGLE_REFRESH_TOKEN=.*/,
        `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`
      );
      
      fs.writeFileSync(envPath, envContent);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <body>
            <h1>Success!</h1>
            <p>New refresh token has been generated and saved to .env file.</p>
            <p>You can close this window and restart your application.</p>
          </body>
        </html>
      `);
      
      console.log('✅ New refresh token has been saved to .env file');
      console.log('🔄 Please restart your application');
      
      // Close the server
      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 1000);
    }
  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error occurred during token generation');
  }
});

// Start server and provide auth URL
server.listen(8086, () => {
  console.log('1. Starting authentication process...');
  console.log('2. Please open the following URL in your browser:');
  console.log(authUrl);
  console.log('3. Complete the authorization in your browser');
});
