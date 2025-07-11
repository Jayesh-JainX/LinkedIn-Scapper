from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel
from typing import List, Optional
import logging
from datetime import datetime

from app.models.company import CompanyAnalysis
from app.services.linkedin_scraper import LinkedInScraper
from app.services.data_processor import DataProcessor
from app.services.insight_generator import InsightGenerator
from app.repositories.data_repository import DataRepository
from app.database import get_db

router = APIRouter()
logger = logging.getLogger(__name__)

class CompanyAnalysisRequest(BaseModel):
    company_name: str
    competitors: Optional[List[str]] = []
    include_employees: bool = True
    include_posts: bool = True
    include_jobs: bool = True
    max_employees: int = 100
    days_back: int = 30

class CompanyAnalysisResponse(BaseModel):
    name: str
    industry: str
    size: str
    headquarters: str
    recentPosts: List[dict]
    jobPostings: List[dict]
    employees: List[dict]
    status: str = "completed"

@router.post("/analyze", response_model=CompanyAnalysisResponse)
async def analyze_company(request: CompanyAnalysisRequest, background_tasks: BackgroundTasks, db=Depends(get_db)):
    """Analyze a company's LinkedIn presence and generate insights"""
    if not request.company_name.strip():
        raise HTTPException(status_code=400, detail="Company name is required")

    try:
        logger.info(f"Starting analysis for company: {request.company_name}")
        
        # Initialize services
        scraper = LinkedInScraper()
        processor = DataProcessor()
        repository = DataRepository()
        
        # Create scraping session
        session = repository.create_scraping_session(request.company_name)
        
        try:
            # Check if we have recent data in database
            cached_data = repository.get_company_data(request.company_name)
            if cached_data:
                logger.info(f"Using cached data for {request.company_name}")
                repository.update_session_status(session.id, "completed")
                return CompanyAnalysisResponse(
                    name=cached_data["company"]["name"],
                    industry=cached_data["company"]["industry"],
                    size=cached_data["company"]["size"],
                    headquarters=cached_data["company"]["headquarters"],
                    recentPosts=cached_data["recent_posts"],
                    jobPostings=cached_data["job_postings"],
                    employees=cached_data["employees"]
                )
            
            # Update session status to running
            repository.update_session_status(session.id, "running")
            
            # Scrape company data
            raw_data = await scraper.scrape_company_data(request.company_name)
            
            # Save data to database
            company = repository.save_company_data(session.id, raw_data["company"])
            repository.save_posts_data(session.id, company.id, raw_data["recent_posts"])
            repository.save_jobs_data(session.id, company.id, raw_data["job_postings"])
            repository.save_employees_data(session.id, company.id, raw_data["employees"])
            
            # Update session status to completed
            repository.update_session_status(session.id, "completed")
            
        except Exception as e:
            logger.error(f"Failed to scrape data: {str(e)}")
            repository.update_session_status(session.id, "failed", str(e))
            raise HTTPException(status_code=500, detail=f"Failed to collect company data: {str(e)}")
        
        try:
            # Process the data
            analysis = await processor.process_company_data(raw_data)
        except Exception as e:
            logger.error(f"Failed to process data: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to process company data: {str(e)}")
        
        # Format response to match frontend interface
        try:
            response = CompanyAnalysisResponse(
                name=analysis.company.name,
                industry=analysis.company.industry,
                size=analysis.company.size,
                headquarters=analysis.company.headquarters,
                recentPosts=[{
                    "id": post.id,
                    "content": post.content,
                    "date": post.date.isoformat(),
                    "engagement": post.engagement,
                    "type": post.type.value
                } for post in analysis.recent_posts],
                jobPostings=[{
                    "id": job.id,
                    "title": job.title,
                    "location": job.location,
                    "department": job.department,
                    "datePosted": job.date_posted.isoformat(),
                    "requirements": job.requirements
                } for job in analysis.job_postings],
                employees=raw_data.get('employees', [])
            )
        except Exception as e:
            logger.error(f"Failed to format response: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to format analysis response: {str(e)}")
        
        logger.info(f"Analysis completed for {request.company_name}")
        return response
        
    except Exception as e:
        logger.error(f"Error analyzing company {request.company_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/{company_name}/basic-info")
