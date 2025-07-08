from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class EmployeeLevel(str, Enum):
    ENTRY = "entry"
    JUNIOR = "junior"
    SENIOR = "senior"
    LEAD = "lead"
    MANAGER = "manager"
    DIRECTOR = "director"
    VP = "vp"
    C_LEVEL = "c_level"

class EmployeeActivity(BaseModel):
    type: str  # post, comment, share, job_change
    content: Optional[str] = None
    date: datetime
    engagement: int = 0

class Employee(BaseModel):
    id: str
    name: str
    title: str
    department: str
    level: EmployeeLevel
    tenure: Optional[str] = None
    location: Optional[str] = None
    skills: List[str] = []
    education: List[str] = []
    previous_companies: List[str] = []
    
class EmployeeProfile(BaseModel):
    employee: Employee
    recent_activities: List[EmployeeActivity] = []
    connections: Optional[int] = None
    profile_views: Optional[int] = None
    last_updated: datetime = Field(default_factory=datetime.now)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
