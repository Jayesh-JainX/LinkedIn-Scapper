# LinkedIn Research Tool

A comprehensive AI-powered LinkedIn research and analysis platform that provides real-time insights into companies, hiring trends, leadership changes, and competitive intelligence.

## Features

### 🔍 Real LinkedIn Data Scraping

- **Authentic Data Collection**: Uses Selenium and Playwright for real LinkedIn scraping
- **Anti-Detection Measures**: Implements browser automation with anti-detection techniques
- **Rate Limiting**: Built-in rate limiting to avoid LinkedIn restrictions
- **Data Persistence**: SQLite/PostgreSQL database for storing scraped data

### 📊 Comprehensive Analysis

- **Company Intelligence**: Recent posts, job postings, organizational changes
- **Employee Analytics**: Leadership changes, hiring patterns, skills analysis
- **Competitive Intelligence**: Multi-company comparison and market trends
- **AI-Powered Insights**: OpenAI integration for intelligent data interpretation

### 🎯 Key Capabilities

- **Real-time Data**: Live scraping from LinkedIn (no fake/mock data)
- **Database Storage**: Persistent storage with SQLAlchemy ORM
- **API-First Design**: RESTful API with FastAPI backend
- **Modern UI**: React/Next.js frontend with Tailwind CSS
- **Export Functionality**: PDF, CSV, and JSON export options

## Tech Stack

### Backend

- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **Selenium/Playwright**: Web scraping automation
- **SQLite/PostgreSQL**: Database storage
- **OpenAI**: AI-powered insights generation

### Frontend

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component library
- **Recharts**: Data visualization

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- Chrome browser (for Selenium)
- LinkedIn account credentials

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LinkedIn-Scapper
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### Environment Configuration

```bash
# Copy the environment template
cp env_template.txt .env

# Edit .env with your credentials
nano .env
```

Required environment variables:

```env
# LinkedIn Credentials (Required for real scraping)
LINKEDIN_EMAIL=your_linkedin_email@example.com
LINKEDIN_PASSWORD=your_linkedin_password

# Database Configuration
DATABASE_URL=sqlite:///./linkedin_research.db

# OpenAI Configuration (for AI insights)
OPENAI_API_KEY=your_openai_api_key
```

#### Run the Backend

```bash
# Development
python run.py

# Or with uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Environment Configuration

```bash
# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
```

#### Run the Frontend

```bash
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Usage

### 1. Company Analysis

1. Navigate to the dashboard
2. Enter a company name (e.g., "Microsoft", "Google")
3. Click "Start Analysis"
4. View comprehensive company insights

### 2. Data Collection

The system automatically collects:

- **Company Profile**: Industry, size, headquarters, description
- **Recent Posts**: Content, engagement, post types
- **Job Postings**: Titles, locations, departments, requirements
- **Employee Data**: Names, titles, departments, skills

### 3. Insights Generation

AI-powered analysis provides:

- **Hiring Trends**: Department-wise hiring patterns
- **Leadership Changes**: Recent appointments and departures
- **Market Activity**: Company expansion and milestones
- **Competitive Analysis**: Multi-company comparisons

## Database Schema

### Core Tables

- **companies**: Company profiles and basic information
- **company_posts**: Recent LinkedIn posts and engagement
- **job_postings**: Current job openings and requirements
- **employees**: Employee profiles and organizational data
- **scraping_sessions**: Session tracking and status
- **scraped_data**: Raw and processed data storage

## API Endpoints

### Company Analysis

- `POST /api/companies/analyze` - Analyze company data
- `GET /api/companies/{name}/basic-info` - Get company info
- `GET /api/companies/{name}/posts` - Get recent posts
- `GET /api/companies/{name}/jobs` - Get job postings

### Insights

- `GET /api/insights/{company}` - Generate insights
- `POST /api/companies/compare` - Compare competitors

### Export

- `GET /api/companies/{name}/export` - Export data (JSON/CSV/PDF)

## Development

### Project Structure

```
LinkedIn-Scapper/
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Data access layer
│   │   └── utils/         # Utilities
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── lib/             # Utilities and API client
│   └── package.json
└── README.md
```

### Adding New Features

1. **Backend**: Add endpoints in `app/api/endpoints/`
2. **Database**: Create models in `app/models/database_models.py`
3. **Frontend**: Add components in `frontend/components/`
4. **API Client**: Update `frontend/lib/api.ts`

## Security Considerations

### LinkedIn Compliance

- **Rate Limiting**: Built-in delays between requests
- **User Agents**: Rotating user agents to avoid detection
- **Session Management**: Proper session handling
- **Error Handling**: Graceful fallbacks for blocked requests

### Data Privacy

- **Secure Storage**: Encrypted database storage
- **Access Control**: API authentication (to be implemented)
- **Data Retention**: Configurable data retention policies

## Troubleshooting

### Common Issues

#### LinkedIn Login Failed

- Verify credentials in `.env` file
- Check if LinkedIn requires 2FA
- Ensure account is not temporarily restricted

#### Scraping Blocked

- Increase `REQUEST_DELAY` in environment
- Use proxy configuration
- Check LinkedIn's current anti-bot measures

#### Database Errors

- Ensure database file permissions
- Check SQLite installation
- Verify database URL configuration

### Debug Mode

```bash
# Backend debug
export DEBUG=True
python run.py

# Frontend debug
npm run dev -- --debug
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational and research purposes. Please ensure compliance with LinkedIn's Terms of Service and applicable laws when using this tool.

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Open an issue on GitHub

---

**Note**: This tool is designed for legitimate business research purposes. Users are responsible for complying with LinkedIn's Terms of Service and applicable data protection laws.
