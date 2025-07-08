from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class IndustryType(str, Enum):
    TECHNOLOGY = "technology"
    FINANCE = "finance"
    HEALTHCARE = "healthcare"
    EDUCATION = "education"
    RETAIL = "retail"
    MANUFACTURING = "manufacturing"
    OTHER = "other"

class CompanySize(str, Enum):
    STARTUP = "1-10"
    SMALL = "11-50"
    MEDIUM = "51-200"
    LARGE = "201-1000"
    ENTERPRISE = "1001-5000"
    CORPORATION = "5000+"

class PostType(str, Enum):
    HIRING = "hiring"
    EXPANSION = "expansion"
    MILESTONE = "milestone"
    GENERAL = "general"

class CompanyPost(BaseModel):
    id: str
    content: str
    date: datetime
    engagement: int = 0
    type: PostType
    url: Optional[str] = None
    author: Optional[str] = None

class JobPosting(BaseModel):
    id: str
    title: str
    location: str
    department: str
    date_posted: datetime
    requirements: List[str] = []
    description: Optional[str] = None
    salary_range: Optional[str] = None
    employment_type: Optional[str] = None

class Company(BaseModel):
    name: str
    industry: IndustryType
    size: CompanySize
    headquarters: str
    founded: Optional[int] = None
    website: Optional[str] = None
    description: Optional[str] = None
    employee_count: Optional[int] = None
    follower_count: Optional[int] = None
    
class CompanyAnalysis(BaseModel):
    company: Company
    recent_posts: List[CompanyPost] = []
    job_postings: List[JobPosting] = []
    key_metrics: Dict[str, Any] = {}
    analysis_date: datetime = Field(default_factory=datetime.now)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
