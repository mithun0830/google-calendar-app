#!/bin/bash

# Exit on any error
set -e

# Set project ID and region
PROJECT_ID="telusrecruitai"
REGION="asia-south1"

# Set environment variables
# IMPORTANT: Replace these placeholder values with your actual credentials before deployment
export GOOGLE_CLIENT_ID="your_google_client_id"
export GOOGLE_CLIENT_SECRET="your_google_client_secret"
export GOOGLE_REFRESH_TOKEN="your_google_refresh_token"
export FUELIX_API_KEY="your_fuelix_api_key"
export SERVICE_ACCOUNT_EMAIL="your_service_account_email"
export SERVICE_ACCOUNT_PRIVATE_KEY="your_service_account_private_key"

# Build the Docker image
docker build -t gcr.io/$PROJECT_ID/google-calendar-app .

# Configure Docker to use gcloud as a credential helper
gcloud auth configure-docker

# Push the image to Google Container Registry
docker push gcr.io/$PROJECT_ID/google-calendar-app

# Deploy to Cloud Run
gcloud run deploy google-calendar-app \
  --image gcr.io/$PROJECT_ID/google-calendar-app \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET,GOOGLE_REFRESH_TOKEN=$GOOGLE_REFRESH_TOKEN,FUELIX_API_KEY=$FUELIX_API_KEY,SERVICE_ACCOUNT_EMAIL=$SERVICE_ACCOUNT_EMAIL,SERVICE_ACCOUNT_PRIVATE_KEY=$SERVICE_ACCOUNT_PRIVATE_KEY" \
  --memory 256Mi \
  --cpu 1 \
  --max-instances 1

echo "Deployment completed successfully!"
