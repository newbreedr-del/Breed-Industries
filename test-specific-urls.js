// Test specific URLs to find working endpoints
const https = require('https');
const http = require('http');

async function testUrl(url, label) {
  console.log(`🔍 Testing ${label}: ${url}`);
  
  try {
    const startTime = Date.now();
    const response = await new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, { timeout: 10000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          data, 
          headers: res.headers,
          finalUrl: res.responseUrl || url
        }));
      });
      
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response.status === 200) {
      const tenderKeywords = ['tender', 'bid', 'rfq', 'rfp', 'procurement', 'quotation'];
      const hasTenderContent = tenderKeywords.some(keyword => 
        response.data.toLowerCase().includes(keyword)
      );
      
      console.log(`   ✅ ${responseTime}ms | ${response.data.length} bytes | Tender: ${hasTenderContent ? 'YES' : 'NO'}`);
      
      if (hasTenderContent) {
        // Look for reference numbers
        const refPattern = /\b([A-Z]{2,10}[\s\/\-]\d{2,6}[\s\/\-]\d{4}(?:[\/\-]\d{2,4})?|(?:BID|RFQ|RFP|EOI|SCM|QUO|TEN)[\s\/\-]?(?:NO\.?\s*)?[A-Z0-9\/\-]{4,20})\b/gi;
        const refs = response.data.match(refPattern) || [];
        console.log(`   📋 Found ${refs.length} reference numbers`);
        if (refs.length > 0) {
          console.log(`   📝 Sample refs: ${refs.slice(0, 3).join(', ')}`);
        }
      }
      
      return { success: true, hasTenderContent, refCount: refs.length };
    } else {
      console.log(`   ❌ HTTP ${response.status}`);
      if (response.status >= 300 && response.status < 400) {
        console.log(`   🔄 Redirect to: ${response.headers.location || 'Unknown'}`);
      }
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testSpecificUrls() {
  console.log('🧪 Testing specific tender URL variations...\n');
  
  // Test DPSA variations
  console.log('\n📡 DPSA VARIATIONS:');
  await testUrl('https://www.dpsa.gov.za/tenders', 'DPSA /tenders');
  await testUrl('https://www.dpsa.gov.za/content/tenders', 'DPSA /content/tenders');
  await testUrl('https://www.dpsa.gov.za/procurement', 'DPSA /procurement');
  await testUrl('https://www.dpsa.gov.za/tender-notices', 'DPSA /tender-notices');
  
  // Test DBE variations
  console.log('\n📡 DBE VARIATIONS:');
  await testUrl('https://www.education.gov.za/tenders', 'DBE /tenders');
  await testUrl('https://www.education.gov.za/procurement', 'DBE /procurement');
  await testUrl('https://www.education.gov.za/tender-notices', 'DBE /tender-notices');
  
  // Test DSD variations
  console.log('\n📡 DSD VARIATIONS:');
  await testUrl('https://www.dsd.gov.za/tenders', 'DSD /tenders');
  await testUrl('https://www.dsd.gov.za/procurement', 'DSD /procurement');
  await testUrl('https://www.dsd.gov.za/tender-notices', 'DSD /tender-notices');
  
  // Test DTIC variations
  console.log('\n📡 DTIC VARIATIONS:');
  await testUrl('https://www.thedti.gov.za/tenders', 'DTIC /tenders');
  await testUrl('https://www.thedti.gov.za/procurement', 'DTIC /procurement');
  await testUrl('https://www.thedti.gov.za/tender-opportunities', 'DTIC /tender-opportunities');
  
  // Test COGTA variations
  console.log('\n📡 COGTA VARIATIONS:');
  await testUrl('https://www.cogta.gov.za/tenders', 'COGTA /tenders');
  await testUrl('https://www.cogta.gov.za/procurement', 'COGTA /procurement');
  await testUrl('https://cogta.gov.za/tender-notices', 'COGTA /tender-notices');
  
  // Test National Treasury variations
  console.log('\n📡 TREASURY VARIATIONS:');
  await testUrl('https://www.treasury.gov.za/tenders', 'Treasury /tenders');
  await testUrl('https://www.treasury.gov.za/procurement', 'Treasury /procurement');
  await testUrl('https://www.treasury.gov.za/tender-opportunities', 'Treasury /tender-opportunities');
}

testSpecificUrls();
