from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class PostType(enum.Enum):
    HIRING = "hiring"
    EXPANSION = "expansion"
    MILESTONE = "milestone"
    GENERAL = "general"

class EmployeeLevel(enum.Enum):
    ENTRY = "entry"
    JUNIOR = "junior"
    SENIOR = "senior"
    LEAD = "lead"
    MANAGER = "manager"
    DIRECTOR = "director"
    VP = "vp"
    C_LEVEL = "c_level"

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    linkedin_id = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    industry = Column(String)
    size = Column(String)
    headquarters = Column(String)
    founded = Column(Integer)
    website = Column(String)
    description = Column(Text)
    employee_count = Column(Integer)
    follower_count = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    posts = relationship("CompanyPost", back_populates="company")
    job_postings = relationship("JobPosting", back_populates="company")
    employees = relationship("Employee", back_populates="company")

class CompanyPost(Base):
    __tablename__ = "company_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    linkedin_post_id = Column(String, unique=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    content = Column(Text, nullable=False)
    date = Column(DateTime, nullable=False)
    engagement = Column(Integer, default=0)
    type = Column(String, default=PostType.GENERAL.value)
    url = Column(String)
    author = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    company = relationship("Company", back_populates="posts")

class JobPosting(Base):
    __tablename__ = "job_postings"
    
    id = Column(Integer, primary_key=True, index=True)
    linkedin_job_id = Column(String, unique=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    title = Column(String, nullable=False)
    location = Column(String)
    department = Column(String)
    date_posted = Column(DateTime, nullable=False)
    requirements = Column(JSON)  # Store as JSON array
    description = Column(Text)
    salary_range = Column(String)
    employment_type = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    company = relationship("Company", back_populates="job_postings")

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    linkedin_profile_id = Column(String, unique=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    name = Column(String, nullable=False)
    title = Column(String)
    department = Column(String)
    level = Column(String, default=EmployeeLevel.JUNIOR.value)
    location = Column(String)
    skills = Column(JSON)  # Store as JSON array
    experience_years = Column(Integer)
    education = Column(JSON)  # Store as JSON array
    profile_url = Column(String)
    is_current = Column(Boolean, default=True)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    company = relationship("Company", back_populates="employees")

class ScrapingSession(Base):
    __tablename__ = "scraping_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    status = Column(String, default="pending")  # pending, running, completed, failed
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    error_message = Column(Text)
    data_summary = Column(JSON)  # Store summary of scraped data
    
    # Relationships
    scraped_data = relationship("ScrapedData", back_populates="session")

class ScrapedData(Base):
    __tablename__ = "scraped_data"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("scraping_sessions.id"))
    data_type = Column(String, nullable=False)  # company, posts, jobs, employees
    raw_data = Column(JSON)
    processed_data = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    session = relationship("ScrapingSession", back_populates="scraped_data") 