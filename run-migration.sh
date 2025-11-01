#!/bin/bash

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL is not set"
  echo "Please set DATABASE_URL in your .env file"
  exit 1
fi

echo "🔄 Running Supabase migration..."
echo ""

# Run the migration
psql "$DATABASE_URL" -f supabase-migration.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migration completed successfully!"
  echo "The 'agents' table has been created in your Supabase database."
else
  echo ""
  echo "❌ Migration failed. Please check the error messages above."
  exit 1
fi
