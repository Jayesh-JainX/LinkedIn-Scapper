from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import logging

from app.services.linkedin_scraper import LinkedInScraper
from app.models.employee import EmployeeLevel

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/{company_name}")
async def get_company_employees(
    company_name: str,
    department: Optional[str] = None,
    level: Optional[EmployeeLevel] = None,
    limit: int = Query(50, le=200)
):
    """Get employee profiles for a company"""
    try:
        logger.info(f"Fetching employees for {company_name}")
        
        scraper = LinkedInScraper()
        data = await scraper.scrape_company_data(company_name)
        employees = data.get("employees", [])
        
        # Apply filters
        if department:
            employees = [emp for emp in employees if emp.employee.department.lower() == department.lower()]
        
        if level:
            employees = [emp for emp in employees if emp.employee.level == level]
        
        # Apply limit
        employees = employees[:limit]
        
        return [emp.dict() for emp in employees]
        
    except Exception as e:
        logger.error(f"Error fetching employees for {company_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch employees: {str(e)}")

@router.get("/{company_name}/departments")
async def get_company_departments(company_name: str):
    """Get list of departments in the company"""
    try:
        scraper = LinkedInScraper()
        data = await scraper.scrape_company_data(company_name)
        employees = data.get("employees", [])
        
        departments = list(set(emp.employee.department for emp in employees))
        department_counts = {}
        
        for dept in departments:
            department_counts[dept] = len([emp for emp in employees if emp.employee.department == dept])
        
        return {
            "departments": departments,
            "department_counts": department_counts
        }
        
    except Exception as e:
        logger.error(f"Error fetching departments for {company_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch departments: {str(e)}")

@router.get("/{company_name}/skills")
async def get_company_skills(company_name: str, top_n: int = 20):
    """Get most common skills across company employees"""
    try:
        scraper = LinkedInScraper()
        data = await scraper.scrape_company_data(company_name)
        employees = data.get("employees", [])
        
        all_skills = []
        for emp in employees:
            all_skills.extend(emp.employee.skills)
        
        from collections import Counter
        skill_counts = Counter(all_skills)
        
        return {
            "top_skills": dict(skill_counts.most_common(top_n)),
            "total_unique_skills": len(skill_counts),
            "total_employees_analyzed": len(employees)
        }
        
    except Exception as e:
        logger.error(f"Error fetching skills for {company_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch skills: {str(e)}")
