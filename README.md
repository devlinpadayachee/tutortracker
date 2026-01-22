# TutorTracker 🎓

A beautiful, modern web application for managing your tutoring business. Track students, lessons, and payments all in one place.

## Features

- 🔐 **Authentication** - Secure login with configurable admin credentials
- ✨ **Student Management** - Register and manage all your students
- 📚 **Lesson Tracking** - Record every lesson with date, duration, subject, and notes
- 💰 **Payment Tracking** - Track which lessons have been paid for and payment amounts
- 📊 **Dashboard** - Get an overview of your business with statistics
- 🎨 **Beautiful UI** - Modern, responsive design built with Tailwind CSS

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Database**: Airtable (free tier - 1,200 records per base!)
- **API**: Airtable JavaScript SDK (called directly from frontend)
- **No Backend Required!** 🎉 Everything runs in the browser

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

#### Step 1: Install Dependencies

```bash
npm install
```

#### Step 2: Run Setup Script (Recommended)

The setup script will help you configure everything automatically:

```bash
npm run setup
```

This script will:
- ✅ Create `.env` file from `.env.example` if it doesn't exist
- ✅ Validate all required environment variables
- ✅ Test your Airtable connection
- ✅ Verify that your tables exist
- ✅ Provide helpful error messages if something is missing

**First time running?** The script will create your `.env` file. Edit it with your credentials and run `npm run setup` again to validate.

#### Step 3: Set Up Airtable Database

