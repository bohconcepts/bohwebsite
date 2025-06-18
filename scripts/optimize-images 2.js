#!/usr/bin/env node

/**
 * Image Optimization Script for BOH Website
 * 
 * This script:
 * 1. Converts images to WebP format
 * 2. Creates responsive image sizes
 * 3. Optimizes existing images
 * 
 * Usage: node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if sharp is installed
try {
  require.resolve('sharp');
} catch (e) {
  console.log('Installing required dependencies...');
  execSync('npm install --save-dev sharp');
}

const sharp = require('sharp');

// Configuration
const config = {
  sourceDir: path.join(__dirname, '../public/images'),
  webpDir: path.join(__dirname, '../public/images/webp'),
  // Define sizes for responsive images
  sizes: {
    sm: 640,
    md: 768,
    lg: 1024
  },
  // Skip these directories
  skipDirs: ['webp'],
  // Only process these extensions
  extensions: ['.jpg', '.jpeg', '.png', '.gif'],
  // Quality settings
  quality: {
    webp: 80,
    jpeg: 85,
    png: 85
  }
};

// Create webp directory if it doesn't exist
if (!fs.existsSync(config.webpDir)) {
  fs.mkdirSync(config.webpDir, { recursive: true });
}

// Process a single image
async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath, ext);
  const dir = path.dirname(filePath);
  const relativeDir = path.relative(config.sourceDir, dir);
  
  // Skip if not in allowed extensions
  if (!config.extensions.includes(ext)) {
    return;
  }
  
  console.log(`Processing: ${filePath}`);
  
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Create WebP version
    const webpPath = path.join(config.webpDir, `${fileName}.webp`);
    await image.webp({ quality: config.quality.webp }).toFile(webpPath);
    console.log(`Created WebP: ${webpPath}`);
    
    // Create responsive sizes
    for (const [size, width] of Object.entries(config.sizes)) {
      // Only resize if original is larger than target
      if (metadata.width > width) {
        const resizedPath = path.join(dir, `${fileName}-${size}${ext}`);
        await sharp(filePath)
          .resize({ width, withoutEnlargement: true })
          .toFile(resizedPath);
        console.log(`Created ${size}: ${resizedPath}`);
        
        // Also create WebP version of the responsive image
        const resizedWebpPath = path.join(config.webpDir, `${fileName}-${size}.webp`);
        await sharp(resizedPath)
          .webp({ quality: config.quality.webp })
          .toFile(resizedWebpPath);
        console.log(`Created WebP ${size}: ${resizedWebpPath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Process all images in a directory recursively
async function processDirectory(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      // Skip directories in the skipDirs list
      const dirName = path.basename(fullPath);
      if (config.skipDirs.includes(dirName)) {
        console.log(`Skipping directory: ${fullPath}`);
        continue;
      }
      
      await processDirectory(fullPath);
    } else {
      await processImage(fullPath);
    }
  }
}

// Main function
async function main() {
  console.log('Starting image optimization...');
  await processDirectory(config.sourceDir);
  console.log('Image optimization complete!');
}

main().catch(console.error);
