// Simple test script for tender scraper
const { scrapeAllSources } = require('./src/lib/tenderScraper.ts');

async function testScraper() {
  console.log('Testing tender scraper...');
  
  try {
    const startTime = Date.now();
    const tenders = await scrapeAllSources();
    const endTime = Date.now();
    
    console.log(`\n✅ Scraper test completed in ${endTime - startTime}ms`);
    console.log(`📊 Found ${tenders.length} tenders total`);
    
    if (tenders.length > 0) {
      console.log('\n📋 Sample tenders:');
      tenders.slice(0, 3).forEach((tender, i) => {
        console.log(`\n${i + 1}. ${tender.title}`);
        console.log(`   Ref: ${tender.reference_number}`);
        console.log(`   Source: ${tender.source}`);
        console.log(`   Department: ${tender.department}`);
        console.log(`   Closing: ${tender.closing_date}`);
        console.log(`   Description: ${tender.description?.slice(0, 100)}...`);
      });
    }
    
    // Count by source
    const sourceCounts = {};
    tenders.forEach(t => {
      sourceCounts[t.source] = (sourceCounts[t.source] || 0) + 1;
    });
    
    console.log('\n📈 Tenders by source:');
    Object.entries(sourceCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([source, count]) => {
        console.log(`   ${source}: ${count}`);
      });
    
  } catch (error) {
    console.error('❌ Scraper test failed:', error.message);
  }
}

testScraper();
