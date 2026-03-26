/**
 * Quote Import Script
 * 
 * This script helps you manually import quotes into Supabase.
 * Since the quotes are in PDF format, you'll need to manually enter the data.
 * 
 * Usage:
 * 1. Update the quotes array below with your quote data
 * 2. Run: node scripts/import-quotes.js
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://zdpbkrrohdwohelsrvic.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcGJrcnJvaGR3b2hlbHNydmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NzY4OTgsImV4cCI6MjA1ODU1Mjg5OH0.uY8t5kj14Bk_Tdc-Kre4_Q__FC5wtJXrKWEhcvNcGiI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Your quotes data - UPDATE THIS WITH YOUR ACTUAL QUOTE DATA
const quotes = [
  {
    id: 'quote_1',
    quote_number: 'Q-2026-9926',
    customer_name: 'Lino',
    customer_email: 'lino@example.com', // UPDATE WITH ACTUAL EMAIL
    project_name: 'Lino Project',
    contact_person: 'Lino',
    items: [
      {
        id: 'item_1',
        name: 'Service/Product',
        description: 'Description',
        quantity: 1,
        rate: 0, // UPDATE WITH ACTUAL AMOUNT
        amount: 0,
        pricingType: 'one-time'
      }
    ],
    total: 0, // UPDATE WITH ACTUAL TOTAL
    status: 'sent',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'quote_2',
    quote_number: 'Q-2026-5447',
    customer_name: 'Mzokuthula Chiliza',
    customer_email: 'mzokuthula@example.com', // UPDATE WITH ACTUAL EMAIL
    project_name: 'Business Registration',
    contact_person: 'Mzokuthula Chiliza',
    items: [
      {
        id: 'item_1',
        name: 'Business Registration',
        description: 'Company registration services',
        quantity: 1,
        rate: 0, // UPDATE WITH ACTUAL AMOUNT
        amount: 0,
        pricingType: 'one-time'
      }
    ],
    total: 0, // UPDATE WITH ACTUAL TOTAL
    status: 'sent',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'quote_3',
    quote_number: 'Q-2026-3433',
    customer_name: 'Nolwazi Herbal',
    customer_email: 'nolwazi@example.com', // UPDATE WITH ACTUAL EMAIL
    project_name: 'Nolwazi Herbal Project',
    contact_person: 'Nolwazi',
    items: [
      {
        id: 'item_1',
        name: 'Service/Product',
        description: 'Description',
        quantity: 1,
        rate: 0, // UPDATE WITH ACTUAL AMOUNT
        amount: 0,
        pricingType: 'one-time'
      }
    ],
    total: 0, // UPDATE WITH ACTUAL TOTAL
    status: 'sent',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'quote_4',
    quote_number: 'Q-2026-3225',
    customer_name: 'Zama Shengu',
    customer_email: 'zama@example.com', // UPDATE WITH ACTUAL EMAIL
    project_name: 'Zama Shengu Project',
    contact_person: 'Zama Shengu',
    items: [
      {
        id: 'item_1',
        name: 'Service/Product',
        description: 'Description',
        quantity: 1,
        rate: 0, // UPDATE WITH ACTUAL AMOUNT
        amount: 0,
        pricingType: 'one-time'
      }
    ],
    total: 0, // UPDATE WITH ACTUAL TOTAL
    status: 'sent',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function importQuotes() {
  console.log('Starting quote import...\n');

  for (const quote of quotes) {
    console.log(`Importing quote: ${quote.quote_number} - ${quote.customer_name}`);
    
    const { data, error } = await supabase
      .from('quotes')
      .insert(quote)
      .select();

    if (error) {
      console.error(`❌ Error importing ${quote.quote_number}:`, error.message);
    } else {
      console.log(`✅ Successfully imported ${quote.quote_number}`);
    }
  }

  console.log('\n✨ Import complete!');
}

// Run the import
importQuotes().catch(console.error);
