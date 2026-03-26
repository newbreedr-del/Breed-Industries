/**
 * Replace Em Dashes with Commas Script
 * 
 * This script finds all em dashes (—) in the codebase and replaces them with commas
 * Em dashes are the long dashes (—) that should be commas (,)
 */

const fs = require('fs');
const path = require('path');

// Directories to search
const directories = [
  'src/app',
  'src/components',
  'src/lib',
  'src/app/admin',
  'public'
];

// File extensions to process
const extensions = ['.tsx', '.ts', '.jsx', '.js', '.md', '.html'];

let totalFiles = 0;
let totalReplacements = 0;

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Count em dashes before replacement
    const emDashCount = (content.match(/—/g) || []).length;
    
    if (emDashCount > 0) {
      // Replace em dashes with commas
      const updatedContent = content.replace(/—/g, ',');
      
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      
      console.log(`✅ ${filePath.replace(process.cwd() + '/', '')}: ${emDashCount} em dash(es) → comma(s)`);
      
      totalFiles++;
      totalReplacements += emDashCount;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function findFiles(dir, fileList = []) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Recursively search subdirectories
        findFiles(filePath, fileList);
      } else if (extensions.some(ext => file.endsWith(ext))) {
        // Process files with matching extensions
        fileList.push(filePath);
      }
    });
  } catch (error) {
    // Skip directories that can't be read
  }
  
  return fileList;
}

console.log('🔍 Replacing em dashes (—) with commas (,)...\n');

// Find all relevant files
const allFiles = [];
directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = findFiles(dir);
    allFiles.push(...files);
  }
});

// Remove duplicates
const uniqueFiles = [...new Set(allFiles)];

console.log(`📁 Found ${uniqueFiles.length} files to check\n`);

// Process each file
uniqueFiles.forEach(file => {
  processFile(file);
});

console.log('\n🎉 Replacement complete!');
console.log(`📊 Summary:`);
console.log(`   • Files modified: ${totalFiles}`);
console.log(`   • Total replacements: ${totalReplacements}`);
console.log(`   • Em dashes → commas`);

if (totalReplacements > 0) {
  console.log('\n✨ All em dashes have been replaced with commas!');
  console.log('🚀 Your site now uses commas instead of em dashes throughout.');
} else {
  console.log('\nℹ️  No em dashes found in the codebase.');
}
