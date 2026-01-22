import Airtable from 'airtable';

// Initialize Airtable
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
});

const base = Airtable.base(import.meta.env.VITE_AIRTABLE_BASE_ID);

export const studentsTable = base('Students');
export const lessonsTable = base('Lessons');

export default base;