1. **Create an Airtable Account**
   - Go to [https://airtable.com](https://airtable.com)
   - Sign up for a free account (free tier includes 1,200 records per base!)

2. **Create a New Base**
   - Click "Add a base" → "Start from scratch"
   - Name it "TutorTracker" or whatever you prefer

3. **Create the Students Table**
   - Your base will start with one table - rename it to "Students"
   - Add the following fields (click the "+" button to add fields):

      | Field Name | Field Type | Options |
      |------------|------------|---------|
      | Name | Single line text | Required |
      | Email | Email | Optional |
      | Phone | Phone number | Optional |
      | Grade | Single line text | Optional |
      | GuardianName | Single line text | Optional |
      | GuardianPhone | Phone number | Optional |
      | CreatedAt | Date | Include time: Yes, Auto-generated |

4. **Create the Lessons Table**
   - Click the "+" button next to "Students" tab to add a new table
   - Name it "Lessons"
   - Add the following fields:

      | Field Name | Field Type | Options |
      |------------|------------|---------|
      | Reference | Single line text | **Required** - Primary identifier (Auto-generated: LESSON-0001, LESSON-0002, etc.) |
      | Student | Link to another record | Link to "Students" table, Allow linking to multiple records: No |
      | StudentName | Single line text | (This will be auto-populated) |
      | Date | Date | Include time: Yes |
      | Duration | Number | Format: Integer |
      | Subject | Single line text | Optional |
      | Notes | Long text | Optional |
      | IsPaid | Checkbox | Default: Unchecked |
      | AmountPaid | Number | Format: Decimal (2 decimal places) |
      | AmountDue | Number | Format: Decimal (2 decimal places) |
      | CreatedAt | Date | Include time: Yes, Auto-generated |

5. **Get Your API Credentials**
   - Go to [https://airtable.com/api](https://airtable.com/api)
   - Select your base (TutorTracker)
   - You'll see your **Base ID** at the top (looks like `appXXXXXXXXXXXXXX`)
   - **Create a Personal Access Token:**
     - Go to your [Account Settings](https://airtable.com/account) → Developer Hub
     - Click "Create new token"
     - Give it a name (e.g., "TutorTracker")
     - Set scopes: `data.records:read` and `data.records:write`
     - Select your base(s) or "All bases"
     - Copy the token (you'll only see it once!)
   - **Note:** API Keys are deprecated as of January 2024. Use Personal Access Tokens instead.

#### Step 4: Configure Environment Variables

If you didn't use the setup script, manually configure your `.env` file:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your credentials:
   ```
   VITE_AIRTABLE_API_KEY=your_personal_access_token_here
   VITE_AIRTABLE_BASE_ID=your_base_id_here
   VITE_ADMIN_USERNAME=admin
   VITE_ADMIN_PASSWORD=admin123
   ```

   **Important Notes:**
   - `VITE_AIRTABLE_API_KEY` should contain your **Personal Access Token** (not an API key)
   - The `VITE_` prefix is required for Vite to expose these variables to your frontend code!
   - Change the admin username and password in production!
   - Make sure there are no extra spaces in your `.env` file
   - Personal Access Tokens are more secure than API keys and are required as of January 2024

#### Step 5: Start the App

```bash
npm run dev
```

The app will run on `http://localhost:3000` - that's it! No backend server needed! 🎉

### Usage

1. Open your browser and navigate to `http://localhost:3000`
2. You'll be redirected to the login page - use your admin credentials
3. Once logged in, start by adding your first student
4. Add lessons for each student
5. Mark lessons as paid when payment is received
6. View your dashboard for business insights

## Project Structure

```
tutortracker/
├── src/
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── contexts/            # React contexts (Auth)
│   ├── config/              # Airtable configuration
│   ├── services/            # Airtable API service
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── .env.example             # Environment variables template
└── package.json             # Dependencies and scripts
```

## Database

The app uses **Airtable** - a free, cloud-based database that's perfect for this use case!

**Benefits:**
- ✅ Free tier includes 1,200 records per base
- ✅ Access your data from anywhere (web, mobile apps)
- ✅ View and edit data directly in Airtable's beautiful interface
- ✅ Automatic backups in the cloud
- ✅ No database server setup required

**View Your Data:**
- Simply go to [airtable.com](https://airtable.com) and open your base
- You can view, edit, and manage all your students and lessons there!

## Deployment (Free Hosting Options)

### Option 1: Vercel (Recommended - Easiest) ⭐

**Vercel** is the easiest and best option for React/Vite apps. It's completely free and optimized for React.

#### Steps:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/tutortracker.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up (free)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - **Add Environment Variables:**
     - `VITE_AIRTABLE_API_KEY` = your Personal Access Token
     - `VITE_AIRTABLE_BASE_ID` = your Base ID
     - `VITE_ADMIN_USERNAME` = your admin username
     - `VITE_ADMIN_PASSWORD` = your admin password
   - Click "Deploy"
   - Done! Your app will be live in ~30 seconds 🎉

**Benefits:**
- ✅ Completely free
- ✅ Automatic HTTPS
- ✅ Custom domain support (free)
- ✅ Automatic deployments on git push
- ✅ Global CDN
- ✅ No credit card required

### Option 2: Netlify

**Netlify** is another excellent free option with similar features.

#### Steps:

1. **Push your code to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign up (free)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - **Add Environment Variables** (Site settings → Environment variables):
     - `VITE_AIRTABLE_API_KEY`
     - `VITE_AIRTABLE_BASE_ID`
     - `VITE_ADMIN_USERNAME`
     - `VITE_ADMIN_PASSWORD`
   - Click "Deploy site"

**Benefits:**
- ✅ Completely free
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ Continuous deployment

### Option 3: Cloudflare Pages

**Cloudflare Pages** offers free hosting with excellent performance.

#### Steps:

1. **Push your code to GitHub**

2. **Deploy to Cloudflare Pages**
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Sign up/login (free)
   - Click "Create a project"
   - Connect your GitHub repository
   - Build settings:
     - Framework preset: Vite
     - Build command: `npm run build`
     - Build output directory: `dist`
   - **Add Environment Variables** in the build settings
   - Click "Save and Deploy"

**Benefits:**
- ✅ Completely free
- ✅ Fast global CDN
- ✅ Automatic HTTPS
- ✅ Custom domain support

### Option 4: GitHub Pages (More Setup Required)

GitHub Pages is free but requires more configuration for React Router.

#### Steps:

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Update `vite.config.js` to add `base: '/your-repo-name/'`
4. Run `npm run deploy`

**Note:** Requires more setup for React Router to work properly.

### ⚠️ Important: Environment Variables

**All hosting platforms require you to set environment variables in their dashboard!**

Make sure to add:
- `VITE_AIRTABLE_API_KEY`
- `VITE_AIRTABLE_BASE_ID`
- `VITE_ADMIN_USERNAME`
- `VITE_ADMIN_PASSWORD`

**Never commit your `.env` file to Git!** It's already in `.gitignore`.

## Troubleshooting

### Airtable Issues

**Error: "Base not found"**
- Double-check your Base ID is correct
- Make sure you're using the right base

**Error: "Invalid API key" or "Unauthorized"**
- Verify your Personal Access Token is correct (not an old API key)
- Make sure the token has the correct scopes: `data.records:read` and `data.records:write`
- Ensure the token has access to your base
- Make sure there are no extra spaces in your `.env` file
- **Note:** API Keys are deprecated. Use Personal Access Tokens from Account Settings → Developer Hub

**Error: "Field not found"**
- Make sure all field names match exactly (case-sensitive!)
- Check that you've created both tables with all required fields

**Error: "NOT_FOUND" or 404 when creating/updating records**
- **Most common issue:** Table name doesn't match exactly
  - Check your Airtable table name is exactly "Students" (with capital S, plural)
  - Check your Lessons table name is exactly "Lessons" (with capital L, plural)
  - Table names are case-sensitive!
- Verify your Personal Access Token has:
  - Scope: `data.records:write` (required for creating/updating)
  - Scope: `data.records:read` (required for reading)
  - Access to your specific base (or "All bases")
- Verify your Base ID is correct
- Check browser console (F12) for detailed error messages

### Authentication Issues

**Can't log in**
- Verify your `.env` file has `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD` set
- Make sure you've restarted the dev server after changing `.env` file
- Default credentials are `admin` / `admin123` if not set in `.env`

### General Issues

**App won't start**
- Make sure you've run `npm install`
- Check that Node.js version is v18 or higher
- Verify all environment variables are set correctly

**Data not loading**
- Check browser console for errors
- Verify Airtable Personal Access Token and Base ID are correct
- Make sure your Personal Access Token has the correct scopes and base access
- Make sure your Airtable base has the correct table and field names

## License

ISC