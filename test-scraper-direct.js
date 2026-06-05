// Direct test using the actual scraper
const fs = require('fs');
const path = require('path');

// Read and execute the scraper
async function testScraper() {
  console.log('🧪 Testing scraper with actual functions...\n');
  
  try {
    // Import the scraper by reading and evaling the TypeScript file
    const scraperPath = path.join(__dirname, 'src/lib/tenderScraper.ts');
    const scraperContent = fs.readFileSync(scraperPath, 'utf8');
    
    // Extract just the sources section
    const sourcesSection = scraperContent.match(/const SOURCES: Source\[\] = \[([\s\S]*?)\];/);
    if (!sourcesSection) {
      console.log('❌ Could not extract sources from scraper file');
      return;
    }
    
    // Simple regex to extract source info
    const sourceRegex = /{\s*label:\s*['"]([^'"]+)['"],\s*domain:\s*['"]([^'"]+)['"],\s*province:\s*['"]([^'"]+)['"],\s*strategy:\s*['"]([^'"]+)['"],\s*url:\s*['"]([^'"]+)['"]/g;
    
    let match;
    const sources = [];
    while ((match = sourceRegex.exec(sourcesSection[1])) !== null) {
      sources.push({
        label: match[1],
        domain: match[2],
        province: match[3],
        strategy: match[4],
        url: match[5]
      });
    }
    
    console.log(`📋 Found ${sources.length} sources to test\n`);
    
    // Test first 10 sources to avoid long runtime
    const testSources = sources.slice(0, 10);
    const results = {
      success: [],
      timeout: [],
      error: [],
      noTenderContent: []
    };
    
    for (let i = 0; i < testSources.length; i++) {
      const source = testSources[i];
      console.log(`[${i + 1}/${testSources.length}] 📡 ${source.label} (${source.strategy}): ${source.url}`);
      
      try {
        const startTime = Date.now();
        const response = await new Promise((resolve, reject) => {
          const https = require('https');
          const http = require('http');
          const client = source.url.startsWith('https') ? https : http;
          
          const req = client.get(source.url, { timeout: 8000 }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
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
          // Check for tender content
          const tenderKeywords = ['tender', 'bid', 'rfq', 'rfp', 'procurement', 'quotation', 'bid document', 'tender notice'];
          const hasTenderContent = tenderKeywords.some(keyword => 
            response.data.toLowerCase().includes(keyword)
          );
          
          // Look for reference numbers
          const refPattern = /\b([A-Z]{2,10}[\s\/\-]\d{2,6}[\s\/\-]\d{4}(?:[\/\-]\d{2,4})?|(?:BID|RFQ|RFP|EOI|SCM|QUO|TEN)[\s\/\-]?(?:NO\.?\s*)?[A-Z0-9\/\-]{4,20})\b/gi;
          const refs = response.data.match(refPattern) || [];
          
          if (hasTenderContent) {
            results.success.push({
              ...source,
              status: response.status,
              size: response.data.length,
              time: responseTime,
              refCount: refs.length,
              contentType: response.headers['content-type']
            });
            console.log(`   ✅ ${responseTime}ms | ${response.data.length} bytes | ${refs.length} refs | ${refs.slice(0, 2).join(', ')}`);
          } else {
            results.noTenderContent.push({
              ...source,
              status: response.status,
              size: response.data.length,
              time: responseTime,
              contentType: response.headers['content-type']
            });
            console.log(`   ⚠️  ${responseTime}ms | ${response.data.length} bytes | NO TENDER CONTENT`);
          }
        } else {
          results.error.push({
            ...source,
            status: response.status,
            time: responseTime,
            error: `HTTP ${response.status}`
          });
          console.log(`   ❌ HTTP ${response.status}`);
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
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Summary
    console.log(`\n📊 SUMMARY (first ${testSources.length} sources):`);
    console.log(`✅ Success: ${results.success.length}`);
    console.log(`⏱️  Timeouts: ${results.timeout.length}`);
    console.log(`❌ Errors: ${results.error.length}`);
    console.log(`⚠️  No tender content: ${results.noTenderContent.length}`);
    
    if (results.success.length > 0) {
      console.log('\n🎯 SUCCESSFUL SOURCES:');
      results.success.forEach(s => {
        console.log(`   ${s.label}: ${s.time}ms | ${s.size} bytes | ${s.refCount} refs | ${s.strategy}`);
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
        console.log(`   ${s.label}: ${s.time}ms | ${s.size} bytes | ${s.strategy} | ${s.contentType}`);
      });
    }
    
    // Additional sites to consider
    console.log('\n🌐 ADDITIONAL GOVERNMENT TENDER SITES TO CONSIDER:');
    const additionalSites = [
      'https://www.etenders.gov.za (Main portal - but Angular SPA, avoid direct scraping)',
      'https://www.sars.gov.za/tenders (Revenue Service)',
      'https://www.resbank.co.za/tenders (Reserve Bank)',
      'https://www.gauteng.gov.za/tenders (Gauteng Province)',
      'https://www.westerncape.gov.za/tenders (Western Cape)',
      'https://www.kznhealth.gov.za/tenders (KZN Health)',
      'https://www.dbsa.org/tenders (Development Bank)',
      'https://www.sanral.co.za/tenders (SANRAL)',
      'https://www.transnet.net/tenders (Transnet)',
      'https://www.eskom.co.za/tenders (Eskom)',
      'https://www.prasa.com/tenders (PRASA)',
      'https://www.landbank.co.za/tenders (Land Bank)',
      'https://www.idc.co.za/tenders (IDC)',
      'https://www.csir.co.za/procurement (CSIR)',
      'https://www.sita.co.za/tenders (SITA)',
      'https://www.joburg.org.za/tenders (Johannesburg)',
      'https://www.capetown.gov.za/tenders (Cape Town)',
      'https://www.durban.gov.za/tenders (eThekwini)',
      'https://www.tshwane.gov.za/tenders (Tshwane)',
      'https://www.ekurhuleni.gov.za/tenders (Ekurhuleni)',
      'https://www.nelsonmandelabay.gov.za/tenders (Nelson Mandela Bay)',
      'https://www.buffalocity.gov.za/tenders (Buffalo City)',
      'https://www.mangaung.co.za/tenders (Mangaung)',
      'https://www.freestate.gov.za/tenders (Free State)',
      'https://www.northerncape.gov.za/tenders (Northern Cape)',
      'https://www.limpopo.gov.za/tenders (Limpopo)',
      'https://www.mpumalanga.gov.za/tenders (Mpumalanga)',
      'https://www.nwpg.gov.za/tenders (North West)',
      'https://www.ecprov.gov.za/tenders (Eastern Cape)'
    ];
    
    additionalSites.forEach(site => {
      console.log(`   ${site}`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testScraper();
