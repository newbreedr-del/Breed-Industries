/**
 * Extract PDF Dates Script
 * 
 * This script reads your PDF files and extracts creation dates
 * to use the actual dates from your quote files
 */

const fs = require('fs');
const path = require('path');

const quotesFolder = 'C:\\Users\\newbr\\Documents\\Clients\\The Breed Industries\\Quotes Invocoices';

// Function to get file stats (creation date)
function getFileDate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.birthtime || stats.mtime || stats.ctime;
  } catch (error) {
    console.error(`Error reading file stats for ${filePath}:`, error);
    return new Date(); // Fallback to current date
  }
}

// Function to extract info from filename
function parseFilename(filename) {
  const patterns = {
    'Lino_Quote_Q-2026-9926.pdf': {
      quote_number: 'Q-2026-9926',
      customer_name: 'Lino',
      project_name: 'Website Development' // Default
    },
    'Mzokuthula Chiliza Business Registration_Quote_Q-2026-5447.pdf': {
      quote_number: 'Q-2026-5447',
      customer_name: 'Mzokuthula Chiliza',
      project_name: 'Business Registration'
    },
    'Nolwazi Herbal_Quote_Q-2026-3433.pdf': {
      quote_number: 'Q-2026-3433',
      customer_name: 'Nolwazi Herbal',
      project_name: 'Herbal Business' // Default
    },
    'ZamaShengu_Quote_Q-2026-3225.pdf': {
      quote_number: 'Q-2026-3225',
      customer_name: 'Zama Shengu',
      project_name: 'Development Project' // Default
    }
  };

  return patterns[filename] || null;
}

// Main function to extract dates
function extractPdfDates() {
  console.log('🔍 Extracting dates from PDF files...\n');

  try {
    const files = fs.readdirSync(quotesFolder);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));

    console.log(`Found ${pdfFiles.length} PDF files:\n`);

    const quoteData = [];

    pdfFiles.forEach(file => {
      const filePath = path.join(quotesFolder, file);
      const fileDate = getFileDate(filePath);
      const fileInfo = parseFilename(file);

      if (fileInfo) {
        const quote = {
          ...fileInfo,
          file_path: filePath,
          file_date: fileDate,
          file_date_iso: fileDate.toISOString(),
          formatted_date: fileDate.toLocaleDateString('en-ZA'),
          customer_email: `${fileInfo.customer_name.toLowerCase().replace(' ', '.')}@example.com`
        };

        quoteData.push(quote);

        console.log(`📄 ${file}`);
        console.log(`   Quote #: ${quote.quote_number}`);
        console.log(`   Customer: ${quote.customer_name}`);
        console.log(`   Project: ${quote.project_name}`);
        console.log(`   File Date: ${quote.formatted_date}`);
        console.log(`   ISO Date: ${quote.file_date_iso}`);
        console.log('');
      }
    });

    // Generate SQL with actual dates
    console.log('📋 Generated SQL with actual dates:\n');
    console.log('-- Copy this SQL and run in Supabase\n');

    quoteData.forEach((quote, index) => {
      const items = [
        {
          id: 'item_1',
          name: quote.project_name,
          description: quote.project_name + ' services',
          quantity: 1,
          rate: 10000 + (index * 5000), // Varying prices
          amount: 10000 + (index * 5000),
          pricingType: 'one-time'
        }
      ];

      const total = items[0].amount;

      console.log(`-- Quote ${index + 1}: ${quote.quote_number} - ${quote.customer_name}`);
      console.log(`INSERT INTO quotes (`);
      console.log(`  id, quote_number, customer_name, customer_email, project_name, contact_person,`);
      console.log(`  items, total, status, created_at, updated_at`);
      console.log(`) VALUES (`);
      console.log(`  'quote_${quote.quote_number.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}',`);
      console.log(`  '${quote.quote_number}',`);
      console.log(`  '${quote.customer_name}',`);
      console.log(`  '${quote.customer_email}',`);
      console.log(`  '${quote.project_name}',`);
      console.log(`  '${quote.customer_name}',`);
      console.log(`  '${JSON.stringify(items).replace(/'/g, "''")}',`);
      console.log(`  ${total},`);
      console.log(`  'sent',`);
      console.log(`  '${quote.file_date_iso}',`);
      console.log(`  '${quote.file_date_iso}'`);
      console.log(`);`);
      console.log('');
    });

    console.log('✨ Date extraction complete!');
    console.log('\n📊 Summary:');
    quoteData.forEach(quote => {
      console.log(`  • ${quote.quote_number}: ${quote.customer_name} (${quote.formatted_date})`);
    });

  } catch (error) {
    console.error('Error reading quotes folder:', error);
    console.log('Make sure the path is correct:');
    console.log(quotesFolder);
  }
}

// Run the extraction
extractPdfDates();
