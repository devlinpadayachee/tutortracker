// Debug utility to check Airtable configuration
export function checkAirtableConfig() {
  const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;

  console.log('🔍 Airtable Configuration Check:');
  console.log('API Key present:', !!apiKey);
  console.log('API Key length:', apiKey?.length || 0);
  console.log('Base ID present:', !!baseId);
  console.log('Base ID:', baseId);

  if (!apiKey || apiKey.includes('your_') || apiKey.includes('here')) {
    console.error('❌ API Key not configured properly');
    return false;
  }

  if (!baseId || baseId.includes('your_') || baseId.includes('here')) {
    console.error('❌ Base ID not configured properly');
    return false;
  }

  console.log('✅ Configuration looks good');
  return true;
}

// Test Airtable connection
export async function testAirtableConnection() {
  try {
    const Airtable = (await import('airtable')).default;

    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
    });

    const base = Airtable.base(import.meta.env.VITE_AIRTABLE_BASE_ID);

    // Try to list tables (this will fail if base doesn't exist or token is invalid)
    console.log('Testing connection to base...');

    // Try to access Students table
    const studentsTable = base('Students');
    const records = await studentsTable.select({ maxRecords: 1 }).firstPage();
    console.log('✅ Successfully connected to Students table');
    console.log('Sample record count:', records.length);

    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);

    if (error.statusCode === 401) {
      console.error('Authentication failed. Check your Personal Access Token.');
    } else if (error.statusCode === 404) {
      console.error('Base or table not found. Check your Base ID and table name.');
    } else if (error.error === 'NOT_FOUND') {
      console.error('Table "Students" not found. Make sure:');
      console.error('1. Table name is exactly "Students" (case-sensitive)');
      console.error('2. Your Personal Access Token has access to this base');
    }

    return false;
  }
}