# 🔍 LinkedIn Research Tool

A **production-ready, AI-powered LinkedIn research and analysis platform** built with modern web technologies. This comprehensive tool provides deep insights into companies, employees, hiring trends, and competitive intelligence through an intuitive, mobile-first dashboard.

## ✨ Features

### 🏢 **Company Intelligence**

- **Deep Company Analysis**: Comprehensive profiles with industry, size, headquarters, and key metrics
- **Real-time Data Processing**: Live data collection and analysis with progress tracking
- **Employee Insights**: Track workforce composition, recent hires, and organizational structure
- **Job Market Analysis**: Monitor hiring trends, open positions, and skill demands

### 📊 **Advanced Analytics**

- **Hiring Trends**: Department-wise hiring patterns and growth rates
- **Leadership Changes**: Track promotions, new hires, and organizational shifts
- **Branch Expansions**: Detect new office openings and geographic expansion
- **Competitive Intelligence**: Multi-company comparison and market positioning

### 🎨 **User Experience**

- **Mobile-First Design**: Fully responsive interface optimized for all devices
- **Real-time Dashboard**: Interactive charts, metrics, and data visualizations
- **Progressive Loading**: Smart loading states and error handling
- **Data Export**: Export insights in PDF, CSV, and JSON formats

### 🔧 **Technical Excellence**

- **Production Ready**: Comprehensive error handling and logging
- **API-First Architecture**: RESTful APIs with proper validation and documentation
- **Environment Configuration**: Flexible setup for development and production
- **Mock Data Support**: Development-friendly with realistic mock data when LinkedIn credentials aren't available

## 🛠 Tech Stack

### Frontend

- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** for responsive styling
- **Shadcn/ui** component library
- **Recharts** for data visualization
- **Custom API Client** with error handling and timeouts

### Backend

- **Python FastAPI** with async/await
- **Pydantic** for data validation and serialization
- **SQLite** database (configurable)
- **LinkedIn Scraping** with Selenium (optional)
- **Comprehensive Logging** and error handling

## 📁 Project Structure

```
LinkedIn-Scapper/
├── frontend/                          # Next.js React Application
│   ├── app/                          # App Router pages
│   │   ├── dashboard/                # Main dashboard page
│   │   ├── layout.tsx               # Root layout with metadata
│   │   └── page.tsx                 # Landing page
│   ├── components/                   # React Components
│   │   ├── dashboard/               # Dashboard-specific components
│   │   │   ├── CompanyAnalysis.tsx  # Company data visualization
│   │   │   ├── DataCollection.tsx   # Data input and analysis
│   │   │   ├── InsightsDashboard.tsx # Analytics and insights
│   │   │   └── CompetitorComparison.tsx # Competitor analysis
│   │   └── ui/                      # Reusable UI components
│   ├── lib/                         # Utilities and API client
│   │   └── api.ts                   # Comprehensive API client
│   ├── hooks/                       # Custom React hooks
│   └── package.json                 # Frontend dependencies
├── backend/                          # Python FastAPI Application
│   ├── app/                         # Main application
│   │   ├── api/                     # API routes and endpoints
│   │   │   ├── endpoints/           # Individual endpoint files
│   │   │   └── routes.py           # Route configuration
│   │   ├── models/                  # Pydantic data models
│   │   │   ├── company.py          # Company-related models
│   │   │   ├── employee.py         # Employee data models
│   │   │   └── insights.py         # Analytics models
│   │   ├── services/                # Business logic services
│   │   │   ├── linkedin_scraper.py  # Data collection service
│   │   │   ├── data_processor.py    # Data processing and analysis
│   │   │   └── insight_generator.py # AI-powered insights
│   │   └── main.py                  # FastAPI application entry
│   ├── requirements.txt             # Python dependencies
│   └── run.py                       # Development server runner
├── .env                             # Backend environment variables
├── .env.local                       # Frontend environment variables
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- **Git** for cloning the repository

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LinkedIn-Scapper
```

### 2. Backend Setup

1. **Navigate to backend directory:**

```bash
cd backend
```

2. **Create and activate virtual environment (recommended):**

```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
```

4. **Create environment file:**
   Create `backend/.env` with the following content:

```env
# LinkedIn Credentials (optional - uses mock data if not provided)
LINKEDIN_EMAIL=
LINKEDIN_PASSWORD=

# Database Configuration
DATABASE_URL=sqlite:///./linkedin_scraper.db

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# CORS Configuration
ALLOWED_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]

# Security
SECRET_KEY=your-secret-key-here-change-in-production

# Logging
LOG_LEVEL=INFO

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# LinkedIn Scraping Configuration
SCRAPING_DELAY_MIN=1
SCRAPING_DELAY_MAX=3
MAX_RETRIES=3
```