async def get_company_basic_info(company_name: str):
    """Get basic company information"""
    try:
        scraper = LinkedInScraper()
        data = await scraper.scrape_company_data(company_name)
        
        return {
            "name": data["company"].name,
            "industry": data["company"].industry,
            "size": data["company"].size,
            "headquarters": data["company"].headquarters,
            "employee_count": data["company"].employee_count,
            "follower_count": data["company"].follower_count
        }
    except Exception as e:
        logger.error(f"Error fetching basic info for {company_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch company info: {str(e)}")

@router.get("/{company_name}/posts")
async def get_company_posts(company_name: str, limit: int = 10):
    """Get recent company posts"""
    try:
        scraper = LinkedInScraper()
        data = await scraper.scrape_company_data(company_name)
        
        posts = data["recent_posts"][:limit]
        return [{
            "id": post.id,
            "content": post.content,
            "date": post.date.isoformat(),
            "engagement": post.engagement,
            "type": post.type.value
        } for post in posts]
        
    except Exception as e:
        logger.error(f"Error fetching posts for {company_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch posts: {str(e)}")

@router.get("/{company_name}/jobs")
async def get_company_jobs(company_name: str, department: Optional[str] = None):
    """Get current job postings"""
    try:
        scraper = LinkedInScraper()
        data = await scraper.scrape_company_data(company_name)
        
        jobs = data["job_postings"]
        if department:
            jobs = [job for job in jobs if job.department.lower() == department.lower()]
            
        return [{
            "id": job.id,
            "title": job.title,
            "location": job.location,
            "department": job.department,
            "datePosted": job.date_posted.isoformat(),
            "requirements": job.requirements
        } for job in jobs]
        
    except Exception as e:
        logger.error(f"Error fetching jobs for {company_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch jobs: {str(e)}")

class CompetitorComparisonRequest(BaseModel):
    companies: List[str]

@router.post("/compare")
async def compare_competitors(request: CompetitorComparisonRequest):
    """Compare multiple companies across key metrics"""
    try:
        logger.info(f"Comparing {len(request.companies)} companies")
        
        insight_generator = InsightGenerator()
        
        # Get competitor data
        competitor_data = await insight_generator._analyze_competitors(request.companies)
        
        # Format for frontend
        comparison_data = []
        for comp in competitor_data:
            comparison_data.append({
                "name": comp.name,
                "hiringActivity": comp.hiring_activity,
                "leadershipChanges": comp.leadership_changes,
                "marketActivity": comp.market_activity
            })
        
        return comparison_data
        
    except Exception as e:
        logger.error(f"Error comparing competitors: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to compare competitors: {str(e)}")

@router.get("/{company_name}/export")
async def export_company_data(company_name: str, format: str = "json"):
    """Export company data in specified format"""
    try:
        if format not in ["json", "csv", "pdf"]:
            raise HTTPException(status_code=400, detail="Unsupported format. Use json, csv, or pdf.")
        
        scraper = LinkedInScraper()
        data = await scraper.scrape_company_data(company_name)
        
        if format == "json":
            return {
                "company": {
                    "name": data["company"].name,
                    "industry": data["company"].industry,
                    "size": data["company"].size,
                    "headquarters": data["company"].headquarters
                },
                "posts_count": len(data["recent_posts"]),
                "jobs_count": len(data["job_postings"]),
                "employees_count": len(data["employees"]),
                "export_date": datetime.now().isoformat()
            }
        else:
            # For CSV and PDF, return a message indicating the feature would be implemented
            return {
                "message": f"{format.upper()} export functionality would be implemented here",
                "data_summary": {
                    "company": data["company"].name,
                    "posts": len(data["recent_posts"]),
                    "jobs": len(data["job_postings"]),
                    "employees": len(data["employees"])
                }
            }
        
    except Exception as e:
        logger.error(f"Error exporting data for {company_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to export data: {str(e)}")
