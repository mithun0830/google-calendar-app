# Google Calendar App

## Overview

This is a Node.js application that interacts with Google Calendar API to find free time slots and schedule meetings. It provides a RESTful API for clients to query available time slots and create new meeting events.

<!-- export GOOGLE_CLIENT_ID="865090871947-8hmkitvfbksc8dn9u7b9suk2mhnkq4f9.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="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"
export GOOGLE_REFRESH_TOKEN="1//0gB8dpZiUnFbfCgYIARAAGBASNwF-L9Ir1tjcybYeqvUgM8Amg_kKU9EstRqD_geNZXJGWxf0rhsEufhcUl6BcXDmonvP_gMobb0"
export FUELIX_API_KEY="nHeX0UQumAogwKoOX9k6RSDrPDAyLGgTKoCMqYlinqGrSKLw"
export SERVICE_ACCOUNT_EMAIL="telusrecurit-calander@telusrecruitai.iam.gserviceaccount.com"
export SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC1iGh9oq4gxtJS\nDXkoiivGOXgThG6xLjwZMzRErsNvl15/lfTIv5UgX0pADM/iOon9Qr253XSvjkp+\nvz7XzW/b4dSMVaD8595RkwMfQgsjVmB41V2vyMUWfU2LU/qMicJyM79tiLQt7yN6\nptWwUCdSAP0xgU4vvhDOZNlovmm3qySpKZSPbZc1LXfBxRPH03QhsCgw/JJaaN6c\nBx0imW23dW7eH1N/ap7Sl3gByqhXrURLTg/9qKtDBiTWpfgaHOrCVrqDfjMbbmQ0\nUcivQqbd7Uo8RnCH2AhBTNt+tQwaRx4eGMrWHneFkF+F7HoMLaW6c6jjDPjA5BPp\nGb4QijEpAgMBAAECggEAJqfe9E3lfXZJCA71a1QM4T+QmbtcJN+fDZCxQyTh2gvm\nJA4HG45sT4HrGjuAMwDbLHJ/WypUtCN9KoNH+wU0miJ7M8zyJJitZzqCcjAKliJJ\nFcH9mraKfXD+R7qAwld9b/sj+sue7p8bM31+SHaxAM3UHKwXvaPgCUtBXoQZl/H+\nYvqctU7p6ayJB2pTumSJBWwIG7b4Fsn2GdW/ZdQnoci4qxaVZ49RDJFmFUcHw3wd\nktc3XqdAuaDnsr+GSqzRhNbYLVQdHxaQAp48ZUrOloZyUcDM5hAFF6pw42vkYGGn\nzqQ7MECd7cB5q2MA6volitNQU/c4spg0YvF72kYVLwKBgQDZAd978ytLeMSVfXPe\nxWJ6ExLCoVRyt1N7nSIWc3YENY3ESianEBShvzGu+O5EbXXJ0OJ7zW5YWzAVtboB\nqc0a7+acKJPRbQVSveAlLccVA40FRC1ZSvzScfz41LXiPcsKac0zeobk2yWD/OjC\nMuKlmn2zLww5bZGbbX0q1izL0wKBgQDWJr5k0Bsp+zrRe6U6rtfAMRBeCRxv/QFI\nnuc0bG3obkxBsxZfZ92mWOwiVtkymxw+43GQd4m4EN6OOOu5M+TKCm+DTuwiZAWk\nTaITabk1NaoZCBLOHvdY2kf6Z1tfmq8f+utHcT3ZVqRbvCUzF+1tYeH2RETBPJPN\nn7lltjTdkwKBgQCBYDx9CVymgjmxZjnOdp9faD+nCcfvHJ0I9YV9HRkfKU572Dlz\nIIMsa3CTgJWM9jVjPMXKSY+f3b2tM8rRcwp1JNG4B/kYwoaJ7enUQJaQUK2iliLz\nOWHBlXPcZfSKDY0fiDRunH4PsxeKuR2Lqgq18IVAbqw7ELfekkgtYcMTQQKBgQCK\n7U+O70LwFT+vLtueGld1I19O4fJE5Im0pwGvDLiwlP17kcbt1eABTqbCED2Pivjk\nA4FlC2eYtbjr4xlpaLUALYzyTnz6QpE2afa/SVMRpeLXolkwxv4H8nPHis3IU/1Q\nbeO80UYifQbbTE+FufwZfeqtbNR91+K6/ueziGT7aQKBgQC1Lie8R1eA+jqLMu73\nBBVQEt1jb2sKcSpqsUFmLDv/w4IROepCdpM7x2t1Wlgvw7D/hRaKPpRjFxjf8Ruo\nnjf4XozTgNQ+vwYpWjmxeApmod64eXAePfnCfk6PzUYVgl1Nvy8Qpkwn/SrGwE30\nYtmNNCrgZESmqR3PRXzX2QPBPg==\n-----END PRIVATE KEY-----\n" -->


