// Test all scraper sources
const https = require('https');
const http = require('http');

// Load sources from scraper file
const fs = require('fs');
const path = require('path');

// Read the scraper file to extract SOURCES
const scraperContent = fs.readFileSync(path.join(__dirname, 'src/lib/tenderScraper.ts'), 'utf8');
const sourcesMatch = scraperContent.match(/const SOURCES: Source\[\] = \[([\s\S]*?)\];/);
const sourcesText = sourcesMatch ? sourcesMatch[1] : '';

// Parse sources manually
const sources = [];
const sourceLines = sourcesText.split('\n');
let currentSource = null;

for (const line of sourceLines) {
  if (line.includes('label:') && line.includes('{')) {
    currentSource = {};
    const labelMatch = line.match(/label:\s*['"]([^'"]+)['"]/);
    if (labelMatch) currentSource.label = labelMatch[1];
  }
  if (line.includes('domain:') && currentSource) {
    const domainMatch = line.match(/domain:\s*['"]([^'"]+)['"]/);
    if (domainMatch) currentSource.domain = domainMatch[1];
  }
  if (line.includes('url:') && currentSource) {
    const urlMatch = line.match(/url:\s*['"]([^'"]+)['"]/);
    if (urlMatch) currentSource.url = urlMatch[1];
  }
  if (line.includes('}') && currentSource && currentSource.label && currentSource.url) {
    sources.push({...currentSource});
    currentSource = null;
  }
}

async function fetchUrl(url, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testAllSources() {
  console.log('🧪 Testing ALL tender scraper sources...\n');
  
  const results = {
    success: [],
    timeout: [],
    error: [],
    noTenderContent: []
  };
  
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    console.log(`[${i + 1}/${sources.length}] 📡 ${source.label}: ${source.url}`);
    
    try {
      const startTime = Date.now();
      const result = await fetchUrl(source.url);
      const endTime = Date.now();
      
      if (result.status === 200) {
        // Check for tender-related content
        const tenderKeywords = ['tender', 'bid', 'rfq', 'rfp', 'procurement', 'quotation', 'bid document'];
        const hasTenderContent = tenderKeywords.some(keyword => 
          result.data.toLowerCase().includes(keyword)
        );
        
        const responseTime = endTime - startTime;
        
        if (hasTenderContent) {
          // Look for reference numbers
          const refPattern = /\b([A-Z]{2,10}[\s\/\-]\d{2,6}[\s\/\-]\d{4}(?:[\/\-]\d{2,4})?|(?:BID|RFQ|RFP|EOI|SCM|QUO|TEN)[\s\/\-]?(?:NO\.?\s*)?[A-Z0-9\/\-]{4,20})\b/gi;
          const refs = result.data.match(refPattern) || [];
          
          results.success.push({
            ...source,
            status: result.status,
            size: result.data.length,
            time: responseTime,
            refCount: refs.length,
            refs: refs.slice(0, 3)
          });
          
          console.log(`   ✅ ${responseTime}ms | ${result.data.length} bytes | ${refs.length} refs | ${refs.slice(0, 2).join(', ')}`);
        } else {
          results.noTenderContent.push({
            ...source,
            status: result.status,
            size: result.data.length,
            time: responseTime
          });
          console.log(`   ⚠️  ${responseTime}ms | ${result.data.length} bytes | NO TENDER CONTENT`);
        }
      } else {
        results.error.push({
          ...source,
          status: result.status,
          time: Date.now() - startTime
        });
        console.log(`   ❌ HTTP ${result.status}`);
      }
    } catch (error) {
      if (error.message.includes('timeout')) {
        results.timeout.push({
          ...source,
          error: error.message
        });
        console.log(`   ⏱️  TIMEOUT`);
      } else {
        results.error.push({
          ...source,
          error: error.message
        });
        console.log(`   ❌ ERROR: ${error.message}`);
      }
    }
    
    // Small delay between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Summary
  console.log('\n📊 SUMMARY:');
  console.log(`✅ Success: ${results.success.length}`);
  console.log(`⏱️  Timeouts: ${results.timeout.length}`);
  console.log(`❌ Errors: ${results.error.length}`);
  console.log(`⚠️  No tender content: ${results.noTenderContent.length}`);
  
  if (results.success.length > 0) {
    console.log('\n🎯 SUCCESSFUL SOURCES:');
    results.success.forEach(s => {
      console.log(`   ${s.label}: ${s.time}ms | ${s.size} bytes | ${s.refCount} refs`);
    });
  }
  
  if (results.timeout.length > 0) {
    console.log('\n⏱️  TIMEOUT SOURCES:');
    results.timeout.forEach(s => {
      console.log(`   ${s.label}: ${s.error}`);
    });
  }
  
  if (results.error.length > 0) {
    console.log('\n❌ ERROR SOURCES:');
    results.error.forEach(s => {
      console.log(`   ${s.label}: ${s.error}`);
    });
  }
  
  if (results.noTenderContent.length > 0) {
    console.log('\n⚠️  NO TENDER CONTENT:');
    results.noTenderContent.forEach(s => {
      console.log(`   ${s.label}: ${s.time}ms | ${s.size} bytes`);
    });
  }
  
  return results;
}

testAllSources();
