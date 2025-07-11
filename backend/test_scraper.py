#!/usr/bin/env python3
"""
Test script for the real LinkedIn scraper
This script tests the scraper functionality without requiring the full web interface
"""

import asyncio
import sys
import os
from dotenv import load_dotenv

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.real_linkedin_scraper import RealLinkedInScraper
from app.database import create_tables
from app.repositories.data_repository import DataRepository

load_dotenv()

async def test_scraper():
    """Test the real LinkedIn scraper"""
    print("🧪 Testing Real LinkedIn Scraper")
    print("=" * 50)
    
    # Check environment variables
    email = os.getenv('LINKEDIN_EMAIL')
    password = os.getenv('LINKEDIN_PASSWORD')
    
    if not email or not password:
        print("❌ LinkedIn credentials not found in .env file")
        print("Please add your LinkedIn credentials to backend/.env:")
        print("LINKEDIN_EMAIL=your_email@example.com")
        print("LINKEDIN_PASSWORD=your_password")
        return False
    
    print(f"✅ LinkedIn credentials found: {email}")
    
    # Initialize database
    try:
        create_tables()
        print("✅ Database tables created")
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False
    
    # Test company name
    test_company = "Microsoft"  # You can change this to any company
    
    print(f"\n🔍 Testing scraping for: {test_company}")
    print("-" * 30)
    
    scraper = RealLinkedInScraper()
    
    try:
        # Test login
        print("📝 Testing LinkedIn login...")
        login_success = await scraper.login()
        
        if not login_success:
            print("❌ Login failed. Please check your credentials.")
            return False
        
        print("✅ Login successful!")
        
        # Test company search
        print(f"🔍 Searching for company: {test_company}")
        company_url = await scraper._search_company(test_company)
        
        if not company_url:
            print(f"❌ Company {test_company} not found")
            return False
        
        print(f"✅ Found company URL: {company_url}")
        
        # Test company page scraping
        print("📊 Scraping company data...")
        company_data = await scraper._scrape_company_page(company_url)
        
        if not company_data:
            print("❌ Failed to scrape company data")
            return False
        
        print("✅ Company data scraped successfully!")
        print(f"   Name: {company_data.get('name', 'Unknown')}")
        print(f"   Industry: {company_data.get('industry', 'Unknown')}")
        print(f"   Size: {company_data.get('size', 'Unknown')}")
        print(f"   Headquarters: {company_data.get('headquarters', 'Unknown')}")
        
        # Test posts scraping
        print("📝 Scraping company posts...")
        posts_data = await scraper._scrape_company_posts(company_url)
        print(f"✅ Scraped {len(posts_data)} posts")
        
        # Test jobs scraping
        print("💼 Scraping job postings...")
        jobs_data = await scraper._scrape_job_postings(company_url)
        print(f"✅ Scraped {len(jobs_data)} job postings")
        
        # Test employees scraping
        print("👥 Scraping employee data...")
        employees_data = await scraper._scrape_employees(company_url)
        print(f"✅ Scraped {len(employees_data)} employees")
        
        # Test full scraping
        print("\n🚀 Testing full company scraping...")
        full_data = await scraper.scrape_company_data(test_company)
        
        if full_data:
            print("✅ Full scraping successful!")
            print(f"   Company: {full_data['company'].get('name', 'Unknown')}")
            print(f"   Posts: {len(full_data['recent_posts'])}")
            print(f"   Jobs: {len(full_data['job_postings'])}")
            print(f"   Employees: {len(full_data['employees'])}")
            
            # Test database storage
            print("\n💾 Testing database storage...")
            repository = DataRepository()
            
            # Create scraping session
            session = repository.create_scraping_session(test_company)
            print(f"✅ Created scraping session: {session.id}")
            
            # Save company data
            company = repository.save_company_data(session.id, full_data['company'])
            print(f"✅ Saved company data: {company.name}")
            
            # Save other data
            repository.save_posts_data(session.id, company.id, full_data['recent_posts'])
            repository.save_jobs_data(session.id, company.id, full_data['job_postings'])
            repository.save_employees_data(session.id, company.id, full_data['employees'])
            
            print("✅ All data saved to database!")
            
            # Update session status
            repository.update_session_status(session.id, "completed")
            print("✅ Session marked as completed")
            
        else:
            print("❌ Full scraping failed")
            return False
        
        print("\n🎉 All tests passed! The scraper is working correctly.")
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    finally:
        # Always close the scraper
        scraper.close()

async def test_api_endpoint():
    """Test the API endpoint"""
    print("\n🌐 Testing API Endpoint")
    print("=" * 30)
    
    try:
        import httpx
        
        # Test the analyze endpoint
        url = "http://localhost:8000/api/companies/analyze"
        data = {
            "company_name": "Google",
            "include_employees": True,
            "include_posts": True,
            "include_jobs": True,
            "max_employees": 50,
            "days_back": 30
        }
        
        print(f"📡 Testing API endpoint: {url}")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, timeout=60.0)
            
            if response.status_code == 200:
                result = response.json()
                print("✅ API endpoint working!")
                print(f"   Company: {result.get('name', 'Unknown')}")
                print(f"   Posts: {len(result.get('recentPosts', []))}")
                print(f"   Jobs: {len(result.get('jobPostings', []))}")
                print(f"   Employees: {len(result.get('employees', []))}")
                return True
            else:
                print(f"❌ API endpoint failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

async def main():
    """Main test function"""
    print("🚀 LinkedIn Scraper Test Suite")
    print("=" * 50)
    
    # Test scraper
    scraper_success = await test_scraper()
    
    if scraper_success:
        # Test API endpoint (only if scraper works)
        api_success = await test_api_endpoint()
        
        if api_success:
            print("\n🎉 All tests passed! Your LinkedIn scraper is ready to use.")
            print("\n📋 Next steps:")
            print("1. Start the backend: python run.py")
            print("2. Start the frontend: npm run dev (in frontend directory)")
            print("3. Access the application: http://localhost:3000")
        else:
            print("\n⚠️  Scraper works but API endpoint needs attention.")
    else:
        print("\n❌ Scraper tests failed. Please check your configuration.")

if __name__ == "__main__":
    asyncio.run(main()) 