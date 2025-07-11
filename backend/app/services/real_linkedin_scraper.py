import asyncio
import time
import random
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import requests
import json
import re
from urllib.parse import urljoin, urlparse, quote
import os
from dotenv import load_dotenv

from app.models.database_models import Company, CompanyPost, JobPosting, Employee, PostType, EmployeeLevel
from app.database import SessionLocal

load_dotenv()

logger = logging.getLogger(__name__)

class RealLinkedInScraper:
    """
    Real LinkedIn scraper using Selenium with advanced anti-detection measures
    """
    
    def __init__(self):
        self.email = os.getenv('LINKEDIN_EMAIL')
        self.password = os.getenv('LINKEDIN_PASSWORD')
        self.session = requests.Session()
        self.driver = None
        self.is_logged_in = False
        
        # Rate limiting
        self.request_delay = 3  # seconds between requests
        self.last_request_time = 0
        
        # Real user agents (no fake ones)
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
        ]
        
        # LinkedIn URLs
        self.base_url = "https://www.linkedin.com"
        self.login_url = f"{self.base_url}/login"
        self.search_url = f"{self.base_url}/search/results/companies/"
        
    def _setup_driver(self):
        """Setup Chrome driver with advanced anti-detection measures"""
        try:
            chrome_options = Options()
            
            # Basic options
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-blink-features=AutomationControlled')
            chrome_options.add_argument('--disable-extensions')
            chrome_options.add_argument('--disable-plugins')
            chrome_options.add_argument('--disable-images')  # Faster loading
            chrome_options.add_argument('--disable-javascript')  # We'll enable selectively
            
            # Anti-detection measures
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            chrome_options.add_argument('--disable-web-security')
            chrome_options.add_argument('--allow-running-insecure-content')
            
            # Random user agent
            user_agent = random.choice(self.user_agents)
            chrome_options.add_argument(f'--user-agent={user_agent}')
            
            # Window size
            chrome_options.add_argument('--window-size=1920,1080')
            
            # Add proxy if configured
            proxy = os.getenv('PROXY_URL')
            if proxy:
                chrome_options.add_argument(f'--proxy-server={proxy}')
            
            # Create driver
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            
            # Additional anti-detection
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            self.driver.execute_script("Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]})")
            self.driver.execute_script("Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']})")
            
            # Set window size
            self.driver.set_window_size(1920, 1080)
            
            logger.info("Chrome driver setup completed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to setup Chrome driver: {e}")
            return False
    
    async def _rate_limit(self):
        """Implement rate limiting between requests"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.request_delay:
            sleep_time = self.request_delay - time_since_last
            await asyncio.sleep(sleep_time)
        self.last_request_time = time.time()
    
    async def login(self):
        """Login to LinkedIn with proper error handling"""
        if not self.email or not self.password:
            logger.warning("LinkedIn credentials not provided. Some features may be limited.")
            return False
            
        if not self._setup_driver():
            return False
            
        try:
            logger.info("Attempting LinkedIn login...")
            
            # Navigate to login page
            self.driver.get(self.login_url)
            await asyncio.sleep(3)
            
            # Wait for page to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "username"))
            )
            
            # Clear and enter email
            email_field = self.driver.find_element(By.ID, "username")
            email_field.clear()
            email_field.send_keys(self.email)
            await asyncio.sleep(1)
            
            # Clear and enter password
            password_field = self.driver.find_element(By.ID, "password")
            password_field.clear()
            password_field.send_keys(self.password)
            await asyncio.sleep(1)
            
            # Click login button
            login_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            login_button.click()
            
            # Wait for login to complete
            await asyncio.sleep(5)
            
            # Check if login was successful
            current_url = self.driver.current_url
            if "feed" in current_url or "mynetwork" in current_url or "checkpoint" not in current_url:
                self.is_logged_in = True
                logger.info("Successfully logged into LinkedIn")
                return True
            else:
                logger.error("Login failed - check credentials or 2FA")
                return False
                
        except Exception as e:
            logger.error(f"Login error: {e}")
            return False
    
    async def scrape_company_data(self, company_name: str) -> Dict[str, Any]:
        """Scrape comprehensive company data from LinkedIn"""
        logger.info(f"Starting real scraping for company: {company_name}")
        
        try:
            # Login if not already logged in
            if not self.is_logged_in:
                login_success = await self.login()
                if not login_success:
                    raise Exception("Failed to login to LinkedIn")
            
            # Search for company
            company_url = await self._search_company(company_name)
            if not company_url:
                raise Exception(f"Company {company_name} not found")
            
            # Scrape company page
            company_data = await self._scrape_company_page(company_url)
            
            # Scrape recent posts
            posts_data = await self._scrape_company_posts(company_url)
            
            # Scrape job postings
            jobs_data = await self._scrape_job_postings(company_url)
            
            # Scrape employee data
            employees_data = await self._scrape_employees(company_url)
            
            return {
                "company": company_data,
                "recent_posts": posts_data,
                "job_postings": jobs_data,
                "employees": employees_data
            }
            
        except Exception as e:
            logger.error(f"Error scraping company data: {e}")
            raise
        finally:
            # Always close the driver
            if self.driver:
                self.driver.quit()
    
    async def _search_company(self, company_name: str) -> Optional[str]:
        """Search for company and return its LinkedIn URL"""
        try:
            await self._rate_limit()
            
            # Encode company name for URL
            encoded_name = quote(company_name)
            search_url = f"{self.search_url}?keywords={encoded_name}"
            
            logger.info(f"Searching for company: {company_name}")
            self.driver.get(search_url)
            await asyncio.sleep(4)
            
            # Wait for search results
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".search-result"))
            )
            
            # Find company results
            company_results = self.driver.find_elements(By.CSS_SELECTOR, ".search-result__info")
            
            if company_results:
                # Get the first company result
                first_result = company_results[0]
                company_link = first_result.find_element(By.CSS_SELECTOR, "a")
                company_url = company_link.get_attribute("href")
                
                logger.info(f"Found company URL: {company_url}")
                return company_url
            else:
                logger.warning(f"No company found for: {company_name}")
                return None
                
        except Exception as e:
            logger.error(f"Error searching for company: {e}")
            return None
    
    async def _scrape_company_page(self, company_url: str) -> Dict[str, Any]:
        """Scrape company profile page with comprehensive data extraction"""
        try:
            await self._rate_limit()
            
            logger.info(f"Scraping company page: {company_url}")
            self.driver.get(company_url)
            await asyncio.sleep(4)
            
            # Extract company information
            company_data = {}
            
            # Company name
            try:
                name_selectors = [
                    "h1.org-top-card-summary__title",
                    ".org-top-card-summary__title",
                    "h1",
                    ".org-top-card__title"
                ]
                for selector in name_selectors:
                    try:
                        name_element = self.driver.find_element(By.CSS_SELECTOR, selector)
                        company_data["name"] = name_element.text.strip()
                        break
                    except:
                        continue
                if "name" not in company_data:
                    company_data["name"] = "Unknown"
            except:
                company_data["name"] = "Unknown"
            
            # Industry
            try:
                industry_selectors = [
                    ".org-about-company-module__industry",
                    ".org-top-card-summary-info-list__info-item",
                    ".org-about-us-company-module__industry"
                ]
                for selector in industry_selectors:
                    try:
                        industry_element = self.driver.find_element(By.CSS_SELECTOR, selector)
                        company_data["industry"] = industry_element.text.strip()
                        break
                    except:
                        continue
                if "industry" not in company_data:
                    company_data["industry"] = "Unknown"
            except:
                company_data["industry"] = "Unknown"
            
            # Company size
            try:
                size_selectors = [
                    ".org-about-company-module__company-staff-count-range",
                    ".org-top-card-summary-info-list__info-item"
                ]
                for selector in size_selectors:
                    try:
                        size_elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                        for element in size_elements:
                            text = element.text.strip()
                            if any(word in text.lower() for word in ['employee', 'staff', 'people']):
                                company_data["size"] = text
                                break
                        if "size" in company_data:
                            break
                    except:
                        continue
                if "size" not in company_data:
                    company_data["size"] = "Unknown"
            except:
                company_data["size"] = "Unknown"
            
            # Headquarters
            try:
                location_selectors = [
                    ".org-about-company-module__headquarters",
                    ".org-top-card-summary-info-list__info-item"
                ]
                for selector in location_selectors:
                    try:
                        location_elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                        for element in location_elements:
                            text = element.text.strip()
                            if ',' in text and any(word in text.lower() for word in ['united states', 'california', 'new york', 'texas', 'florida']):
                                company_data["headquarters"] = text
                                break
                        if "headquarters" in company_data:
                            break
                    except:
                        continue
                if "headquarters" not in company_data:
                    company_data["headquarters"] = "Unknown"
            except:
                company_data["headquarters"] = "Unknown"
            
            # Website
            try:
                website_selectors = [
                    ".org-about-us-company-module__website",
                    "a[data-control-name='company_website']"
                ]
                for selector in website_selectors:
                    try:
                        website_element = self.driver.find_element(By.CSS_SELECTOR, selector)
                        company_data["website"] = website_element.get_attribute("href")
                        break
                    except:
                        continue
                if "website" not in company_data:
                    company_data["website"] = ""
            except:
                company_data["website"] = ""
            
            # Description
            try:
                desc_selectors = [
                    ".org-about-us-company-module__description",
                    ".org-about-company-module__description"
                ]
                for selector in desc_selectors:
                    try:
                        desc_element = self.driver.find_element(By.CSS_SELECTOR, selector)
                        company_data["description"] = desc_element.text.strip()
                        break
                    except:
                        continue
                if "description" not in company_data:
                    company_data["description"] = ""
            except:
                company_data["description"] = ""
            
            # Follower count
            try:
                follower_selectors = [
                    ".org-top-card-summary-info-list__info-item",
                    ".org-top-card__followers-count"
                ]
                for selector in follower_selectors:
                    try:
                        follower_elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                        for element in follower_elements:
                            text = element.text.strip()
                            if any(word in text.lower() for word in ['follower', 'follow']):
                                company_data["follower_count"] = self._extract_number(text)
                                break
                        if "follower_count" in company_data:
                            break
                    except:
                        continue
                if "follower_count" not in company_data:
                    company_data["follower_count"] = 0
            except:
                company_data["follower_count"] = 0
            
            # Employee count
            try:
                employee_count = self._extract_number(company_data.get("size", ""))
                company_data["employee_count"] = employee_count if employee_count > 0 else 0
            except:
                company_data["employee_count"] = 0
            
            logger.info(f"Successfully scraped company data for: {company_data.get('name', 'Unknown')}")
            return company_data
            
        except Exception as e:
            logger.error(f"Error scraping company page: {e}")
            return {}
    
    async def _scrape_company_posts(self, company_url: str) -> List[Dict[str, Any]]:
        """Scrape recent company posts"""
        try:
            await self._rate_limit()
            
            posts_url = f"{company_url}/posts/"
            logger.info(f"Scraping company posts: {posts_url}")
            
            self.driver.get(posts_url)
            await asyncio.sleep(4)
            
            posts = []
            
            # Find post elements
            post_selectors = [
                ".update-components-text-view",
                ".feed-shared-text",
                ".feed-shared-update-v2__description"
            ]
            
            post_elements = []
            for selector in post_selectors:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    if elements:
                        post_elements = elements
                        break
                except:
                    continue
            
            for i, post_element in enumerate(post_elements[:10]):  # Limit to 10 posts
                try:
                    post_data = {}
                    
                    # Post content
                    post_data["content"] = post_element.text.strip()
                    
                    # Post date (try to find date element)
                    try:
                        date_selectors = [
                            "time",
                            ".feed-shared-actor__sub-description",
                            ".update-components-text-view__break-words time"
                        ]
                        for selector in date_selectors:
                            try:
                                date_element = post_element.find_element(By.CSS_SELECTOR, selector)
                                post_data["date"] = date_element.get_attribute("datetime") or date_element.text
                                break
                            except:
                                continue
                        if "date" not in post_data:
                            post_data["date"] = datetime.now().isoformat()
                    except:
                        post_data["date"] = datetime.now().isoformat()
                    
                    # Engagement (likes, comments, shares)
                    try:
                        engagement_selectors = [
                            ".social-details-social-counts",
                            ".feed-shared-social-counts"
                        ]
                        for selector in engagement_selectors:
                            try:
                                engagement_element = post_element.find_element(By.CSS_SELECTOR, selector)
                                post_data["engagement"] = self._extract_number(engagement_element.text)
                                break
                            except:
                                continue
                        if "engagement" not in post_data:
                            post_data["engagement"] = 0
                    except:
                        post_data["engagement"] = 0
                    
                    # Post type classification
                    post_data["type"] = self._classify_post_type(post_data["content"])
                    
                    # Post URL
                    try:
                        post_link = post_element.find_element(By.CSS_SELECTOR, "a")
                        post_data["url"] = post_link.get_attribute("href")
                    except:
                        post_data["url"] = ""
                    
                    # Author
                    post_data["author"] = "Company"
                    
                    posts.append(post_data)
                    
                except Exception as e:
                    logger.warning(f"Error scraping post {i}: {e}")
                    continue
            
            logger.info(f"Successfully scraped {len(posts)} posts")
            return posts
            
        except Exception as e:
            logger.error(f"Error scraping company posts: {e}")
            return []
    
    async def _scrape_job_postings(self, company_url: str) -> List[Dict[str, Any]]:
        """Scrape job postings"""
        try:
            await self._rate_limit()
            
            jobs_url = f"{company_url}/jobs/"
            logger.info(f"Scraping job postings: {jobs_url}")
            
            self.driver.get(jobs_url)
            await asyncio.sleep(4)
            
            jobs = []
            
            # Find job elements
            job_selectors = [
                ".job-search-card",
                ".job-card-container",
                ".job-card"
            ]
            
            job_elements = []
            for selector in job_selectors:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    if elements:
                        job_elements = elements
                        break
                except:
                    continue
            
            for i, job_element in enumerate(job_elements[:20]):  # Limit to 20 jobs
                try:
                    job_data = {}
                    
                    # Job title
                    try:
                        title_selectors = [
                            ".job-search-card__title",
                            ".job-card-list__title",
                            "h3"
                        ]
                        for selector in title_selectors:
                            try:
                                title_element = job_element.find_element(By.CSS_SELECTOR, selector)
                                job_data["title"] = title_element.text.strip()
                                break
                            except:
                                continue
                        if "title" not in job_data:
                            job_data["title"] = "Unknown Position"
                    except:
                        job_data["title"] = "Unknown Position"
                    
                    # Location
                    try:
                        location_selectors = [
                            ".job-search-card__location",
                            ".job-card-list__location"
                        ]
                        for selector in location_selectors:
                            try:
                                location_element = job_element.find_element(By.CSS_SELECTOR, selector)
                                job_data["location"] = location_element.text.strip()
                                break
                            except:
                                continue
                        if "location" not in job_data:
                            job_data["location"] = "Remote"
                    except:
                        job_data["location"] = "Remote"
                    
                    # Department (extract from title)
                    job_data["department"] = self._extract_department(job_data["title"])
                    
                    # Date posted
                    try:
                        date_selectors = [
                            ".job-search-card__listdate",
                            ".job-card-list__date"
                        ]
                        for selector in date_selectors:
                            try:
                                date_element = job_element.find_element(By.CSS_SELECTOR, selector)
                                job_data["date_posted"] = date_element.text.strip()
                                break
                            except:
                                continue
                        if "date_posted" not in job_data:
                            job_data["date_posted"] = datetime.now().isoformat()
                    except:
                        job_data["date_posted"] = datetime.now().isoformat()
                    
                    # Requirements (placeholder)
                    job_data["requirements"] = []
                    
                    # Description
                    job_data["description"] = f"Position: {job_data['title']} at {job_data.get('location', 'Unknown location')}"
                    
                    # Salary range
                    job_data["salary_range"] = "Not specified"
                    
                    # Employment type
                    job_data["employment_type"] = "full-time"
                    
                    jobs.append(job_data)
                    
                except Exception as e:
                    logger.warning(f"Error scraping job {i}: {e}")
                    continue
            
            logger.info(f"Successfully scraped {len(jobs)} job postings")
            return jobs
            
        except Exception as e:
            logger.error(f"Error scraping job postings: {e}")
            return []
    
    async def _scrape_employees(self, company_url: str) -> List[Dict[str, Any]]:
        """Scrape employee data"""
        try:
            await self._rate_limit()
            
            people_url = f"{company_url}/people/"
            logger.info(f"Scraping employees: {people_url}")
            
            self.driver.get(people_url)
            await asyncio.sleep(4)
            
            employees = []
            
            # Find employee elements
            employee_selectors = [
                ".org-people-profile-card",
                ".search-result__info",
                ".entity-result__item"
            ]
            
            employee_elements = []
            for selector in employee_selectors:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    if elements:
                        employee_elements = elements
                        break
                except:
                    continue
            
            for i, employee_element in enumerate(employee_elements[:50]):  # Limit to 50 employees
                try:
                    employee_data = {}
                    
                    # Name
                    try:
                        name_selectors = [
                            ".org-people-profile-card__profile-title",
                            ".search-result__title",
                            "h3"
                        ]
                        for selector in name_selectors:
                            try:
                                name_element = employee_element.find_element(By.CSS_SELECTOR, selector)
                                employee_data["name"] = name_element.text.strip()
                                break
                            except:
                                continue
                        if "name" not in employee_data:
                            employee_data["name"] = "Unknown Employee"
                    except:
                        employee_data["name"] = "Unknown Employee"
                    
                    # Title
                    try:
                        title_selectors = [
                            ".org-people-profile-card__profile-position",
                            ".search-result__subtitle"
                        ]
                        for selector in title_selectors:
                            try:
                                title_element = employee_element.find_element(By.CSS_SELECTOR, selector)
                                employee_data["title"] = title_element.text.strip()
                                break
                            except:
                                continue
                        if "title" not in employee_data:
                            employee_data["title"] = "Employee"
                    except:
                        employee_data["title"] = "Employee"
                    
                    # Department (extract from title)
                    employee_data["department"] = self._extract_department(employee_data["title"])
                    
                    # Level (extract from title)
                    employee_data["level"] = self._extract_employee_level(employee_data["title"])
                    
                    # Location
                    employee_data["location"] = "Unknown"
                    
                    # Skills (placeholder)
                    employee_data["skills"] = []
                    
                    # Experience years (placeholder)
                    employee_data["experience_years"] = 0
                    
                    # Education (placeholder)
                    employee_data["education"] = []
                    
                    # Profile URL
                    try:
                        profile_link = employee_element.find_element(By.CSS_SELECTOR, "a")
                        employee_data["profile_url"] = profile_link.get_attribute("href")
                    except:
                        employee_data["profile_url"] = ""
                    
                    employees.append(employee_data)
                    
                except Exception as e:
                    logger.warning(f"Error scraping employee {i}: {e}")
                    continue
            
            logger.info(f"Successfully scraped {len(employees)} employees")
            return employees
            
        except Exception as e:
            logger.error(f"Error scraping employees: {e}")
            return []
    
    def _extract_number(self, text: str) -> int:
        """Extract number from text (e.g., '1.2K' -> 1200)"""
        try:
            text = text.lower().replace(',', '')
            if 'k' in text:
                return int(float(text.replace('k', '')) * 1000)
            elif 'm' in text:
                return int(float(text.replace('m', '')) * 1000000)
            else:
                numbers = re.findall(r'\d+', text)
                return int(numbers[0]) if numbers else 0
        except:
            return 0
    
    def _classify_post_type(self, content: str) -> str:
        """Classify post type based on content"""
        content_lower = content.lower()
        
        if any(word in content_lower for word in ['hiring', 'job', 'career', 'position', 'open', 'recruiting']):
            return PostType.HIRING.value
        elif any(word in content_lower for word in ['expansion', 'new office', 'growing', 'expand', 'opening']):
            return PostType.EXPANSION.value
        elif any(word in content_lower for word in ['milestone', 'achievement', 'celebration', 'anniversary', 'reached']):
            return PostType.MILESTONE.value
        else:
            return PostType.GENERAL.value
    
    def _extract_department(self, title: str) -> str:
        """Extract department from job title"""
        title_lower = title.lower()
        
        if any(word in title_lower for word in ['engineer', 'developer', 'devops', 'software', 'programming']):
            return "Engineering"
        elif any(word in title_lower for word in ['product', 'ux', 'ui', 'design', 'designer']):
            return "Product"
        elif any(word in title_lower for word in ['sales', 'account', 'business development', 'revenue']):
            return "Sales"
        elif any(word in title_lower for word in ['marketing', 'growth', 'content', 'brand']):
            return "Marketing"
        elif any(word in title_lower for word in ['hr', 'human resources', 'recruiter', 'talent']):
            return "HR"
        elif any(word in title_lower for word in ['finance', 'accounting', 'financial', 'controller']):
            return "Finance"
        elif any(word in title_lower for word in ['manager', 'director', 'vp', 'chief', 'executive']):
            return "Management"
        else:
            return "Operations"
    
    def _extract_employee_level(self, title: str) -> str:
        """Extract employee level from title"""
        title_lower = title.lower()
        
        if any(word in title_lower for word in ['ceo', 'cto', 'cfo', 'chief', 'president']):
            return EmployeeLevel.C_LEVEL.value
        elif any(word in title_lower for word in ['vp', 'vice president', 'vice-president']):
            return EmployeeLevel.VP.value
        elif any(word in title_lower for word in ['director', 'head of']):
            return EmployeeLevel.DIRECTOR.value
        elif any(word in title_lower for word in ['manager', 'lead', 'supervisor']):
            return EmployeeLevel.MANAGER.value
        elif any(word in title_lower for word in ['senior', 'sr', 'principal']):
            return EmployeeLevel.SENIOR.value
        elif any(word in title_lower for word in ['junior', 'jr', 'associate']):
            return EmployeeLevel.JUNIOR.value
        else:
            return EmployeeLevel.ENTRY.value
    
    def close(self):
        """Close the browser driver"""
        if self.driver:
            try:
                self.driver.quit()
                logger.info("Browser driver closed successfully")
            except Exception as e:
                logger.error(f"Error closing browser driver: {e}") 