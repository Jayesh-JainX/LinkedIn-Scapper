import asyncio
import random
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging

from app.models.company import Company, CompanyPost, JobPosting, PostType, IndustryType, CompanySize
from app.models.employee import Employee, EmployeeProfile, EmployeeLevel

logger = logging.getLogger(__name__)

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

load_dotenv()

class LinkedInScraper:
    """
    LinkedIn data scraper service using Selenium for real-time data collection
    """
    
    def __init__(self):
        self.email = os.getenv('LINKEDIN_EMAIL')
        self.password = os.getenv('LINKEDIN_PASSWORD')
        self.driver = None
        self.wait = None
        
    def _initialize_driver(self):
        """Initialize Selenium WebDriver with appropriate options"""
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        
        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 10)
        
    async def _login(self):
        """Login to LinkedIn using credentials from environment variables"""
        if not self.email or not self.password:
            raise ValueError("LinkedIn credentials not found in environment variables")
            
        try:
            self.driver.get('https://www.linkedin.com/login')
            
            # Enter email
            email_input = self.wait.until(EC.presence_of_element_located((By.ID, 'username')))
            email_input.send_keys(self.email)
            
            # Enter password
            password_input = self.driver.find_element(By.ID, 'password')
            password_input.send_keys(self.password)
            
            # Click login button
            login_button = self.driver.find_element(By.CSS_SELECTOR, '[type="submit"]')
            login_button.click()
            
            # Wait for login to complete
            self.wait.until(EC.presence_of_element_located((By.ID, 'global-nav')))
            
        except Exception as e:
            logger.error(f"Failed to login to LinkedIn: {str(e)}")
            raise
        
    async def scrape_company_data(self, company_name: str) -> Dict[str, Any]:
        """Scrape comprehensive company data from LinkedIn"""
        logger.info(f"Scraping data for company: {company_name}")
        
        try:
            if not self.driver:
                self._initialize_driver()
                await self._login()
            
            # Navigate to company page
            company_url = f"https://www.linkedin.com/company/{company_name.lower().replace(' ', '-')}"
            self.driver.get(company_url)
            
            # Wait for company page to load
            self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'org-top-card')))
            
            # Extract company info
            company = await self._extract_company_info()
            
            # Get recent posts, jobs, and employees
            recent_posts = await self._scrape_company_posts(company_name)
            job_postings = await self._scrape_job_postings(company_name)
            employees = await self._scrape_employee_data(company_name)
            
            company_data = {
                "company": company,
                "recent_posts": recent_posts,
                "job_postings": job_postings,
                "employees": employees
            }
            
            return company_data
            
        except Exception as e:
            logger.error(f"Failed to scrape company data: {str(e)}")
            raise
        finally:
            if self.driver:
                self.driver.quit()
                self.driver = None
    
    async def _extract_company_info(self) -> Company:
        """Extract company information from the company page"""
        try:
            # Get company name
            name = self.driver.find_element(By.CLASS_NAME, 'org-top-card-summary__title').text
            
            # Get industry and size
            about_section = self.driver.find_elements(By.CLASS_NAME, 'org-top-card-summary-info-list__info-item')
            industry = IndustryType.TECHNOLOGY  # Default
            size = CompanySize.ENTERPRISE  # Default
            
            for item in about_section:
                text = item.text.lower()
                if 'employees' in text:
                    size = self._parse_company_size(text)
                elif any(ind.value.lower() in text for ind in IndustryType):
                    industry = self._parse_industry(text)
            
            # Get description
            description = self.driver.find_element(By.CLASS_NAME, 'org-about-us-organization-description__text').text
            
            # Get follower count
            follower_count = int(self.driver.find_element(By.CLASS_NAME, 'org-top-card-summary-info-list__info-item')
                                .text.split()[0].replace(',', ''))
            
            # Get website and location
            website = ''
            headquarters = ''
            company_details = self.driver.find_elements(By.CLASS_NAME, 'org-about-company-module__company-page-url')
            for detail in company_details:
                if 'Website' in detail.text:
                    website = detail.find_element(By.TAG_NAME, 'a').get_attribute('href')
                elif 'Headquarters' in detail.text:
                    headquarters = detail.text.replace('Headquarters\n', '')
            
            return Company(
                name=name,
                industry=industry,
                size=size,
                headquarters=headquarters,
                website=website,
                description=description,
                employee_count=self._parse_employee_count(size),
                follower_count=follower_count
            )
            
        except Exception as e:
            logger.error(f"Failed to extract company info: {str(e)}")
            raise
    
    async def _scrape_company_posts(self, company_name: str) -> List[CompanyPost]:
        """Scrape recent company posts from LinkedIn"""
        try:
            # Navigate to posts tab
            posts_url = f"https://www.linkedin.com/company/{company_name.lower().replace(' ', '-')}/posts/"
            self.driver.get(posts_url)
            
            # Wait for posts to load
            self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'org-updates__content')))
            
            # Scroll to load more posts (load last 30 days of posts)
            last_height = self.driver.execute_script("return document.body.scrollHeight")
            posts_loaded = 0
            max_posts = 20
            
            while posts_loaded < max_posts:
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                await asyncio.sleep(2)  # Wait for new posts to load
                
                new_height = self.driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    break
                    
                last_height = new_height
                posts_loaded += 5  # Approximate number of posts loaded per scroll
            
            # Extract posts
            post_elements = self.driver.find_elements(By.CLASS_NAME, 'org-update-card')
            posts = []
            
            for element in post_elements[:max_posts]:
                try:
                    # Extract post content
                    content = element.find_element(By.CLASS_NAME, 'feed-shared-update-v2__description').text
                    
                    # Extract post date
                    date_element = element.find_element(By.CLASS_NAME, 'feed-shared-actor__sub-description')
                    date_text = date_element.text.split('•')[0].strip()
                    post_date = self._parse_post_date(date_text)
                    
                    # Extract engagement metrics
                    engagement = 0
                    try:
                        engagement_text = element.find_element(By.CLASS_NAME, 'social-details-social-counts').text
                        engagement = sum(int(''.join(filter(str.isdigit, num))) 
                                       for num in engagement_text.split() if any(c.isdigit() for c in num))
                    except NoSuchElementException:
                        pass
                    
                    # Determine post type based on content
                    post_type = self._determine_post_type(content)
                    
                    # Extract author
                    author = element.find_element(By.CLASS_NAME, 'feed-shared-actor__name').text
                    
                    post = CompanyPost(
                        id=element.get_attribute('data-urn'),
                        content=content,
                        date=post_date,
                        engagement=engagement,
                        type=post_type,
                        author=author
                    )
                    posts.append(post)
                    
                except Exception as e:
                    logger.warning(f"Failed to extract post data: {str(e)}")
                    continue
            
            return posts
            
        except Exception as e:
            logger.error(f"Failed to scrape company posts: {str(e)}")
            raise
            
    def _parse_post_date(self, date_text: str) -> datetime:
        """Parse LinkedIn post date text into datetime object"""
        try:
            if 'hour' in date_text or 'minute' in date_text:
                hours = int(date_text.split()[0]) if 'hour' in date_text else 0
                minutes = int(date_text.split()[0]) if 'minute' in date_text else 0
                return datetime.now() - timedelta(hours=hours, minutes=minutes)
            elif 'day' in date_text:
                days = int(date_text.split()[0])
                return datetime.now() - timedelta(days=days)
            elif 'week' in date_text:
                weeks = int(date_text.split()[0])
                return datetime.now() - timedelta(weeks=weeks)
            elif 'month' in date_text:
                months = int(date_text.split()[0])
                return datetime.now() - timedelta(days=months * 30)
            else:
                return datetime.now()
        except Exception:
            return datetime.now()
            
    def _determine_post_type(self, content: str) -> PostType:
        """Determine post type based on content analysis"""
        content_lower = content.lower()
        
        if any(keyword in content_lower for keyword in ['hiring', 'job', 'career', 'position', 'opportunity']):
            return PostType.HIRING
        elif any(keyword in content_lower for keyword in ['expansion', 'growth', 'new office', 'new location']):
            return PostType.EXPANSION
        elif any(keyword in content_lower for keyword in ['milestone', 'anniversary', 'achievement', 'award']):
            return PostType.MILESTONE
        else:
            return PostType.GENERAL
    
    async def _scrape_job_postings(self, company_name: str) -> List[JobPosting]:
        """Scrape current job postings from LinkedIn"""
        try:
            # Navigate to jobs page
            jobs_url = f"https://www.linkedin.com/company/{company_name.lower().replace(' ', '-')}/jobs/"
            self.driver.get(jobs_url)
            
            # Wait for jobs to load
            self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'org-jobs-recently-posted-jobs-module__jobs-list')))
            
            # Get all job cards
            job_cards = self.driver.find_elements(By.CLASS_NAME, 'job-card-container')
            jobs = []
            
            for card in job_cards:
                try:
                    # Click on job card to load details
                    card.click()
                    await asyncio.sleep(1)  # Wait for details to load
                    
                    # Extract job ID
                    job_id = card.get_attribute('data-job-id')
                    
                    # Extract job title
                    title = card.find_element(By.CLASS_NAME, 'job-card-list__title').text
                    
                    # Extract location
                    location = card.find_element(By.CLASS_NAME, 'job-card-container__metadata-item').text
                    
                    # Extract department from job description
                    description = self.wait.until(
                        EC.presence_of_element_located((By.CLASS_NAME, 'jobs-description__content'))
                    ).text
                    department = self._extract_department(description)
                    
                    # Extract posting date
                    date_element = card.find_element(By.CLASS_NAME, 'job-card-container__posted-date')
                    date_posted = self._parse_job_date(date_element.text)
                    
                    # Extract employment type
                    employment_type = 'Full-time'  # Default
                    try:
                        employment_type = card.find_element(
                            By.CLASS_NAME, 'job-card-container__employment-type'
                        ).text
                    except NoSuchElementException:
                        pass
                    
                    # Extract requirements
                    requirements = self._extract_requirements(description)
                    
                    job = JobPosting(
                        id=job_id,
                        title=title,
                        location=location,
                        department=department,
                        date_posted=date_posted,
                        requirements=requirements,
                        employment_type=employment_type
                    )
                    jobs.append(job)
                    
                except Exception as e:
                    logger.warning(f"Failed to extract job data: {str(e)}")
                    continue
            
            return jobs
            
        except Exception as e:
            logger.error(f"Failed to scrape job postings: {str(e)}")
            raise
    
    def _extract_department(self, description: str) -> str:
        """Extract department from job description"""
        department_keywords = {
            'Engineering': ['engineering', 'developer', 'software', 'technical'],
            'Product': ['product', 'program manager'],
            'Data': ['data', 'analytics', 'machine learning', 'ai'],
            'Operations': ['operations', 'ops', 'support'],
            'Design': ['design', 'ux', 'ui', 'user experience'],
            'Marketing': ['marketing', 'growth', 'content'],
            'Sales': ['sales', 'business development', 'account']
        }
        
        description_lower = description.lower()
        for dept, keywords in department_keywords.items():
            if any(keyword in description_lower for keyword in keywords):
                return dept
        return 'Other'
    
    def _extract_requirements(self, description: str) -> List[str]:
        """Extract key requirements from job description"""
        requirements = []
        description_lines = description.split('\n')
        
        # Look for requirements section
        in_requirements = False
        for line in description_lines:
            line = line.strip()
            if not line:
                continue
                
            if any(keyword in line.lower() for keyword in ['requirements', 'qualifications', 'what you\'ll need']):
                in_requirements = True
                continue
            elif in_requirements and any(keyword in line.lower() for keyword in ['responsibilities', 'what you\'ll do', 'about us']):
                break
            elif in_requirements and line.startswith(('•', '-', '·')):
                requirements.append(line.lstrip('•-· '))
                
        return requirements[:5]  # Return top 5 requirements
    
    def _parse_job_date(self, date_text: str) -> datetime:
        """Parse LinkedIn job posting date"""
        try:
            if 'hour' in date_text:
                hours = int(date_text.split()[0])
                return datetime.now() - timedelta(hours=hours)
            elif 'day' in date_text:
                days = int(date_text.split()[0])
                return datetime.now() - timedelta(days=days)
            elif 'week' in date_text:
                weeks = int(date_text.split()[0])
                return datetime.now() - timedelta(weeks=weeks)
            elif 'month' in date_text:
                months = int(date_text.split()[0])
                return datetime.now() - timedelta(days=months * 30)
            else:
                return datetime.now()
        except Exception:
            return datetime.now()
    
    async def _scrape_employee_data(self, company_name: str, limit: int = 20) -> List[EmployeeProfile]:
        """Scrape employee profile data from LinkedIn"""
        try:
            # Navigate to people page
            people_url = f"https://www.linkedin.com/company/{company_name.lower().replace(' ', '-')}/people/"
            self.driver.get(people_url)
            
            # Wait for employee list to load
            self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'org-people-profile-card')))
            
            # Scroll to load more employees
            last_height = self.driver.execute_script("return document.body.scrollHeight")
            employees_loaded = 0
            
            while employees_loaded < limit:
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                await asyncio.sleep(2)  # Wait for new profiles to load
                
                new_height = self.driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    break
                    
                last_height = new_height
                employees_loaded += 10  # Approximate number of profiles loaded per scroll
            
            # Get all employee cards
            employee_cards = self.driver.find_elements(By.CLASS_NAME, 'org-people-profile-card')
            employees = []
            
            for card in employee_cards[:limit]:
                try:
                    # Extract basic info
                    name = card.find_element(By.CLASS_NAME, 'org-people-profile-card__profile-title').text
                    title = card.find_element(By.CLASS_NAME, 'org-people-profile-card__profile-position').text
                    
                    # Click on profile to load details
                    card.click()
                    await asyncio.sleep(1)  # Wait for profile to load
                    
                    # Extract detailed info from profile modal
                    profile_modal = self.wait.until(
                        EC.presence_of_element_located((By.CLASS_NAME, 'artdeco-modal__content'))
                    )
                    
                    # Get location
                    location = "Unknown"
                    try:
                        location = profile_modal.find_element(By.CLASS_NAME, 'org-people-profile-card__location').text
                    except NoSuchElementException:
                        pass
                    
                    # Get tenure
                    tenure = "Not specified"
                    try:
                        tenure = profile_modal.find_element(By.CLASS_NAME, 'org-people-profile-card__tenure').text
                    except NoSuchElementException:
                        pass
                    
                    # Determine employee level based on title
                    level = self._determine_employee_level(title)
                    
                    # Get previous positions
                    previous_positions = []
                    try:
                        position_elements = profile_modal.find_elements(By.CLASS_NAME, 'org-people-profile-card__previous-position')
                        previous_positions = [pos.text for pos in position_elements]
                    except NoSuchElementException:
                        pass
                    
                    # Get education
                    education = []
                    try:
                        education_elements = profile_modal.find_elements(By.CLASS_NAME, 'org-people-profile-card__education')
                        education = [edu.text for edu in education_elements]
                    except NoSuchElementException:
                        pass
                    
                    # Get skills
                    skills = []
                    try:
                        skill_elements = profile_modal.find_elements(By.CLASS_NAME, 'org-people-profile-card__skill')
                        skills = [skill.text for skill in skill_elements]
                    except NoSuchElementException:
                        pass
                    
                    # Create employee profile
                    employee = EmployeeProfile(
                        employee=Employee(
                            id=card.get_attribute('data-profile-id'),
                            name=name,
                            title=title,
                            tenure=tenure,
                            location=location,
                            level=level
                        ),
                        previous_positions=previous_positions,
                        education=education,
                        skills=skills
                    )
                    employees.append(employee)
                    
                    # Close profile modal
                    close_button = self.driver.find_element(By.CLASS_NAME, 'artdeco-modal__dismiss')
                    close_button.click()
                    
                except Exception as e:
                    logger.warning(f"Failed to extract employee data: {str(e)}")
                    continue
            
            return employees
            
        except Exception as e:
            logger.error(f"Failed to scrape employee data: {str(e)}")
            raise
    
    def _determine_employee_level(self, title: str) -> EmployeeLevel:
        """Determine employee level based on job title"""
        title_lower = title.lower()
        
        if any(keyword in title_lower for keyword in ['senior', 'lead', 'manager', 'director', 'vp', 'head']):
            return EmployeeLevel.SENIOR
        elif any(keyword in title_lower for keyword in ['junior', 'associate', 'intern']):
            return EmployeeLevel.JUNIOR
        else:
            return EmployeeLevel.MID
    
    def _generate_mock_post_content(self, company_name: str, post_type: PostType) -> str:
        """Generate mock post content based on type"""
        if post_type == PostType.HIRING:
            return f"We're excited to announce that {company_name} is expanding our team! We're looking for talented individuals to join our growing organization."
        elif post_type == PostType.EXPANSION:
            return f"Big news! {company_name} is opening a new office location to better serve our customers and expand our reach."
        elif post_type == PostType.MILESTONE:
            return f"Proud to share that {company_name} has reached a significant milestone in our journey. Thank you to our amazing team and customers!"
        else:
            return f"Another great day at {company_name}! Our team continues to innovate and deliver exceptional results."
    
    def _generate_job_requirements(self) -> List[str]:
        """Generate mock job requirements"""
        tech_skills = ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes"]
        soft_skills = ["Communication", "Leadership", "Problem Solving", "Team Collaboration"]
        experience = ["3+ years experience", "Bachelor's degree", "Agile methodology"]
        
        requirements = []
        requirements.extend(random.sample(tech_skills, random.randint(2, 4)))
        requirements.extend(random.sample(soft_skills, random.randint(1, 2)))
        requirements.extend(random.sample(experience, random.randint(1, 2)))
        
        return requirements
    
    def _generate_employee_skills(self) -> List[str]:
        """Generate mock employee skills"""
        skills = [
            "Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes",
            "Machine Learning", "Data Analysis", "Product Management", "UX Design",
            "Project Management", "Agile", "Scrum", "Leadership"
        ]
        return random.sample(skills, random.randint(3, 7))
    
    async def search_competitors(self, industry: str, size: str) -> List[str]:
        """Search for competitor companies"""
        await asyncio.sleep(1)
        
        # Mock competitor data
        competitors = [
            "InnovateX", "DataFlow Systems", "CloudTech Pro", "NextGen Solutions",
            "TechForward Inc", "Digital Dynamics", "SmartSystems Corp", "FutureTech Labs"
        ]
        
        return random.sample(competitors, random.randint(3, 5))
