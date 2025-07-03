// netlify-dev.js - Helper script to run Vite with Netlify functions
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the project directory
const __filename = fileURLToPath(import.meta.url);
const projectDir = dirname(__filename);

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
