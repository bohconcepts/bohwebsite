// netlify-dev.js - Helper script to run Vite with Netlify functions
const { execSync } = require('child_process');
const path = require('path');

// Get the project directory
const projectDir = __dirname;

// Run the netlify dev command
console.log('Starting Netlify Dev environment with Vite...');

try {
  // Execute the command and pipe output to the console
  execSync('npx netlify dev', {
    stdio: 'inherit',
    cwd: projectDir
  });
} catch (error) {
  console.error('Error running Netlify Dev:', error.message);
  process.exit(1);
}
