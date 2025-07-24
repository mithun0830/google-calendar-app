#!/bin/bash

# Exit on any error
set -e

# Set project ID and region
PROJECT_ID="telusrecruitai"
REGION="asia-south1"

# Set environment variables
export GOOGLE_CLIENT_ID="865090871947-8hmkitvfbksc8dn9u7b9suk2mhnkq4f9.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="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"
export GOOGLE_REFRESH_TOKEN="1//0gB8dpZiUnFbfCgYIARAAGBASNwF-L9Ir1tjcybYeqvUgM8Amg_kKU9EstRqD_geNZXJGWxf0rhsEufhcUl6BcXDmonvP_gMobb0"
export FUELIX_API_KEY="nHeX0UQumAogwKoOX9k6RSDrPDAyLGgTKoCMqYlinqGrSKLw"
export SERVICE_ACCOUNT_EMAIL="telusrecurit-calander@telusrecruitai.iam.gserviceaccount.com"
export SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC1iGh9oq4gxtJS\nDXkoiivGOXgThG6xLjwZMzRErsNvl15/lfTIv5UgX0pADM/iOon9Qr253XSvjkp+\nvz7XzW/b4dSMVaD8595RkwMfQgsjVmB41V2vyMUWfU2LU/qMicJyM79tiLQt7yN6\nptWwUCdSAP0xgU4vvhDOZNlovmm3qySpKZSPbZc1LXfBxRPH03QhsCgw/JJaaN6c\nBx0imW23dW7eH1N/ap7Sl3gByqhXrURLTg/9qKtDBiTWpfgaHOrCVrqDfjMbbmQ0\nUcivQqbd7Uo8RnCH2AhBTNt+tQwaRx4eGMrWHneFkF+F7HoMLaW6c6jjDPjA5BPp\nGb4QijEpAgMBAAECggEAJqfe9E3lfXZJCA71a1QM4T+QmbtcJN+fDZCxQyTh2gvm\nJA4HG45sT4HrGjuAMwDbLHJ/WypUtCN9KoNH+wU0miJ7M8zyJJitZzqCcjAKliJJ\nFcH9mraKfXD+R7qAwld9b/sj+sue7p8bM31+SHaxAM3UHKwXvaPgCUtBXoQZl/H+\nYvqctU7p6ayJB2pTumSJBWwIG7b4Fsn2GdW/ZdQnoci4qxaVZ49RDJFmFUcHw3wd\nktc3XqdAuaDnsr+GSqzRhNbYLVQdHxaQAp48ZUrOloZyUcDM5hAFF6pw42vkYGGn\nzqQ7MECd7cB5q2MA6volitNQU/c4spg0YvF72kYVLwKBgQDZAd978ytLeMSVfXPe\nxWJ6ExLCoVRyt1N7nSIWc3YENY3ESianEBShvzGu+O5EbXXJ0OJ7zW5YWzAVtboB\nqc0a7+acKJPRbQVSveAlLccVA40FRC1ZSvzScfz41LXiPcsKac0zeobk2yWD/OjC\nMuKlmn2zLww5bZGbbX0q1izL0wKBgQDWJr5k0Bsp+zrRe6U6rtfAMRBeCRxv/QFI\nnuc0bG3obkxBsxZfZ92mWOwiVtkymxw+43GQd4m4EN6OOOu5M+TKCm+DTuwiZAWk\nTaITabk1NaoZCBLOHvdY2kf6Z1tfmq8f+utHcT3ZVqRbvCUzF+1tYeH2RETBPJPN\nn7lltjTdkwKBgQCBYDx9CVymgjmxZjnOdp9faD+nCcfvHJ0I9YV9HRkfKU572Dlz\nIIMsa3CTgJWM9jVjPMXKSY+f3b2tM8rRcwp1JNG4B/kYwoaJ7enUQJaQUK2iliLz\nOWHBlXPcZfSKDY0fiDRunH4PsxeKuR2Lqgq18IVAbqw7ELfekkgtYcMTQQKBgQCK\n7U+O70LwFT+vLtueGld1I19O4fJE5Im0pwGvDLiwlP17kcbt1eABTqbCED2Pivjk\nA4FlC2eYtbjr4xlpaLUALYzyTnz6QpE2afa/SVMRpeLXolkwxv4H8nPHis3IU/1Q\nbeO80UYifQbbTE+FufwZfeqtbNR91+K6/ueziGT7aQKBgQC1Lie8R1eA+jqLMu73\nBBVQEt1jb2sKcSpqsUFmLDv/w4IROepCdpM7x2t1Wlgvw7D/hRaKPpRjFxjf8Ruo\nnjf4XozTgNQ+vwYpWjmxeApmod64eXAePfnCfk6PzUYVgl1Nvy8Qpkwn/SrGwE30\nYtmNNCrgZESmqR3PRXzX2QPBPg==\n-----END PRIVATE KEY-----\n"

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
