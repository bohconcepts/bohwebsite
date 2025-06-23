#!/bin/bash

# Make sure Terser is installed
echo "📦 Ensuring required dependencies are installed..."
npm install terser --save-dev

# Run the fix-supabase-auth.js script to fix dependency issues
echo "🔧 Running script to fix @supabase/auth-js..."
node ./scripts/fix-supabase-auth.js

# Clear Vite cache to ensure clean build
echo "🧹 Cleaning Vite cache..."
rm -rf node_modules/.vite 2>/dev/null || true

# Run the build command with NODE_ENV set to production
echo "🚀 Running build command..."
NODE_ENV=production npm run build

exit $?
