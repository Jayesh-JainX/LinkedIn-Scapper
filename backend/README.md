# ⚡ LinkedIn Research Tool - Backend API

A robust, production-ready FastAPI backend providing comprehensive LinkedIn company research and analysis capabilities with intelligent data processing and AI-powered insights.

## 🛠 Technology Stack

- **FastAPI** - Modern, fast web framework for building APIs
- **Python 3.8+** - Latest Python features and performance
- **Pydantic** - Data validation and serialization
- **SQLite/PostgreSQL** - Flexible database support
- **Selenium** - Web scraping capabilities
- **AsyncIO** - Asynchronous programming for performance
- **Python-dotenv** - Environment variable management

## 📁 Project Structure

```
backend/
├── app/                              # Main application package
│   ├── api/                         # API layer
│   │   ├── endpoints/               # API endpoint modules
│   │   │   ├── companies.py         # Company-related endpoints
│   │   │   ├── insights.py          # Insights and analytics endpoints
│   │   │   └── export.py            # Data export endpoints
│   │   └── routes.py                # Route configuration and middleware
│   ├── models/                      # Data models and schemas
│   │   ├── company.py               # Company data models
│   │   ├── employee.py              # Employee data models
│   │   ├── insights.py              # Analytics and insights models
│   │   └── base.py                  # Base model configurations
│   ├── services/                    # Business logic services
│   │   ├── linkedin_scraper.py      # LinkedIn data collection service
│   │   ├── data_processor.py        # Data processing and analysis
│   │   ├── insight_generator.py     # AI-powered insights generation
│   │   └── export_service.py        # Data export service
│   ├── utils/                       # Utility functions
│   │   ├── validators.py            # Input validation helpers
│   │   ├── formatters.py            # Data formatting utilities
│   │   └── exceptions.py            # Custom exception classes
│   └── main.py                      # FastAPI application entry point
├── .env                             # Environment variables
├── requirements.txt                 # Python dependencies
├── run.py                           # Development server runner
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ installed
- pip package manager
- Virtual environment (recommended)

### Installation

1. **Create and activate virtual environment:**

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate
```

2. **Install dependencies:**

```bash
pip install -r requirements.txt
```

3. **Create environment file:**
   Create `.env` with:

```env
# LinkedIn Credentials (optional - uses mock data if not provided)
LINKEDIN_EMAIL=your_email@example.com
LINKEDIN_PASSWORD=your_password

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

4. **Start the server:**

```bash
python run.py
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

### Interactive Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

### Main Endpoints

#### Company Analysis

```http
POST /api/companies/analyze
Content-Type: application/json

{
  "company_name": "Google",
  "competitors": ["Microsoft", "Apple"],
  "include_employees": true,
  "include_posts": true,
  "include_jobs": true,
  "max_employees": 100,
  "days_back": 30
}
```

**Response:**

```json
{
  "name": "Google",
  "industry": "Technology",
  "size": "10,001+ employees",
  "headquarters": "Mountain View, CA",
  "recentPosts": [...],
  "jobPostings": [...],
  "employees": [...],
  "status": "completed"
}
```

#### Company Information

```http
GET /api/companies/{company_name}/basic-info
```

#### Recent Posts

```http
GET /api/companies/{company_name}/posts?limit=10
```

#### Job Postings

```http
GET /api/companies/{company_name}/jobs?department=Engineering
```

#### Insights Generation

```http
GET /api/insights/{company_name}
```

**Response:**

```json
{
  "hiringTrends": [...],
  "leadershipChanges": [...],
  "branchExpansions": [...],
  "competitorComparison": [...]
}
```

#### Competitor Comparison

```http
POST /api/companies/compare
Content-Type: application/json

{
  "companies": ["Google", "Microsoft", "Apple"]
}
```

#### Data Export

```http
GET /api/companies/{company_name}/export?format=json
GET /api/companies/{company_name}/export?format=csv
GET /api/companies/{company_name}/export?format=pdf
```

### Health Check

```http
GET /health
```

## 🏗 Core Services

### LinkedIn Scraper (`linkedin_scraper.py`)

**Features:**

- Intelligent mock data generation for development
- Real LinkedIn scraping capabilities (when credentials provided)
- Rate limiting and respectful scraping practices
- Comprehensive error handling and fallback mechanisms

**Key Methods:**

```python
async def scrape_company_data(company_name: str) -> Dict[str, Any]
async def _generate_mock_company_data(company_name: str) -> Dict[str, Any]
async def search_competitors(industry: str, size: str) -> List[str]
```

### Data Processor (`data_processor.py`)

**Features:**

- Company data analysis and metric calculation
- Hiring trend analysis by department
- Leadership change detection
- Branch expansion identification
- Skill demand analysis

**Key Methods:**

```python
async def process_company_data(raw_data: Dict[str, Any]) -> CompanyAnalysis
async def analyze_hiring_trends(job_postings: List[JobPosting]) -> List[HiringTrend]
async def analyze_leadership_changes(employees: List[Dict]) -> List[LeadershipChange]
async def detect_branch_expansions(posts: List[CompanyPost]) -> List[BranchExpansion]
```

### Insight Generator (`insight_generator.py`)

**Features:**

- AI-powered business insights generation
- Competitive analysis and positioning
- Market trend identification
- Strategic recommendations

**Key Methods:**

```python
async def generate_comprehensive_insights(company_name: str) -> InsightData
async def _analyze_competitors(competitors: List[str]) -> List[CompetitorData]
async def _generate_strategic_insights(data: Dict) -> List[str]
```

