from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

from app.models.database_models import Company, CompanyPost, JobPosting, Employee, ScrapingSession, ScrapedData
from app.database import SessionLocal

logger = logging.getLogger(__name__)

class DataRepository:
    """Repository for handling database operations"""
    
    def __init__(self):
        self.db: Session = SessionLocal()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.db.close()
    
    def create_scraping_session(self, company_name: str) -> ScrapingSession:
        """Create a new scraping session"""
        session = ScrapingSession(
            company_name=company_name,
            status="pending"
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session
    
    def update_session_status(self, session_id: int, status: str, error_message: str = None):
        """Update scraping session status"""
        session = self.db.query(ScrapingSession).filter(ScrapingSession.id == session_id).first()
        if session:
            session.status = status
            if status == "completed":
                session.completed_at = datetime.now()
            if error_message:
                session.error_message = error_message
            self.db.commit()
    
    def save_company_data(self, session_id: int, company_data: Dict[str, Any]) -> Company:
        """Save company data to database"""
        try:
            # Check if company already exists
            existing_company = self.db.query(Company).filter(
                Company.name == company_data.get("name")
            ).first()
            
            if existing_company:
                # Update existing company
                for key, value in company_data.items():
                    if hasattr(existing_company, key):
                        setattr(existing_company, key, value)
                existing_company.updated_at = datetime.now()
                company = existing_company
            else:
                # Create new company
                company = Company(
                    name=company_data.get("name", ""),
                    industry=company_data.get("industry", ""),
                    size=company_data.get("size", ""),
                    headquarters=company_data.get("headquarters", ""),
                    founded=company_data.get("founded"),
                    website=company_data.get("website", ""),
                    description=company_data.get("description", ""),
                    employee_count=company_data.get("employee_count", 0),
                    follower_count=company_data.get("follower_count", 0)
                )
                self.db.add(company)
            
            self.db.commit()
            self.db.refresh(company)
            
            # Save raw data
            self._save_scraped_data(session_id, "company", company_data, company.__dict__)
            
            return company
            
        except Exception as e:
            logger.error(f"Error saving company data: {e}")
            self.db.rollback()
            raise
    
    def save_posts_data(self, session_id: int, company_id: int, posts_data: List[Dict[str, Any]]):
        """Save company posts data"""
        try:
            for post_data in posts_data:
                # Check if post already exists
                existing_post = self.db.query(CompanyPost).filter(
                    CompanyPost.company_id == company_id,
                    CompanyPost.content == post_data.get("content", "")[:100]  # First 100 chars as identifier
                ).first()
                
                if not existing_post:
                    post = CompanyPost(
                        company_id=company_id,
                        content=post_data.get("content", ""),
                        date=datetime.fromisoformat(post_data.get("date", datetime.now().isoformat())),
                        engagement=post_data.get("engagement", 0),
                        type=post_data.get("type", "general"),
                        url=post_data.get("url", ""),
                        author=post_data.get("author", "")
                    )
                    self.db.add(post)
            
            self.db.commit()
            
            # Save raw data
            self._save_scraped_data(session_id, "posts", posts_data, [])
            
        except Exception as e:
            logger.error(f"Error saving posts data: {e}")
            self.db.rollback()
            raise
    
    def save_jobs_data(self, session_id: int, company_id: int, jobs_data: List[Dict[str, Any]]):
        """Save job postings data"""
        try:
            for job_data in jobs_data:
                # Check if job already exists
                existing_job = self.db.query(JobPosting).filter(
                    JobPosting.company_id == company_id,
                    JobPosting.title == job_data.get("title", "")
                ).first()
                
                if not existing_job:
                    job = JobPosting(
                        company_id=company_id,
                        title=job_data.get("title", ""),
                        location=job_data.get("location", ""),
                        department=job_data.get("department", ""),
                        date_posted=datetime.fromisoformat(job_data.get("date_posted", datetime.now().isoformat())),
                        requirements=job_data.get("requirements", []),
                        description=job_data.get("description", ""),
                        salary_range=job_data.get("salary_range", ""),
                        employment_type=job_data.get("employment_type", "full-time")
                    )
                    self.db.add(job)
            
            self.db.commit()
            
            # Save raw data
            self._save_scraped_data(session_id, "jobs", jobs_data, [])
            
        except Exception as e:
            logger.error(f"Error saving jobs data: {e}")
            self.db.rollback()
            raise
    
    def save_employees_data(self, session_id: int, company_id: int, employees_data: List[Dict[str, Any]]):
        """Save employees data"""
        try:
            for employee_data in employees_data:
                # Check if employee already exists
                existing_employee = self.db.query(Employee).filter(
                    Employee.company_id == company_id,
                    Employee.name == employee_data.get("name", "")
                ).first()
                
                if not existing_employee:
                    employee = Employee(
                        company_id=company_id,
                        name=employee_data.get("name", ""),
                        title=employee_data.get("title", ""),
                        department=employee_data.get("department", ""),
                        level=employee_data.get("level", "junior"),
                        location=employee_data.get("location", ""),
                        skills=employee_data.get("skills", []),
                        experience_years=employee_data.get("experience_years"),
                        education=employee_data.get("education", []),
                        profile_url=employee_data.get("profile_url", "")
                    )
                    self.db.add(employee)
            
            self.db.commit()
            
            # Save raw data
            self._save_scraped_data(session_id, "employees", employees_data, [])
            
        except Exception as e:
            logger.error(f"Error saving employees data: {e}")
            self.db.rollback()
            raise
    
    def _save_scraped_data(self, session_id: int, data_type: str, raw_data: Any, processed_data: Any):
        """Save raw and processed data"""
        scraped_data = ScrapedData(
            session_id=session_id,
            data_type=data_type,
            raw_data=raw_data,
            processed_data=processed_data
        )
        self.db.add(scraped_data)
        self.db.commit()
    
    def get_company_data(self, company_name: str) -> Optional[Dict[str, Any]]:
        """Get company data from database"""
        try:
            company = self.db.query(Company).filter(Company.name == company_name).first()
            if not company:
                return None
            
            # Get related data
            posts = self.db.query(CompanyPost).filter(CompanyPost.company_id == company.id).limit(10).all()
            jobs = self.db.query(JobPosting).filter(JobPosting.company_id == company.id).limit(20).all()
            employees = self.db.query(Employee).filter(Employee.company_id == company.id).limit(50).all()
            
            return {
                "company": {
                    "name": company.name,
                    "industry": company.industry,
                    "size": company.size,
                    "headquarters": company.headquarters,
                    "founded": company.founded,
                    "website": company.website,
                    "description": company.description,
                    "employee_count": company.employee_count,
                    "follower_count": company.follower_count
                },
                "recent_posts": [
                    {
                        "id": post.id,
                        "content": post.content,
                        "date": post.date.isoformat(),
                        "engagement": post.engagement,
                        "type": post.type
                    } for post in posts
                ],
                "job_postings": [
                    {
                        "id": job.id,
                        "title": job.title,
                        "location": job.location,
                        "department": job.department,
                        "date_posted": job.date_posted.isoformat(),
                        "requirements": job.requirements
                    } for job in jobs
                ],
                "employees": [
                    {
                        "id": emp.id,
                        "name": emp.name,
                        "title": emp.title,
                        "department": emp.department,
                        "level": emp.level,
                        "location": emp.location,
                        "skills": emp.skills
                    } for emp in employees
                ]
            }
            
        except Exception as e:
            logger.error(f"Error getting company data: {e}")
            return None
    
    def get_recent_sessions(self, limit: int = 10) -> List[ScrapingSession]:
        """Get recent scraping sessions"""
        return self.db.query(ScrapingSession).order_by(ScrapingSession.started_at.desc()).limit(limit).all()
    
    def get_session_data(self, session_id: int) -> Optional[Dict[str, Any]]:
        """Get data for a specific scraping session"""
        session = self.db.query(ScrapingSession).filter(ScrapingSession.id == session_id).first()
        if not session:
            return None
        
        scraped_data = self.db.query(ScrapedData).filter(ScrapedData.session_id == session_id).all()
        
        return {
            "session": {
                "id": session.id,
                "company_name": session.company_name,
                "status": session.status,
                "started_at": session.started_at.isoformat(),
                "completed_at": session.completed_at.isoformat() if session.completed_at else None,
                "error_message": session.error_message
            },
            "scraped_data": [
                {
                    "data_type": data.data_type,
                    "raw_data": data.raw_data,
                    "processed_data": data.processed_data,
                    "created_at": data.created_at.isoformat()
                } for data in scraped_data
            ]
        } 