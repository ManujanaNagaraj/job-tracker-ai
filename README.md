# 🚀 Job Tracker AI

A modern, full-stack Job Application Tracker built with React, FastAPI, and SQLite. Track your job applications, manage statuses, and get insights through an intuitive dashboard.

## ✨ Features

### 📊 Dashboard
- **KPI Cards**: Total applications, interviews scheduled, offers received, and rejections
- **Status Distribution**: Visual pie chart showing application breakdown
- **Timeline Chart**: Bar chart of applications by status
- **Recent Activity**: Quick view of latest 5 applications

### 💼 Applications Management
- **Card Grid View**: Clean, responsive card layout with search and filters
- **Status Filtering**: Filter by Applied, Screening, Interview, Offer, Rejected, Ghosted
- **Search**: Real-time search across company names and job titles
- **CRUD Operations**: Create, read, update, and delete applications seamlessly
- **URL Auto-Fill**: Paste job posting URL to automatically extract company, title, description, and more

### 📝 Job Details
- **Comprehensive Info**: Company, title, location, salary, dates, and job description
- **Inline Notes Editing**: Click-to-edit notes functionality
- **Quick Status Update**: Change status directly from detail page
- **Timeline View**: Track creation, updates, and follow-up dates
- **AI Tips Panel**: AI-powered resume tips, keywords, interview questions, and cover letter suggestions

### 🤖 AI Features
- **Smart URL Parser**: Automatically extract job details from posting URLs using BeautifulSoup
- **AI Resume Tips**: Get 5 personalized resume improvement suggestions
- **Keywords Extraction**: Identify 8-10 important keywords from job descriptions
- **Interview Prep**: Generate 5 likely interview questions for the role
- **Cover Letter Opener**: AI-generated opening paragraph for your cover letter
- **Skills Highlighting**: Get 5 key skills to emphasize in your application

### 🔔 Reminders & Follow-ups
- **Pending Follow-ups**: See applications older than 7 days that need attention
- **Upcoming Schedule**: View follow-up dates in the next 7 days
- **Email Reminders**: Send yourself follow-up reminder emails with templates
- **Snooze Feature**: Postpone reminders for 7 days
- **Mark Updated**: Remove from pending list after following up

### 🎨 UI/UX
- **Responsive Design**: Desktop sidebar + mobile bottom navigation
- **Smooth Transitions**: Page fade-in animations and scroll-to-top on route change
- **Toast Notifications**: Success/error feedback for all actions
- **Form Validation**: React Hook Form + Zod schema validation
- **Loading States**: Skeleton screens for better perceived performance
- **Empty States**: Helpful messages when no data exists
- **404 Page**: Custom not-found page for invalid routes

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite 7** - Build tool and dev server
- **React Router v7** - Client-side routing
- **TanStack Query v5** - Server state management
- **Zustand v5** - Client state management (filters, search)
- **React Hook Form v7** - Form handling
- **Zod v4** - Schema validation
- **Tailwind CSS v3** - Utility-first styling
- **Recharts v3** - Charts and data visualization
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **Pydantic v2** - Data validation and serialization
- **Uvicorn** - ASGI server
- **SQLite** - Lightweight database
- **OpenAI API** - GPT-4o-mini for AI features
- **httpx** - Async HTTP client for URL parsing
- **BeautifulSoup4** - HTML parsing for job posting extraction
- **python-dotenv** - Environment variable management

## 📁 Project Structure

