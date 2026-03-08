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

### 📝 Job Details
- **Comprehensive Info**: Company, title, location, salary, dates, and job description
- **Inline Notes Editing**: Click-to-edit notes functionality
- **Quick Status Update**: Change status directly from detail page
- **Timeline View**: Track creation, updates, and follow-up dates
- **AI Tips Panel**: Placeholder for future AI-powered resume tips

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
│   ├── routers/
│   │   └── applications.py  # API endpoints
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
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ScrollToTop.jsx
│   │   ├── hooks/
│   │   │   └── useApplications.js # React Query hooks
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Analytics dashboard
│   │   │   ├── Applications.jsx   # Application list
│   │   │   ├── AddJob.jsx         # Add application form
│   │   │   ├── EditJob.jsx        # Edit application form
│   │   │   ├── JobDetail.jsx      # Application details
│   │   │   ├── NotFound.jsx       # 404 page
│   │   │   └── Reminders.jsx      # Placeholder
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
   pip install fastapi sqlalchemy pydantic uvicorn
   ```

3. **Seed the database** (optional - creates 10 sample applications):
   ```bash
   python seed.py
   ```

4. **Start the server**:
   ```bash
   uvicorn main:app --reload
   ```
   Server runs at: `http://localhost:8000`

5. **Test API** (optional):
   - Docs: `http://localhost:8000/docs`
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
1. Click **Add Job** in sidebar or bottom nav
2. Fill in company name, job title (required fields)
3. Optionally add: location, salary, job URL, description, resume version, notes
4. Submit to create

### Viewing Applications
1. Navigate to **Applications** page
2. Use search bar to filter by company/title
3. Use status dropdown to filter by application status
4. Click card to view full details

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API health check |
| `GET` | `/applications/` | List all applications (with filters) |
| `GET` | `/applications/stats` | Get statistics (counts by status) |
| `GET` | `/applications/{id}` | Get single application |
| `POST` | `/applications/` | Create new application |
| `PUT` | `/applications/{id}` | Update application |
| `DELETE` | `/applications/{id}` | Delete application |

### Query Parameters
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

## 📝 Future Enhancements
- [ ] AI-powered resume tips integration
- [ ] Email reminders for follow-ups
- [ ] Export applications to CSV/PDF
- [ ] Advanced analytics and insights
- [ ] Calendar integration
- [ ] Dark mode support
- [ ] Multi-user authentication
- [ ] Real-time collaboration

## 🤝 Contributing
Contributions welcome! Fork the repository and submit a pull request.

## 📄 License
MIT License

## 👤 Author
**Manujana Nagaraj**
- GitHub: [@ManujanaNagaraj](https://github.com/ManujanaNagaraj)

---

**Version**: 1.0.0  
**Last Updated**: 2026
