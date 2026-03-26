/**
 * Test Supabase Connection with Anon Key
 * This script tests if the anon key can access your Supabase database
 */

const { createClient } = require('@supabase/supabase-js');

// Your Supabase configuration
const supabaseUrl = 'https://zdpbkrrohdwohelsrvic.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcGJrcnJvaGR3b2hlbHNydmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDc4NzUsImV4cCI6MjA5MDA4Mzg3NX0.Hm_eQqBuBZoFO7AI6DUv7Xbov3Di0ilhqt7vTtadOe0';

console.log('🔍 Testing Supabase connection with anon key...\n');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('📋 Test 1: Basic connection test');
    console.log(`   URL: ${supabaseUrl}`);
    console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...`);
    
    // Test basic connection by checking quotes table
    const { data, error, count } = await supabase
      .from('quotes')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Connection failed:');
      console.error(`   Error: ${error.message}`);
      console.error(`   Code: ${error.code}`);
      console.error(`   Details: ${error.details}`);
      
      if (error.code === 'PGRST116') {
        console.log('\n💡 Suggestion: The "quotes" table might not exist. Run the SQL from POPULATE_REAL_DATES.sql');
      } else if (error.code === 'PGRST301') {
        console.log('\n💡 Suggestion: RLS (Row Level Security) might be blocking access. Check policies.');
      }
      return false;
    }

    console.log('✅ Connection successful!');
    console.log(`   Quotes in database: ${count || 0}`);

    // Test 2: Get actual quotes data
    console.log('\n📋 Test 2: Fetching quotes data...');
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('quote_number, customer_name, project_name, total, status, created_at')
      .order('created_at', { ascending: false });

    if (quotesError) {
      console.error('❌ Failed to fetch quotes:');
      console.error(`   Error: ${quotesError.message}`);
      return false;
    }

    if (quotes && quotes.length > 0) {
      console.log(`✅ Found ${quotes.length} quotes:`);
      quotes.forEach((quote, index) => {
        console.log(`   ${index + 1}. ${quote.quote_number} - ${quote.customer_name} (${quote.project_name}) - R${quote.total}`);
      });
    } else {
      console.log('ℹ️  No quotes found in database');
    }

    // Test 3: Check invoices table
    console.log('\n📋 Test 3: Checking invoices table...');
    const { data: invoices, error: invoicesError, count: invoiceCount } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true });

    if (invoicesError) {
      console.log('ℹ️  Invoices table not accessible (might not exist)');
    } else {
      console.log(`✅ Invoices table accessible: ${invoiceCount || 0} invoices`);
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Quotes: ${quotes?.length || 0} records`);
    console.log(`   • Invoices: ${invoiceCount || 0} records`);
    console.log(`   • Connection: Working`);
    
    return true;

  } catch (error) {
    console.error('❌ Unexpected error:');
    console.error(`   ${error.message}`);
    return false;
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n✅ Supabase connection is working correctly!');
    console.log('🚀 Your quotes should appear on the website once redeployed.');
  } else {
    console.log('\n❌ Supabase connection has issues.');
    console.log('🔧 Check the error messages above for solutions.');
  }
}).catch(console.error);