```
job-tracker/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # CRUD operations
│   ├── seed.py              # Database seeding
│   ├── .env.example         # Environment variables template
│   ├── routers/
│   │   ├── applications.py  # CRUD API endpoints
│   │   ├── parser.py        # URL parser endpoint
│   │   ├── ai.py            # AI tips endpoints
│   │   └── reminders.py     # Reminders endpoints
│   ├── services/
│   │   ├── url_parser.py    # Job URL parsing service
│   │   ├── ai_service.py    # OpenAI integration
│   │   └── email_service.py # Email reminder service
│   └── job_tracker.db       # SQLite database
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js          # Axios instance
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Responsive navigation
│   │   │   ├── StatsCard.jsx      # KPI card component
│   │   │   ├── StatusBadge.jsx    # Status pill badge
│   │   │   ├── AITipsPanel.jsx    # AI tips component
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ScrollToTop.jsx
│   │   ├── hooks/
│   │   │   ├── useApplications.js # React Query hooks
│   │   │   ├── useUrlParser.js    # URL parser hook
│   │   │   ├── useAITips.js       # AI tips hooks
│   │   │   └── useReminders.js    # Reminders hooks
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Analytics dashboard
│   │   │   ├── Applications.jsx   # Application list
│   │   │   ├── AddJob.jsx         # Add application form (with URL auto-fill)
│   │   │   ├── EditJob.jsx        # Edit application form
│   │   │   ├── JobDetail.jsx      # Application details (with AI panel)
│   │   │   ├── NotFound.jsx       # 404 page
│   │   │   └── Reminders.jsx      # Follow-up reminders page
│   │   ├── store/
│   │   │   └── useJobStore.js     # Zustand store
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Python 3.13+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pip install fastapi sqlalchemy pydantic uvicorn httpx beautifulsoup4 openai python-dotenv
   ```

