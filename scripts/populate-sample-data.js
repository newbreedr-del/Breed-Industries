/**
 * Populate Sample Data Script
 * 
 * This script adds sample quotes and invoices to Supabase
 * so you can see the admin interface working
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://zdpbkrrohdwohelsrvic.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcGJrcnJvaGR3b2hlbHNydmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NzY4OTgsImV4cCI6MjA1ODU1Mjg5OH0.uY8t5kj14Bk_Tdc-Kre4_Q__FC5wtJXrKWEhcvNcGiI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample quotes based on your PDF names
const sampleQuotes = [
  {
    id: 'quote_lino_9926',
    quote_number: 'Q-2026-9926',
    customer_name: 'Lino',
    customer_email: 'lino@example.com',
    project_name: 'Website Development',
    contact_person: 'Lino',
    items: [
      {
        id: 'item_1',
        name: 'Website Design & Development',
        description: 'Full responsive website with CMS',
        quantity: 1,
        rate: 15000,
        amount: 15000,
        pricingType: 'one-time'
      },
      {
        id: 'item_2',
        name: 'Hosting Setup',
        description: 'First year hosting included',
        quantity: 1,
        rate: 2000,
        amount: 2000,
        pricingType: 'one-time'
      }
    ],
    total: 17000,
    status: 'sent',
    created_at: new Date('2026-03-20').toISOString(),
    updated_at: new Date('2026-03-20').toISOString()
  },
  {
    id: 'quote_mzokuthula_5447',
    quote_number: 'Q-2026-5447',
    customer_name: 'Mzokuthula Chiliza',
    customer_email: 'mzokuthula.chiliza@example.com',
    project_name: 'Business Registration',
    contact_person: 'Mzokuthula Chiliza',
    items: [
      {
        id: 'item_1',
        name: 'Company Registration',
        description: 'Private company registration with CIPC',
        quantity: 1,
        rate: 3500,
        amount: 3500,
        pricingType: 'one-time'
      },
      {
        id: 'item_2',
        name: 'Tax Registration',
        description: 'SARS tax registration and compliance',
        quantity: 1,
        rate: 1500,
        amount: 1500,
        pricingType: 'one-time'
      }
    ],
    total: 5000,
    status: 'sent',
    created_at: new Date('2026-03-15').toISOString(),
    updated_at: new Date('2026-03-15').toISOString()
  },
  {
    id: 'quote_nolwazi_3433',
    quote_number: 'Q-2026-3433',
    customer_name: 'Nolwazi Herbal',
    customer_email: 'nolwazi@herbal.co.za',
    project_name: 'E-commerce Website',
    contact_person: 'Nolwazi',
    items: [
      {
        id: 'item_1',
        name: 'E-commerce Platform',
        description: 'Online store with payment integration',
        quantity: 1,
        rate: 25000,
        amount: 25000,
        pricingType: 'one-time'
      },
      {
        id: 'item_2',
        name: 'Product Photography',
        description: 'Professional product photoshoot',
        quantity: 50,
        rate: 100,
        amount: 5000,
        pricingType: 'one-time'
      }
    ],
    total: 30000,
    status: 'pending',
    created_at: new Date('2026-03-10').toISOString(),
    updated_at: new Date('2026-03-10').toISOString()
  },
  {
    id: 'quote_zama_3225',
    quote_number: 'Q-2026-3225',
    customer_name: 'Zama Shengu',
    customer_email: 'zama.shengu@example.com',
    project_name: 'Mobile App Development',
    contact_person: 'Zama Shengu',
    items: [
      {
        id: 'item_1',
        name: 'iOS App Development',
        description: 'Native iOS application',
        quantity: 1,
        rate: 20000,
        amount: 20000,
        pricingType: 'one-time'
      },
      {
        id: 'item_2',
        name: 'Android App Development',
        description: 'Native Android application',
        quantity: 1,
        rate: 20000,
        amount: 20000,
        pricingType: 'one-time'
      }
    ],
    total: 40000,
    status: 'sent',
    created_at: new Date('2026-03-05').toISOString(),
    updated_at: new Date('2026-03-05').toISOString()
  }
];

// Sample invoices
const sampleInvoices = [
  {
    id: 'inv_sample_001',
    invoice_number: 'INV-202603-0001',
    quote_number: 'Q-2026-9926',
    customer_name: 'Lino',
    customer_email: 'lino@example.com',
    customer_phone: '+27 12 345 6789',
    customer_address: '123 Main St, Johannesburg',
    items: [
      {
        id: 'item_1',
        name: 'Website Design & Development',
        description: 'Full responsive website with CMS',
        quantity: 1,
        rate: 15000,
        amount: 15000,
        pricingType: 'one-time'
      }
    ],
    one_time_total: 15000,
    monthly_total: 0,
    deposit: 7500,
    balance: 7500,
    total_amount: 15000,
    status: 'sent',
    payment_status: 'unpaid',
    due_date: new Date('2026-04-20').toISOString(),
    issue_date: new Date('2026-03-20').toISOString(),
    paid_date: null,
    paid_amount: 0,
    payment_date: null,
    stitch_payment_id: null,
    stitch_payment_url: null,
    notes: 'Payment terms: 50% deposit required before work commences',
    created_at: new Date('2026-03-20').toISOString(),
    updated_at: new Date('2026-03-20').toISOString()
  }
];

async function populateData() {
  console.log('🚀 Populating sample data...\n');

  // Insert quotes
  console.log('📋 Inserting quotes...');
  for (const quote of sampleQuotes) {
    console.log(`  • ${quote.quote_number} - ${quote.customer_name}`);
    
    const { data, error } = await supabase
      .from('quotes')
      .insert(quote)
      .select();

    if (error) {
      console.error(`    ❌ Error: ${error.message}`);
    } else {
      console.log(`    ✅ Success`);
    }
  }

  // Insert invoices
  console.log('\n🧾 Inserting invoices...');
  for (const invoice of sampleInvoices) {
    console.log(`  • ${invoice.invoice_number} - ${invoice.customer_name}`);
    
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoice)
      .select();

    if (error) {
      console.error(`    ❌ Error: ${error.message}`);
    } else {
      console.log(`    ✅ Success`);
    }
  }

  console.log('\n✨ Sample data population complete!');
  console.log('\n📊 You can now see:');
  console.log('  • 4 quotes in /admin/quotes');
  console.log('  • 1 invoice in /admin/invoices');
  console.log('  • Real data with search and filtering');
  console.log('\n🔧 Update with your actual quote details via:');
  console.log('  • /admin/quotes/import (web interface)');
  console.log('  • scripts/import-quotes.js (script)');
}

// Run the population
populateData().catch(console.error);
