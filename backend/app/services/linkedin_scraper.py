import asyncio
import random
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging

from app.models.company import Company, CompanyPost, JobPosting, PostType
from app.models.employee import Employee, EmployeeProfile, EmployeeLevel

logger = logging.getLogger(__name__)

import os
from dotenv import load_dotenv

load_dotenv()

class LinkedInScraper:
    """
    LinkedIn data scraper service with robust mock data for development
    """
    
    def __init__(self):
        self.email = os.getenv('LINKEDIN_EMAIL')
        self.password = os.getenv('LINKEDIN_PASSWORD')
        self.use_mock_data = not (self.email and self.password)  # Use mock data if no credentials
        
        if self.use_mock_data:
            logger.info("LinkedIn credentials not found. Using mock data for development.")
        
    async def scrape_company_data(self, company_name: str) -> Dict[str, Any]:
        """Scrape comprehensive company data from LinkedIn or return mock data"""
        logger.info(f"Collecting data for company: {company_name}")
        
        try:
            if self.use_mock_data:
                return await self._generate_mock_company_data(company_name)
            else:
                return await self._scrape_real_data(company_name)
                
        except Exception as e:
            logger.error(f"Failed to scrape company data: {str(e)}")
            logger.info("Falling back to mock data")
            return await self._generate_mock_company_data(company_name)
    
    async def _generate_mock_company_data(self, company_name: str) -> Dict[str, Any]:
        """Generate comprehensive mock data for development and testing"""
        logger.info(f"Generating mock data for {company_name}")
        
        # Generate company information
        company = Company(
            name=company_name,
            industry=random.choice(["Software Development", "Technology", "Finance", "Healthcare", "Consulting"]),
            size=random.choice(["1001-5000 employees", "501-1000 employees", "201-500 employees"]),
            headquarters=random.choice(["San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Boston, MA"]),
            founded=random.randint(1990, 2015),
            website=f"https://www.{company_name.lower().replace(' ', '')}.com",
            description=f"{company_name} is a leading technology company specializing in innovative solutions for modern businesses. We focus on delivering high-quality products and services that drive digital transformation.",
            employee_count=random.randint(500, 5000),
            follower_count=random.randint(10000, 100000)
        )
        
        # Generate recent posts
        recent_posts = []
        post_types = [PostType.HIRING, PostType.EXPANSION, PostType.MILESTONE, PostType.GENERAL]
        
        for i in range(random.randint(5, 15)):
            post_type = random.choice(post_types)
            post = CompanyPost(
                id=f"post_{i+1}",
                content=self._generate_mock_post_content(company_name, post_type),
                date=datetime.now() - timedelta(days=random.randint(1, 30)),
                engagement=random.randint(50, 500),
                type=post_type,
                url=f"https://linkedin.com/company/{company_name.lower()}/posts/{i+1}",
                author=f"{company_name} HR Team"
            )
            recent_posts.append(post)
        
        # Generate job postings
        job_postings = []
        departments = ["Engineering", "Product", "Sales", "Marketing", "Operations", "HR", "Finance"]
        job_titles = {
            "Engineering": ["Senior Software Engineer", "Frontend Developer", "Backend Developer", "DevOps Engineer", "Data Engineer"],
            "Product": ["Product Manager", "UX Designer", "Product Analyst", "UI/UX Designer"],
            "Sales": ["Account Executive", "Sales Development Rep", "Sales Manager", "Business Development"],
            "Marketing": ["Marketing Manager", "Content Manager", "Digital Marketer", "Growth Manager"],
            "Operations": ["Operations Manager", "Business Analyst", "Project Manager"],
            "HR": ["HR Manager", "Recruiter", "People Operations"],
            "Finance": ["Financial Analyst", "Accounting Manager", "Finance Manager"]
        }
        
        for i in range(random.randint(8, 25)):
            department = random.choice(departments)
            title = random.choice(job_titles[department])
            
            job = JobPosting(
                id=f"job_{i+1}",
                title=title,
                location=random.choice(["San Francisco, CA", "Remote", "New York, NY", "Austin, TX", "Hybrid"]),
                department=department,
                date_posted=datetime.now() - timedelta(days=random.randint(1, 15)),
                requirements=self._generate_job_requirements(title),
                description=f"We are looking for a talented {title} to join our {department} team. This role offers exciting opportunities to work on cutting-edge projects.",
                salary_range=f"${random.randint(80, 200)}K - ${random.randint(120, 300)}K",
                employment_type="full-time"
            )
            job_postings.append(job)
        
        # Generate employee data
        employees = []
        for i in range(random.randint(15, 50)):
            employee = self._generate_mock_employee(i+1, departments)
            employees.append(employee)
        
        return {
            "company": company,
            "recent_posts": recent_posts,
            "job_postings": job_postings,
            "employees": employees
        }
    
    async def _scrape_real_data(self, company_name: str) -> Dict[str, Any]:
        """Scrape real data from LinkedIn (placeholder for actual implementation)"""
        # This would contain the actual Selenium scraping logic
        # For now, falling back to mock data
        logger.warning("Real LinkedIn scraping not fully implemented. Using mock data.")
        return await self._generate_mock_company_data(company_name)
    
    def _generate_mock_post_content(self, company_name: str, post_type: PostType) -> str:
        """Generate realistic post content based on type"""
        if post_type == PostType.HIRING:
            return f"Exciting news! {company_name} is expanding our team. We're hiring talented professionals in Engineering, Product, and Sales. Join us in building the future of technology! #Hiring #TechJobs #Innovation"
        elif post_type == PostType.EXPANSION:
            return f"🎉 We're thrilled to announce the opening of our new office in Austin, TX! This expansion reflects our commitment to growth and bringing our services closer to our customers. #Expansion #Growth #Austin"
        elif post_type == PostType.MILESTONE:
            return f"Celebrating a major milestone! {company_name} has just reached 1 million users and $50M in annual revenue. Thank you to our amazing team and customers who made this possible! #Milestone #Growth #Grateful"
        else:
            return f"At {company_name}, we believe in innovation and excellence. Our team continues to push boundaries and deliver exceptional solutions for our clients. #Innovation #TeamWork #Excellence"
    
    def _generate_job_requirements(self, title: str) -> List[str]:
        """Generate realistic job requirements based on title"""
        base_requirements = {
            "engineer": ["5+ years experience", "Bachelor's degree", "Strong problem-solving skills"],
            "senior": ["7+ years experience", "Leadership experience", "Mentoring skills"],
            "manager": ["Management experience", "Strategic thinking", "Team leadership"],
            "developer": ["3+ years experience", "Strong coding skills", "Agile experience"],
            "designer": ["Design portfolio", "UX/UI skills", "Creative thinking"],
            "analyst": ["Data analysis skills", "Excel/SQL proficiency", "Analytical mindset"]
        }
        
        tech_skills = {
            "Software Engineer": ["Python", "JavaScript", "React", "Node.js", "AWS"],
            "Frontend Developer": ["React", "JavaScript", "HTML/CSS", "TypeScript", "Vue.js"],
            "Backend Developer": ["Python", "Java", "SQL", "REST APIs", "Docker"],
            "DevOps Engineer": ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
            "Data Engineer": ["Python", "SQL", "Apache Spark", "ETL", "Data Warehousing"],
            "Product Manager": ["Product strategy", "Agile", "Data analysis", "User research"],
            "UX Designer": ["Figma", "User research", "Prototyping", "Design systems"],
            "Sales": ["CRM experience", "B2B sales", "Communication skills", "Relationship building"]
        }
        
        requirements = []
        
        # Add base requirements
        title_lower = title.lower()
        for key, reqs in base_requirements.items():
            if key in title_lower:
                requirements.extend(reqs)
                break
        else:
            requirements.extend(base_requirements["developer"])
        
        # Add tech-specific skills
        for role, skills in tech_skills.items():
            if role.lower() in title_lower:
                requirements.extend(random.sample(skills, random.randint(2, 4)))
                break
        
        return list(set(requirements))  # Remove duplicates
    
    def _generate_mock_employee(self, employee_id: int, departments: List[str]) -> Dict[str, Any]:
        """Generate mock employee data"""
        first_names = ["Sarah", "Michael", "Jennifer", "David", "Lisa", "John", "Emily", "Robert", "Jessica", "William"]
        last_names = ["Johnson", "Smith", "Brown", "Davis", "Wilson", "Garcia", "Martinez", "Anderson", "Taylor", "Thomas"]
        
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        department = random.choice(departments)
        level = random.choice(list(EmployeeLevel))
        
        title_map = {
            EmployeeLevel.ENTRY: "Junior",
            EmployeeLevel.JUNIOR: "Junior",
            EmployeeLevel.SENIOR: "Senior",
            EmployeeLevel.LEAD: "Lead",
            EmployeeLevel.MANAGER: "Manager",
            EmployeeLevel.DIRECTOR: "Director",
            EmployeeLevel.VP: "VP",
            EmployeeLevel.C_LEVEL: "Chief"
        }
        
        title = f"{title_map[level]} {department} Specialist"
        if level in [EmployeeLevel.MANAGER, EmployeeLevel.DIRECTOR]:
            title = f"{department} {title_map[level]}"
        elif level == EmployeeLevel.VP:
            title = f"VP of {department}"
        elif level == EmployeeLevel.C_LEVEL:
            title = f"Chief {department} Officer"
        
        employee = {
            "id": str(employee_id),
            "name": name,
            "title": title,
            "department": department,
            "tenure": random.choice(["6 months", "1 year", "2 years", "3 years", "5+ years"]),
            "skills": self._generate_employee_skills(),
            "recentActivity": [
                f"Posted about {random.choice(['innovation', 'teamwork', 'company culture', 'project success'])}",
                f"Shared insights on {random.choice(['technology trends', 'industry best practices', 'career development'])}"
            ]
        }
        
        return employee
    
    def _generate_employee_skills(self) -> List[str]:
        """Generate realistic employee skills"""
        skills_pool = [
            "Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes",
            "Machine Learning", "Data Analysis", "SQL", "Project Management", "Agile",
            "Leadership", "Communication", "Problem Solving", "Team Collaboration",
            "Strategic Planning", "UX Design", "Product Management", "Sales", "Marketing"
        ]
        return random.sample(skills_pool, random.randint(4, 8))
    
    async def search_competitors(self, industry: str, size: str) -> List[str]:
        """Search for competitor companies in the same industry"""
        competitors_by_industry = {
            "technology": ["Microsoft", "Google", "Amazon", "Apple", "Meta", "Salesforce", "Oracle"],
            "software_development": ["GitHub", "Atlassian", "JetBrains", "Docker", "MongoDB", "Redis"],
            "finance": ["JPMorgan Chase", "Goldman Sachs", "Wells Fargo", "Bank of America", "Citi"],
            "healthcare": ["UnitedHealth", "Anthem", "Aetna", "Humana", "Kaiser Permanente"],
            "consulting": ["McKinsey", "Deloitte", "PwC", "EY", "Accenture", "Bain & Company"]
        }
        
        industry_key = industry.lower().replace(" ", "_")
        competitors = competitors_by_industry.get(industry_key, competitors_by_industry["technology"])
        
        return random.sample(competitors, min(5, len(competitors)))