## Features

1. Find free time slots across multiple calendars
2. Schedule meetings with Google Meet integration
3. OAuth2 authentication for write operations
4. Service Account authentication for read-only operations
5. Input validation using Joi
6. Logging functionality
7. CORS support for development
8. Swagger documentation

## Main Components

### 1. GoogleCalendarAPI Class

This class handles interactions with the Google Calendar API. It includes methods for:

- Initializing OAuth2 and Service Account clients
- Getting free slots from multiple calendars
- Creating meeting events with Google Meet integration

### 2. Express Server

The application uses Express.js to create a web server with the following routes:

- `POST /api/free-slots`: Find free time slots across multiple calendars
- `POST /api/schedule-meeting`: Schedule a new meeting with Google Meet integration
- Static file serving for HTML pages and Swagger documentation

### 3. Input Validation

The application uses Joi for input validation on the API endpoints, ensuring that the received data is in the correct format and contains all required fields.

## Environment Variables

The application uses the following environment variables:

- `GOOGLE_CLIENT_ID`: OAuth2 client ID
- `GOOGLE_CLIENT_SECRET`: OAuth2 client secret
- `GOOGLE_REFRESH_TOKEN`: OAuth2 refresh token
- `FUELIX_API_KEY`: API key for Fuelix (usage not shown in the provided code)
- `SERVICE_ACCOUNT_EMAIL`: Email address of the Google Cloud service account
- `SERVICE_ACCOUNT_PRIVATE_KEY`: Private key of the Google Cloud service account
- `PORT`: (Optional) Port number for the server to listen on (defaults to 8086)

These variables should be set in a `.env` file in the root directory of the project.

## Deployment

The application is containerized using Docker and deployed to Google Cloud Run. The deployment process is automated using a bash script (`deploy.sh`).

### Deployment Steps

1. Build a Docker image
2. Push the image to Google Container Registry
3. Deploy the image to Cloud Run

### Deployment Configuration

- Project ID: telusrecruitai
- Region: asia-south1
- Memory: 256Mi
- CPU: 1
- Max Instances: 1
- Unauthenticated access allowed

## Setup and Running Locally

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the `.env` file with the required environment variables
4. Run the server: `npm start`

The server will start on the specified port (default 8086).

## API Documentation

API documentation is available via Swagger. Access it by navigating to the `/swagger.html` endpoint when the server is running.

## Security Considerations

- The application uses OAuth2 for write operations and a Service Account for read-only operations.
- Sensitive information (like API keys and private keys) is stored in environment variables.
- Input validation is performed on all API endpoints to prevent malformed data.
- A `.gitignore` file is included to prevent sensitive files from being committed to version control:
  - `.env` file containing environment variables
  - `gsa-key.json` containing service account credentials
  - `deploy.sh` containing deployment configuration
  - Log files and other sensitive data

## Credential Management

Before running the application or deploying, you need to:

1. Create a `.env` file with your Google Calendar API credentials:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
FUELIX_API_KEY=your_fuelix_api_key
SERVICE_ACCOUNT_EMAIL=your_service_account_email
SERVICE_ACCOUNT_PRIVATE_KEY="your_service_account_private_key"
```

2. Update the `deploy.sh` script with your actual credentials before deployment.

3. Keep all credential files secure and never commit them to version control.

## Notes

- The application is set up to handle CORS for development purposes. In a production environment, you may want to restrict the allowed origins.
- The current setup allows unauthenticated access to the Cloud Run service. Depending on your security requirements, you might want to change this.
- Always follow security best practices when handling credentials and sensitive information.
