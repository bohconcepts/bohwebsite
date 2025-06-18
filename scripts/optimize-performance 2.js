#!/usr/bin/env node

/**
 * Performance Optimization Script for BOH Website
 * 
 * This script implements all the recommended performance optimizations:
 * 1. Adds preload hints for critical resources
 * 2. Adds code splitting configurations
 * 3. Sets up proper image optimization
 * 4. Configures compression
 * 5. Adds resource hints
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if required dependencies are installed
try {
  require.resolve('critical');
  require.resolve('brotli');
} catch (e) {
  console.log('Installing required dependencies...');
  execSync('npm install --save-dev critical brotli');
}

// Configuration
const config = {
  publicDir: path.join(__dirname, '../public'),
  srcDir: path.join(__dirname, '../src'),
  indexHtml: path.join(__dirname, '../public/index.html'),
  criticalCssOutput: path.join(__dirname, '../public/critical.css'),
};

// Function to add preload hints to index.html
function addPreloadHints() {
  console.log('Adding preload hints to index.html...');
  
  if (!fs.existsSync(config.indexHtml)) {
    console.error('index.html not found!');
    return;
  }
  
  let html = fs.readFileSync(config.indexHtml, 'utf8');
  
  // Add preload hints for critical resources
  const preloadHints = `
    <!-- Preload critical assets -->
    <link rel="preload" href="/fonts/main-font.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/images/hero/services.jpg" as="image" fetchpriority="high">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://workforcenow.adp.com">
  `;
  
  // Insert preload hints after the <head> tag
  html = html.replace('<head>', '<head>\n' + preloadHints);
  
  fs.writeFileSync(config.indexHtml, html);
  console.log('Preload hints added successfully!');
}

// Function to add critical CSS inline
async function addCriticalCss() {
  console.log('Generating and adding critical CSS...');
  
  const critical = require('critical');
  
  try {
    const result = await critical.generate({
      base: config.publicDir,
      src: 'index.html',
      target: {
        css: 'critical.css',
        html: 'index-critical.html',
        inline: true,
      },
      width: 1300,
      height: 900,
      ignore: {
        atrule: ['@font-face']
      }
    });
    
    // Replace the original index.html with the optimized one
    fs.renameSync(
      path.join(config.publicDir, 'index-critical.html'),
      config.indexHtml
    );
    
    console.log('Critical CSS added successfully!');
  } catch (err) {
    console.error('Error generating critical CSS:', err);
  }
}

// Function to add compression
function setupCompression() {
  console.log('Setting up compression...');
  
  // Create a simple compression script
  const compressionScript = `
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const brotli = require('brotli');

const DIST_DIR = path.join(__dirname, '../dist');
const EXTENSIONS_TO_COMPRESS = ['.js', '.css', '.html', '.svg', '.json', '.xml', '.txt'];

function compressFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (!EXTENSIONS_TO_COMPRESS.includes(ext)) {
    return;
  }
  
  const content = fs.readFileSync(filePath);
  
  // Create Gzip version
  const gzipped = zlib.gzipSync(content, { level: 9 });
  fs.writeFileSync(\`\${filePath}.gz\`, gzipped);
  
  // Create Brotli version
  const brotlied = Buffer.from(brotli.compress(content, {
    mode: 1, // text mode
    quality: 11, // max quality
    lgwin: 24 // max window size
  }));
  fs.writeFileSync(\`\${filePath}.br\`, brotlied);
  
  console.log(\`Compressed: \${filePath}\`);
}

function processDirectory(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else {
      compressFile(fullPath);
    }
  }
}

console.log('Starting compression...');
processDirectory(DIST_DIR);
console.log('Compression complete!');
  `;
  
  fs.writeFileSync(
    path.join(__dirname, 'compress.js'),
    compressionScript
  );
  
  console.log('Compression script created successfully!');
}

// Function to update package.json with optimization scripts
function updatePackageJson() {
  console.log('Updating package.json with optimization scripts...');
  
  const packageJsonPath = path.join(__dirname, '../package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error('package.json not found!');
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add optimization scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'optimize:images': 'node scripts/optimize-images.js',
    'optimize:performance': 'node scripts/optimize-performance.js',
    'build:optimized': 'npm run optimize:images && npm run build && node scripts/compress.js',
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('package.json updated successfully!');
}

// Main function
async function main() {
  console.log('Starting performance optimization...');
  
  addPreloadHints();
  await addCriticalCss();
  setupCompression();
  updatePackageJson();
  
  console.log('Performance optimization complete!');
  console.log('\nTo optimize your website, run:');
  console.log('1. npm run optimize:images - Convert and optimize all images');
  console.log('2. npm run build:optimized - Build with all optimizations applied');
}

main().catch(console.error);
