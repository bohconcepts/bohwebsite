#!/bin/bash
# This script sets up and runs Netlify Dev for local development

# Install netlify-cli if it doesn't exist
if ! command -v netlify &> /dev/null; then
  echo "Installing netlify-cli..."
  npm install -g netlify-cli
fi

# Check if .env file exists, create it if not
if [ ! -f .env ]; then
  echo "Creating .env file with sample email credentials..."
  cat > .env <<EOF
# Email configuration
EMAIL_USER=contact@bohconcepts.com
EMAIL_PASSWORD=your_password_here
COMPANY_EMAIL=info@bohconcepts.com
SMTP_HOST=smtpout.secureserver.net
SMTP_PORT=587
SMTP_SECURE=false

# Other environment variables
VITE_APP_ENV=development
EOF
  echo ".env file created. Please update the credentials."
else
  echo ".env file already exists."
fi

# Run netlify dev to serve both the frontend and functions
echo "Starting Netlify Dev server..."
netlify dev
