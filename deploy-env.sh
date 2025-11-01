#!/bin/bash

# Deploy Environment Variables to Railway
# This script reads your .env file and sets all variables in Railway

echo "🚂 Deploying Environment Variables to Railway..."
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file first."
    exit 1
fi

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Error: Railway CLI not installed!"
    echo "Install with: npm install -g @railway/cli"
    exit 1
fi

# Counter for variables
count=0

# Read .env file and set variables
while IFS='=' read -r key value; do
    # Skip empty lines and comments
    if [ -z "$key" ] || [[ "$key" == \#* ]]; then
        continue
    fi
    
    # Remove quotes from value if present
    value=$(echo "$value" | sed 's/^["'\'']//' | sed 's/["'\'']$//')
    
    # Set variable in Railway
    echo "Setting: $key"
    railway variables --set "$key=$value"
    
    ((count++))
done < .env

echo ""
echo "✅ Successfully set $count environment variables in Railway!"
echo ""
echo "To verify, run: railway variables"
