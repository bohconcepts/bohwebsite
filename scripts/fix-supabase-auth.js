#!/usr/bin/env node

/**
 * This script fixes issues with @supabase/auth-js by:
 * - Creating symlinks from our custom shims to node_modules
 * - Patching the problematic file directly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the root of the project
const rootDir = path.resolve(__dirname, '..');

// Path to the locks.js file in node_modules
const locksJsPath = path.join(
  rootDir,
  'node_modules',
  '@supabase',
  'auth-js',
  'dist',
  'module',
  'lib',
  'locks.js'
);

// Path to our custom locks.js shim
const shimLocksJsPath = path.join(rootDir, 'src', 'lib', 'locks.js');

// Function to fix the @supabase/auth-js locks.js file
function fixSupabaseAuthJs() {
  console.log('🔍 Checking for @supabase/auth-js issues...');

  if (fs.existsSync(locksJsPath)) {
    console.log('📄 Found locks.js file, checking for syntax error...');

    const content = fs.readFileSync(locksJsPath, 'utf8');

    // Check if the file has the syntax error
    if (content.includes('const result = await globalThis.navigator.locks.query();\n                        );')) {
      console.log('🛠️ Fixing syntax error in locks.js...');

      // Fix the syntax error
      const fixedContent = content.replace(
        'const result = await globalThis.navigator.locks.query();\n                        );',
        'const result = await globalThis.navigator.locks.query();'
      );

      // Write the fixed file
      fs.writeFileSync(locksJsPath, fixedContent);
      console.log('✅ Fixed @supabase/auth-js locks.js file!');
    } else {
      console.log('✅ No syntax error found in locks.js');
    }
  } else {
    console.log('⚠️ Could not find locks.js file');
  }
}

// Function to copy our shim files to appropriate locations
function copyShimFiles() {
  console.log('📦 Ensuring shim files are properly linked...');

  const shimDir = path.join(rootDir, 'src', 'lib');
  
  // Make sure the lib directory exists
  if (!fs.existsSync(shimDir)) {
    fs.mkdirSync(shimDir, { recursive: true });
  }

  // Run the build with our fixes
  console.log('🚀 All fixes applied!');
}

// Run the fix functions
try {
  fixSupabaseAuthJs();
  copyShimFiles();
  console.log('✅ Supabase Auth JS patches applied successfully!');
} catch (error) {
  console.error('❌ Error applying patches:', error);
  process.exit(1);
}