5. **Start the backend server:**

```bash
python run.py
```

Backend will be available at `http://localhost:8000`

### 3. Frontend Setup

1. **Open new terminal and navigate to frontend:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment file:**
   Create `frontend/.env.local` with:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Development Configuration
NODE_ENV=development

# Application Configuration
NEXT_PUBLIC_APP_NAME=LinkedIn Research Tool
NEXT_PUBLIC_APP_VERSION=1.0.0
```

4. **Start the development server:**

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 📖 Usage Guide

### 1. **Data Collection**

- Navigate to the Dashboard → Data Collection tab
- Enter a company name (e.g., "Google", "Microsoft", "Apple")
- Click "Start Analysis" to begin data collection
- Monitor real-time progress as data is processed

### 2. **Company Analysis**

- View comprehensive company overview and key metrics
- Explore employee data, job postings, and recent posts
- Analyze hiring trends and departmental growth
- Access detailed organizational insights

### 3. **Insights Dashboard**

- Review AI-generated insights and trends
- Track hiring patterns and leadership changes
- Identify branch expansions and growth opportunities
- Monitor social media engagement metrics

### 4. **Competitor Comparison**

- Add multiple companies for side-by-side comparison
- Compare hiring activity, market presence, and growth
- Analyze competitive positioning and opportunities
- Export comparison data for further analysis

### 5. **Data Export**

- Export insights in PDF, CSV, or JSON formats
- Save analysis results for offline review
- Share reports with team members and stakeholders

## 🔌 API Documentation

### Main Endpoints

| Endpoint                           | Method | Description                                |
| ---------------------------------- | ------ | ------------------------------------------ |
| `/api/companies/analyze`           | POST   | Analyze company data and generate insights |
| `/api/companies/{name}/basic-info` | GET    | Get basic company information              |
| `/api/companies/{name}/posts`      | GET    | Retrieve recent company posts              |
| `/api/companies/{name}/jobs`       | GET    | Get current job postings                   |
| `/api/companies/compare`           | POST   | Compare multiple companies                 |
| `/api/companies/{name}/export`     | GET    | Export company data                        |
| `/api/insights/{name}`             | GET    | Get AI-generated insights                  |
| `/health`                          | GET    | Health check endpoint                      |

### Example API Call

```javascript
// Analyze a company
const response = await fetch("http://localhost:8000/api/companies/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    company_name: "Google",
    include_employees: true,
    include_posts: true,
    include_jobs: true,
  }),
});

const data = await response.json();
```

## 🔍 Key Features Implemented

### ✅ **Production Readiness**

- Comprehensive error handling throughout the application
- Real-time loading states and progress indicators
- Mobile-first responsive design for all devices
- Environment variable configuration for different deployments

### ✅ **Data Integration**

- **Real API Integration**: All components use live data from backend APIs
- **No Static Data**: Removed all mock/hardcoded data from frontend
- **Dynamic Processing**: Real-time data processing with progress tracking
- **Fallback Support**: Graceful degradation with mock data when needed

### ✅ **User Experience**

- **Mobile Responsive**: Optimized for phones, tablets, and desktops
- **Intuitive Navigation**: Clean, modern interface with clear workflows
- **Error Feedback**: User-friendly error messages and recovery options
- **Performance**: Fast loading with efficient data handling

### ✅ **Technical Excellence**

- **Type Safety**: Full TypeScript implementation with proper interfaces
- **API Client**: Robust HTTP client with timeout, retry, and error handling
- **Modular Architecture**: Clean separation of concerns and reusable components
- **Logging**: Comprehensive logging for debugging and monitoring

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**

- Ensure Python 3.8+ is installed
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Verify the `.env` file exists in the backend directory

**Frontend won't start:**

- Ensure Node.js 18+ is installed
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

**API connection issues:**

- Verify backend is running on `http://localhost:8000`
- Check the `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Ensure CORS settings allow frontend domain

**No data showing:**

- The application uses mock data by default for development
- To use real LinkedIn data, add credentials to `backend/.env`
- Check browser console for API errors

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Update all environment files with production values
2. **Security**: Change `SECRET_KEY` and remove debug settings
3. **Database**: Configure production database (PostgreSQL recommended)
4. **CORS**: Update `ALLOWED_ORIGINS` with production domains
5. **Monitoring**: Implement logging and monitoring solutions

### Docker Deployment (Optional)

```dockerfile
# Example Dockerfile for backend
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

- Real-time LinkedIn integration with official APIs
- Advanced AI-powered insights and predictions
- Email notifications and automated reports
- Team collaboration features
- Enhanced data visualization and analytics

---

**Built with ❤️ for modern business intelligence and competitive research.**
