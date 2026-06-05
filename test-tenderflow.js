// Test tenderflow.co.za and similar aggregation sites
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
        
        // Check if it's an aggregation site (multiple sources mentioned)
        const sources = ['department', 'municipality', 'province', 'government', 'entity'];
        const isAggregator = sources.some(source => 
          response.data.toLowerCase().includes(source)
        );
        console.log(`   🌐 Aggregator: ${isAggregator ? 'YES' : 'NO'}`);
      }
      
      return { success: true, hasTenderContent, refCount: refs.length };
    } else {
      console.log(`   ❌ HTTP ${response.status}`);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testAggregationSites() {
  console.log('🧪 Testing tender aggregation sites...\n');
  
  // Test tenderflow.co.za and similar sites
  const aggregationSites = [
    {
      label: 'TenderFlow',
      url: 'https://www.tenderflow.co.za',
      description: 'South African tender aggregation platform'
    },
    {
      label: 'Tender Bulletin',
      url: 'https://www.tenderbulletin.co.za',
      description: 'Tender notice aggregation service'
    },
    {
      label: 'Tender SA',
      url: 'https://www.tendersa.co.za',
      description: 'South African tender portal'
    },
    {
      label: 'Online Tenders',
      url: 'https://www.onlinetenders.co.za',
      description: 'Online tender notices'
    },
    {
      label: 'Tender News',
      url: 'https://www.tendernews.co.za',
      description: 'Tender news and notices'
    },
    {
      label: 'Tender Watch',
      url: 'https://www.tenderwatch.co.za',
      description: 'Tender monitoring service'
    },
    {
      label: 'SA Tenders',
      url: 'https://www.satenders.co.za',
      description: 'South African tender listings'
    },
    {
      label: 'Tender Portal SA',
      url: 'https://www.tenderportal.co.za',
      description: 'Tender portal for South Africa'
    },
    {
      label: 'Tender Connect',
      url: 'https://www.tenderconnect.co.za',
      description: 'Tender connection platform'
    },
    {
      label: 'Tender Central',
      url: 'https://www.tendercentral.co.za',
      description: 'Central tender platform'
    }
  ];
  
  const results = [];
  
  for (const site of aggregationSites) {
    console.log(`\n📡 ${site.label} (${site.description}):`);
    const result = await testUrl(site.url, site.label);
    results.push({ ...site, ...result });
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n📊 AGGREGATION SITES SUMMARY:');
  const successful = results.filter(r => r.success);
  const withTenderContent = successful.filter(r => r.hasTenderContent);
  const aggregators = withTenderContent.filter(r => r.isAggregator);
  
  console.log(`✅ Total sites tested: ${results.length}`);
  console.log(`✅ Accessible: ${successful.length}`);
  console.log(`📋 With tender content: ${withTenderContent.length}`);
  console.log(`🌐 Aggregators: ${aggregators.length}`);
  
  if (withTenderContent.length > 0) {
    console.log('\n🎯 SUCCESSFUL AGGREGATION SITES:');
    withTenderContent.forEach(site => {
      console.log(`   ${site.label}: ${site.url} | ${site.refCount} refs`);
    });
  }
  
  return results;
}

testAggregationSites();