3. **Configure environment variables** (optional - for AI features and email):
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Add your OpenAI API key (get one from https://platform.openai.com/api-keys):
     ```
     OPENAI_API_KEY=sk-...your-key-here
     ```
   - For email reminders, add SMTP settings (e.g., Gmail):
     ```
     REMINDER_EMAIL=your_email@gmail.com
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=465
     SMTP_USER=your_email@gmail.com
     SMTP_PASSWORD=your_app_password
     ```
   - Note: AI and email features will gracefully degrade if not configured

4. **Seed the database** (optional - creates 10 sample applications):
   ```bash
   python seed.py
   ```

5. **Start the server**:
   ```bash
   uvicorn main:app --reload
   ```
   Server runs at: `http://localhost:8000`

6. **Test API** (optional):
   - Interactive Docs: `http://localhost:8000/docs`
   - Root: `http://localhost:8000/`

### Frontend Setup

1. **Navigate to frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Create `.env` file in `frontend/` folder:
     ```
     VITE_API_URL=http://localhost:8000
     ```

4. **Start dev server**:
   ```bash
   npm run dev
   ```
   App runs at: `http://localhost:5173`

## 🎯 Usage

### Adding a Job Application

**Method 1: Manual Entry**
1. Click **Add Job** in sidebar or bottom nav
2. Fill in company name, job title (required fields)
3. Optionally add: location, salary, job URL, description, resume version, notes
4. Submit to create

**Method 2: URL Auto-Fill** ⚡
1. Click **Add Job**
2. Paste a job posting URL in the "Quick Fill from Job URL" field
3. Click **Auto Fill** to automatically extract:
   - Company name
   - Job title
   - Job description
   - Location
   - Salary range
4. Review and edit any fields as needed
5. Submit to create

### Viewing Applications
1. Navigate to **Applications** page
2. Use search bar to filter by company/title
3. Use status dropdown to filter by application status
4. Click card to view full details

### Using AI Features

**Generate AI Tips** 🤖
1. Open any job detail page
2. Scroll to the AI Tips Panel on the right
3. Click **Generate AI Tips** button
4. Review the generated content in 4 tabs:
   - **Keywords**: Important keywords from job description
   - **Resume Tips**: 5 personalized resume improvements
   - **Interview Prep**: 5 likely interview questions
   - **Cover Letter**: AI-generated opening paragraph
5. Click **Copy** to copy cover letter text
6. Click **Regenerate** to get new suggestions

**Note**: Requires OpenAI API key in backend `.env` file

### Managing Reminders

**View Pending Follow-ups**
1. Navigate to **Reminders** page
2. See applications older than 7 days that need attention
3. For each pending reminder, you can:
   - **Send Email**: Get a follow-up template sent to your email
   - **Snooze 7d**: Postpone reminder for 7 days
   - **Mark Updated**: Remove from pending list

**Upcoming Follow-ups**
- View applications with follow-up dates in the next 7 days
- See countdown days until each follow-up
- Color-coded urgency (today = red, 1-2 days = orange, 3+ = blue)

### Editing an Application
1. Click **Edit** button on application card or detail page
2. Update fields as needed
3. Save changes

### Updating Status
- **Quick Update**: Use status dropdown on detail page
- **Full Edit**: Click Edit button and change status field

### Deleting an Application
- Click **Delete** button on application card
- Confirm deletion in browser prompt

## 📊 API Endpoints

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API health check |
| `GET` | `/applications/` | List all applications (with filters) |
| `GET` | `/applications/stats` | Get statistics (counts by status) |
| `GET` | `/applications/{id}` | Get single application |
| `POST` | `/applications/` | Create new application |
| `PUT` | `/applications/{id}` | Update application |
| `DELETE` | `/applications/{id}` | Delete application |

### URL Parser
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/parse/url` | Parse job posting URL and extract details |

### AI Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/ai/tips/{id}` | Generate AI tips (cached in database) |
| `POST` | `/ai/cover-letter/{id}` | Generate cover letter with user background |
| `DELETE` | `/ai/tips/{id}` | Clear cached tips to regenerate |

### Reminders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/reminders/` | Get pending follow-ups (>7 days old) |
| `GET` | `/reminders/upcoming` | Get upcoming follow-ups (next 7 days) |
| `POST` | `/reminders/send/{id}` | Send reminder email |
| `PUT` | `/reminders/snooze/{id}` | Snooze reminder for X days |
| `PUT` | `/reminders/mark-updated/{id}` | Mark as updated |

### Query Parameters (Applications)
- `status` - Filter by status (e.g., `?status=Interview`)
- `search` - Search company/title (e.g., `?search=Google`)
- `limit` - Limit results (e.g., `?limit=5`)

## 🎨 Database Schema

### JobApplication Model
```python
id: Integer (Primary Key)
company: String (Required)
job_title: String (Required)
job_url: String (Optional)
job_description: Text (Optional)
status: String (Default: "Applied")
applied_date: Date (Default: today)
salary_range: String (Optional)
location: String (Optional)
notes: Text (Optional)
resume_version: String (Optional)
ai_tips: Text (Optional)
reminder_sent: Boolean (Default: False)
follow_up_date: Date (Optional)
created_at: DateTime (Auto)
updated_at: DateTime (Auto)
```

## 🔄 State Management

### React Query (Server State)
- Automatic caching and background refetching
- Optimistic updates on mutations
- Query invalidation on success

### Zustand (Client State)
- Search query persistence
- Status filter selection
- Selected job tracking
- Dark mode toggle (future)

## 🎨 Responsive Breakpoints
- **Mobile**: < 768px (bottom navigation)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (sidebar navigation)

## 🌟 Key Highlights
- ✅ **Zero Configuration**: Works out of the box with SQLite
- ✅ **Optional AI**: AI features gracefully degrade without API key
- ✅ **Smart Caching**: AI tips cached in database to save API costs
- ✅ **Async Operations**: URL parsing and AI requests are non-blocking
- ✅ **Error Handling**: Comprehensive error messages and fallbacks
- ✅ **Type Safety**: Full TypeScript-like validation with Zod and Pydantic

## 📝 Future Enhancements
- [ ] Export applications to CSV/PDF
- [ ] Advanced analytics with trend graphs
- [ ] Calendar integration for interviews
- [ ] Dark mode support
- [ ] Multi-user authentication
- [ ] Real-time collaboration
- [ ] Browser extension for one-click job saving
- [ ] LinkedIn integration
- [ ] Automated job board scraping

## 🤝 Contributing
Contributions welcome! Fork the repository and submit a pull request.

## 📄 License
MIT License

## 👤 Author
**Manujana Nagaraj**
- GitHub: [@ManujanaNagaraj](https://github.com/ManujanaNagaraj)

---

**Version**: 2.0.0  
**Last Updated**: March 2026  
**Total Features**: 30+ features across 6 pages with AI and automation capabilities
