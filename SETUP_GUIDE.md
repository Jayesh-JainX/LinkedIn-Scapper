# LinkedIn Research Tool - Complete Setup Guide

## 🎯 Overview

This guide will help you set up the LinkedIn Research Tool with **real LinkedIn data scraping** (no fake data). The tool uses Selenium with advanced anti-detection measures to scrape actual data from LinkedIn.

## 📋 Prerequisites

### Required Software

- **Python 3.8+** (https://python.org)
- **Node.js 18+** (https://nodejs.org)
- **Chrome Browser** (for Selenium automation)
- **Git** (for cloning the repository)

### Required Accounts

- **LinkedIn Account** with valid credentials
- **OpenAI API Key** (optional, for AI insights)

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

#### Windows

```bash
# Run the automated setup script
setup.bat
```

#### Linux/Mac

```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

Follow the step-by-step instructions below.

## 📁 Step-by-Step Setup

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd LinkedIn-Scapper
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Environment

```bash
# Copy environment template
cp env_template.txt .env

# Edit .env with your credentials
nano .env  # or use any text editor
```

**Required .env configuration:**

```env
# LinkedIn Credentials (REQUIRED for real scraping)
LINKEDIN_EMAIL=your_linkedin_email@example.com
LINKEDIN_PASSWORD=your_linkedin_password

# Database Configuration
DATABASE_URL=sqlite:///./linkedin_research.db

# Optional: OpenAI for AI insights
OPENAI_API_KEY=your_openai_api_key

# Optional: Proxy (if needed)
PROXY_URL=http://proxy.example.com:8080
```

#### Test the Scraper

```bash
# Test the real LinkedIn scraper
python test_scraper.py
```

This will:

- Test LinkedIn login
- Scrape real data from Microsoft (or change the company in the script)
- Save data to database
- Verify everything works

### 3. Frontend Setup

#### Install Node.js Dependencies

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
```

### 4. Start the Application

#### Start Backend

```bash
cd backend
# Activate virtual environment if not already active
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Start the server
python run.py
```

#### Start Frontend (in new terminal)

```bash
cd frontend
npm run dev
```

#### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Configuration Details

### LinkedIn Credentials

The tool requires real LinkedIn credentials to scrape actual data:

1. **Use a real LinkedIn account** (not a fake one)
2. **Enable 2FA** if possible (more secure)
3. **Use a dedicated account** for scraping (recommended)
4. **Ensure the account is not restricted** or flagged

### Rate Limiting

The scraper includes built-in rate limiting:

- **3-second delays** between requests
- **Random user agents** to avoid detection
- **Anti-detection measures** in browser automation

### Database Configuration

- **SQLite** (default): Good for development and small datasets
- **PostgreSQL** (production): Better for large datasets and concurrent users

## 🧪 Testing the Setup

### 1. Test Scraper Only

```bash
cd backend
python test_scraper.py
```

Expected output:

```
🧪 Testing Real LinkedIn Scraper
==================================================
✅ LinkedIn credentials found: your_email@example.com
✅ Database tables created

🔍 Testing scraping for: Microsoft
------------------------------
📝 Testing LinkedIn login...
✅ Login successful!
🔍 Searching for company: Microsoft
✅ Found company URL: https://linkedin.com/company/microsoft
📊 Scraping company data...
✅ Company data scraped successfully!
   Name: Microsoft
   Industry: Computer Software
   Size: 100,001+ employees
   Headquarters: Redmond, WA
📝 Scraping company posts...
✅ Scraped 10 posts
💼 Scraping job postings...
✅ Scraped 20 job postings
👥 Scraping employee data...
✅ Scraped 50 employees

🚀 Testing full company scraping...
✅ Full scraping successful!
   Company: Microsoft
   Posts: 10
   Jobs: 20
   Employees: 50

💾 Testing database storage...
✅ Created scraping session: 1
✅ Saved company data: Microsoft
✅ All data saved to database!
✅ Session marked as completed

🎉 All tests passed! The scraper is working correctly.
```

### 2. Test API Endpoint

```bash
# Start the backend first, then run:
python test_scraper.py
```

### 3. Test Frontend Connection

1. Start both backend and frontend
2. Go to http://localhost:3000
3. Enter a company name (e.g., "Google", "Apple")
4. Click "Start Analysis"
5. Watch the real-time progress

## 🐛 Troubleshooting

### Common Issues

#### 1. LinkedIn Login Failed

**Symptoms**: "Login failed - check credentials or 2FA"

**Solutions**:

- Verify credentials in `.env` file
- Check if LinkedIn requires 2FA
- Try logging in manually to LinkedIn first
- Use a different LinkedIn account

#### 2. Chrome Driver Issues

**Symptoms**: "Failed to setup Chrome driver"

**Solutions**:

- Update Chrome browser to latest version
- Clear Chrome cache and cookies
- Check if Chrome is installed in default location
- Try running as administrator (Windows)

#### 3. Company Not Found

**Symptoms**: "Company not found"

**Solutions**:

- Try different company names (e.g., "Microsoft" instead of "MS")
- Check if company has a LinkedIn page
- Try searching manually on LinkedIn first

#### 4. Scraping Blocked

**Symptoms**: No data returned or errors

**Solutions**:

- Increase `REQUEST_DELAY` in environment (try 5-10 seconds)
- Use a proxy (configure `PROXY_URL` in .env)
- Wait a few hours before trying again
- Check if LinkedIn has updated their anti-bot measures

#### 5. Database Errors

**Symptoms**: "Database error" or "table not found"

**Solutions**:

- Delete the database file: `rm linkedin_research.db`
- Restart the application
- Check file permissions
- Ensure SQLite is working

#### 6. Frontend Connection Issues

**Symptoms**: "Cannot connect to backend" or API errors

**Solutions**:

- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Ensure CORS is properly configured
- Check browser console for errors

### Debug Mode

#### Backend Debug

```bash
cd backend
export DEBUG=True  # Linux/Mac
set DEBUG=True     # Windows
python run.py
```

#### Frontend Debug

```bash
cd frontend
npm run dev -- --debug
```

## 🔒 Security Considerations

### LinkedIn Compliance

- **Rate Limiting**: Built-in delays prevent overwhelming LinkedIn
- **User Agent Rotation**: Multiple browser signatures
- **Session Management**: Proper login/logout handling
- **Error Handling**: Graceful fallbacks for blocked requests

### Data Privacy

- **Secure Storage**: Database encryption support
- **Access Control**: API authentication ready
- **Data Retention**: Configurable policies
- **Audit Logging**: Session tracking and monitoring

### Best Practices

1. **Use dedicated LinkedIn account** for scraping
2. **Respect rate limits** and don't overload LinkedIn
3. **Monitor for account restrictions**
4. **Keep credentials secure** and don't share .env files
5. **Comply with LinkedIn's Terms of Service**

## 📊 Performance Optimization

### For Better Performance

1. **Use SSD storage** for database
2. **Increase memory** for Chrome browser
3. **Use proxy rotation** for large-scale scraping
4. **Implement caching** for frequently accessed data
5. **Use background jobs** for long-running operations

### For Production Deployment

1. **Use PostgreSQL** instead of SQLite
2. **Implement Redis** for caching
3. **Use Docker** for containerization
4. **Set up monitoring** and alerting
5. **Implement proper logging**

## 🎯 Usage Examples

### Basic Company Analysis

1. Go to http://localhost:3000
2. Enter company name: "Google"
3. Click "Start Analysis"
4. View results in dashboard

### Advanced Features

- **Competitor Comparison**: Add multiple companies
- **Data Export**: Download as PDF, CSV, or JSON
- **Historical Data**: View past scraping sessions
- **AI Insights**: Get intelligent analysis (requires OpenAI key)

## 📞 Support

### Getting Help

1. **Check the troubleshooting section** above
2. **Review the logs** for error messages
3. **Test with the test script**: `python test_scraper.py`
4. **Check API documentation**: http://localhost:8000/docs

### Common Questions

**Q: Is this legal?**
A: The tool is designed for legitimate business research. Users must comply with LinkedIn's Terms of Service and applicable laws.

**Q: Will my LinkedIn account get banned?**
A: The tool includes anti-detection measures, but use responsibly and monitor your account.

**Q: Can I scrape unlimited data?**
A: No, respect rate limits and LinkedIn's terms. The tool includes built-in delays.

**Q: What if LinkedIn changes their website?**
A: The scraper uses multiple selectors and fallback mechanisms, but may need updates if LinkedIn makes major changes.

---

**🎉 Congratulations!** You now have a fully functional LinkedIn research tool with real data scraping capabilities. The tool is production-ready and includes comprehensive error handling, security measures, and documentation.
