import dotenv from 'dotenv'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Load environment variables
dotenv.config({ path: join(rootDir, '.env') })

console.log('🚀 TutorTracker Setup Script\n')
console.log('This script will help you set up your TutorTracker application.\n')

// Step 1: Check if .env exists
const envPath = join(rootDir, '.env')
const envExamplePath = join(rootDir, '.env.example')

if (!existsSync(envPath)) {
  console.log('📝 Creating .env file from .env.example...')
  if (existsSync(envExamplePath)) {
    const envExample = readFileSync(envExamplePath, 'utf-8')
    writeFileSync(envPath, envExample)
    console.log('✅ .env file created!\n')
    console.log('⚠️  Please edit .env file and add your credentials:\n')
    console.log('   1. VITE_AIRTABLE_API_KEY - Your Airtable Personal Access Token')
    console.log('      (Create at: Account Settings → Developer Hub → Create new token)')
    console.log('   2. VITE_AIRTABLE_BASE_ID - Your Airtable Base ID')
    console.log('   3. VITE_ADMIN_USERNAME - Admin username (default: admin)')
    console.log('   4. VITE_ADMIN_PASSWORD - Admin password (default: admin123)\n')
    console.log('   Note: Use Personal Access Tokens (not API keys) - API keys are deprecated.\n')
    console.log('   Then run this script again to validate your setup.\n')
    process.exit(0)
  } else {
    console.error('❌ .env.example file not found!')
    process.exit(1)
  }
}

// Step 2: Validate environment variables
console.log('🔍 Checking environment variables...\n')

const requiredVars = {
  'VITE_AIRTABLE_API_KEY': 'Airtable Personal Access Token',
  'VITE_AIRTABLE_BASE_ID': 'Airtable Base ID',
}

const optionalVars = {
  'VITE_ADMIN_USERNAME': 'Admin Username (default: admin)',
  'VITE_ADMIN_PASSWORD': 'Admin Password (default: admin123)',
}

let allValid = true

for (const [key, description] of Object.entries(requiredVars)) {
  const value = process.env[key]
  if (!value || value.includes('your_') || value.includes('here')) {
    console.log(`❌ ${key}: ${description} - NOT SET`)
    allValid = false
  } else {
    console.log(`✅ ${key}: ${description} - Set`)
  }
}

for (const [key, description] of Object.entries(optionalVars)) {
  const value = process.env[key]
  if (!value || value.includes('your_') || value.includes('here')) {
    console.log(`⚠️  ${key}: ${description} - Using default`)
  } else {
    console.log(`✅ ${key}: ${description} - Set`)
  }
}

if (!allValid) {
  console.log('\n❌ Please set all required environment variables in .env file')
  console.log('   Then run this script again.\n')
  process.exit(1)
}

// Step 3: Test Airtable connection
console.log('\n🔌 Testing Airtable connection...\n')

try {
  const Airtable = (await import('airtable')).default

  Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.VITE_AIRTABLE_API_KEY,
  })

  const base = Airtable.base(process.env.VITE_AIRTABLE_BASE_ID)

  // Test connection by trying to list tables
  console.log('   Testing connection to Airtable...')

  // Try to access Students table
  try {
    const studentsTable = base('Students')
    await studentsTable.select({ maxRecords: 1 }).firstPage()
    console.log('   ✅ Students table found')
  } catch (error) {
    if (error.error === 'NOT_FOUND' || error.message?.includes('Could not find table')) {
      console.log('   ❌ Students table not found')
      console.log('   📋 Please create the Students table in your Airtable base')
    } else {
      throw error
    }
  }

  // Try to access Lessons table
  try {
    const lessonsTable = base('Lessons')
    await lessonsTable.select({ maxRecords: 1 }).firstPage()
    console.log('   ✅ Lessons table found')
  } catch (error) {
    if (error.error === 'NOT_FOUND' || error.message?.includes('Could not find table')) {
      console.log('   ❌ Lessons table not found')
      console.log('   📋 Please create the Lessons table in your Airtable base')
    } else {
      throw error
    }
  }

  console.log('\n✅ Airtable connection successful!')
  console.log('\n📚 Next steps:')
  console.log('   1. Make sure your Airtable base has the correct tables and fields')
  console.log('   2. Refer to README.md for the complete table structure')
  console.log('   3. Run "npm run dev" to start the application')
  console.log('\n🎉 Setup complete! You\'re ready to go!\n')

} catch (error) {
  console.error('\n❌ Error connecting to Airtable:')

  if (error.statusCode === 401) {
    console.error('   Invalid Personal Access Token. Please check your VITE_AIRTABLE_API_KEY')
    console.error('   Make sure you\'re using a Personal Access Token (not an API key)')
    console.error('   Create one at: Account Settings → Developer Hub → Create new token')
  } else if (error.statusCode === 404) {
    console.error('   Base not found. Please check your VITE_AIRTABLE_BASE_ID')
  } else {
    console.error(`   ${error.message}`)
  }

  console.log('\n📖 Please refer to README.md for setup instructions\n')
  process.exit(1)
}