## 📊 Data Models

### Company Models

```python
class Company(BaseModel):
    name: str
    industry: str
    size: str
    headquarters: str
    founded: Optional[int]
    website: Optional[str]
    description: Optional[str]
    employee_count: Optional[int]
    follower_count: Optional[int]

class CompanyPost(BaseModel):
    id: str
    content: str
    date: datetime
    engagement: int
    type: PostType
    url: Optional[str]
    author: Optional[str]

class JobPosting(BaseModel):
    id: str
    title: str
    location: str
    department: str
    date_posted: datetime
    requirements: List[str]
    description: Optional[str]
    salary_range: Optional[str]
    employment_type: Optional[str]
```

### Analytics Models

```python
class HiringTrend(BaseModel):
    department: str
    count: int
    trend: TrendDirection
    key_roles: List[str]
    growth_rate: Optional[float]

class LeadershipChange(BaseModel):
    name: str
    previous_role: Optional[str]
    new_role: str
    date: datetime
    type: ChangeType
    department: Optional[str]

class BranchExpansion(BaseModel):
    location: str
    date: datetime
    type: str
    details: str
    employee_count: Optional[int]
```

## 🔧 Configuration

### Environment Variables

| Variable                | Description                          | Default                           |
| ----------------------- | ------------------------------------ | --------------------------------- |
| `LINKEDIN_EMAIL`        | LinkedIn account email (optional)    | None                              |
| `LINKEDIN_PASSWORD`     | LinkedIn account password (optional) | None                              |
| `DATABASE_URL`          | Database connection string           | `sqlite:///./linkedin_scraper.db` |
| `API_HOST`              | API server host                      | `0.0.0.0`                         |
| `API_PORT`              | API server port                      | `8000`                            |
| `DEBUG`                 | Debug mode                           | `True`                            |
| `ALLOWED_ORIGINS`       | CORS allowed origins                 | `["http://localhost:3000"]`       |
| `SECRET_KEY`            | Application secret key               | Required for production           |
| `LOG_LEVEL`             | Logging level                        | `INFO`                            |
| `RATE_LIMIT_PER_MINUTE` | API rate limiting                    | `60`                              |

### Development vs Production

**Development:**

- Mock data enabled by default
- Debug logging active
- CORS permissive for local development
- SQLite database for simplicity

**Production:**

- Real LinkedIn credentials required
- Production database (PostgreSQL recommended)
- Strict CORS policies
- Comprehensive logging and monitoring
- Rate limiting and security measures

## 🧪 Testing

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_api.py
```

### Test Structure

```
tests/
├── test_api/
│   ├── test_companies.py      # API endpoint tests
│   ├── test_insights.py       # Insights API tests
│   └── test_health.py         # Health check tests
├── test_services/
│   ├── test_scraper.py        # Scraper service tests
│   ├── test_processor.py      # Data processor tests
│   └── test_insights.py       # Insight generator tests
└── test_models/
    ├── test_company.py        # Company model tests
    └── test_insights.py       # Analytics model tests
```

## 📝 Logging

### Log Levels

- **DEBUG**: Detailed diagnostic information
- **INFO**: General application flow
- **WARNING**: Potential issues
- **ERROR**: Error conditions
- **CRITICAL**: Serious error conditions

### Log Format

```python
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Key Log Events

- API request/response cycles
- Data processing operations
- LinkedIn scraping activities
- Error conditions and exceptions
- Performance metrics

## 🔒 Security

### Authentication & Authorization

- API key authentication (configurable)
- Rate limiting per endpoint
- Request validation and sanitization
- CORS policy enforcement

### Data Protection

- Environment variable encryption
- Secure credential storage
- Input validation and sanitization
- SQL injection prevention

### Best Practices

```python
# Input validation
@validator('company_name')
def validate_company_name(cls, v):
    if not v or not v.strip():
        raise ValueError('Company name is required')
    return v.strip()

# Error handling
try:
    result = await process_data(data)
except Exception as e:
    logger.error(f"Processing failed: {str(e)}")
    raise HTTPException(status_code=500, detail="Processing failed")
```

## 🚀 Deployment

### Production Checklist

- [ ] Update `SECRET_KEY` to strong, unique value
- [ ] Configure production database
- [ ] Set `DEBUG=False`
- [ ] Update `ALLOWED_ORIGINS` for production domains
- [ ] Configure proper logging (file-based)
- [ ] Set up monitoring and health checks
- [ ] Configure reverse proxy (nginx)
- [ ] Enable HTTPS/SSL

### Docker Deployment

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

```yaml
version: "3.8"
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/linkedin_research
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=linkedin_research
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🐛 Troubleshooting

### Common Issues

**Import errors:**

```bash
# Ensure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**Database connection errors:**

```bash
# Check DATABASE_URL in .env
# For SQLite, ensure directory exists and is writable
```

**LinkedIn scraping issues:**

- Verify credentials in `.env` file
- Check rate limiting settings
- Review LinkedIn's terms of service
- Use mock data for development

**Performance issues:**

- Enable async operations
- Implement proper caching
- Monitor database query performance
- Use connection pooling

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create feature branch
3. Set up development environment
4. Write tests for new functionality
5. Ensure all tests pass
6. Submit pull request

### Code Standards

- **PEP 8** compliance
- **Type hints** for all functions
- **Docstrings** for classes and methods
- **Error handling** for all operations
- **Async/await** for I/O operations

---

**Backend API designed for scalability, reliability, and performance.**
