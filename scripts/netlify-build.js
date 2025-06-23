#!/usr/bin/env node

/**
 * This is a special build script for Netlify that:
 * 1. Applies patches to fix issues with dependencies
 * 2. Runs the build process with proper environment variables
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix the @supabase/auth-js locks.js file directly
function fixSupabaseAuthJs() {
  console.log('🔧 Checking for @supabase/auth-js issues...');
  
  const locksFilePath = path.join(
    process.cwd(),
    'node_modules',
    '@supabase',
    'auth-js',
    'dist',
    'module',
    'lib',
    'locks.js'
  );

  if (fs.existsSync(locksFilePath)) {
    console.log('📄 Found locks.js file, checking for syntax error...');
    
    let content = fs.readFileSync(locksFilePath, 'utf8');
    
    // Check if the file has the syntax error
    if (content.includes('const result = await globalThis.navigator.locks.query();\n                        );')) {
      console.log('🛠️ Fixing syntax error in locks.js...');
      
      // Fix the syntax error
      content = content.replace(
        'const result = await globalThis.navigator.locks.query();\n                        );',
        'const result = await globalThis.navigator.locks.query();'
      );
      
      // Write the fixed file
      fs.writeFileSync(locksFilePath, content);
      console.log('✅ Fixed @supabase/auth-js locks.js file!');
    } else {
      console.log('✅ No syntax error found in locks.js');
    }
  } else {
    console.log('⚠️ Could not find locks.js file');
  }
}

// Apply fixes
try {
  fixSupabaseAuthJs();
  
  // Run the build command with proper environment variables
  console.log('🚀 Running build command...');
  execSync('NODE_ENV=production npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
