// Simple test for a few sources only
const https = require('https');
const http = require('http');

// Test a couple of simple sources
const testSources = [
  { label: 'DPW', url: 'http://www.publicworks.gov.za/tenders.html' },
  { label: 'DIRCO', url: 'https://dirco.gov.za/tenders/' }
];

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

async function testScraper() {
  console.log('🧪 Testing tender scraper connectivity...\n');
  
  for (const source of testSources) {
    console.log(`📡 Testing ${source.label}: ${source.url}`);
    
    try {
      const startTime = Date.now();
      const result = await fetchUrl(source.url);
      const endTime = Date.now();
      
      console.log(`   ✅ Status: ${result.status}`);
      console.log(`   📏 Size: ${result.data.length} bytes`);
      console.log(`   ⏱️  Time: ${endTime - startTime}ms`);
      
      // Check for tender-related content
      const tenderKeywords = ['tender', 'bid', 'rfq', 'rfp', 'procurement', 'quotation'];
      const hasTenderContent = tenderKeywords.some(keyword => 
        result.data.toLowerCase().includes(keyword)
      );
      
      console.log(`   🔍 Tender content: ${hasTenderContent ? 'YES' : 'NO'}`);
      
      if (hasTenderContent) {
        // Look for reference numbers
        const refPattern = /\b[A-Z]{2,10}[\s\/\-]\d{2,6}[\s\/\-]\d{4}\b/g;
        const refs = result.data.match(refPattern) || [];
        console.log(`   📋 Found ${refs.length} reference numbers`);
        if (refs.length > 0) {
          console.log(`   📝 Sample refs: ${refs.slice(0, 3).join(', ')}`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

testScraper();
