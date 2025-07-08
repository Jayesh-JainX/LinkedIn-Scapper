from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class TrendDirection(str, Enum):
    UP = "up"
    DOWN = "down"
    STABLE = "stable"

class ChangeType(str, Enum):
    HIRE = "hire"
    PROMOTION = "promotion"
    DEPARTURE = "departure"

class ExpansionType(str, Enum):
    OFFICE = "office"
    BRANCH = "branch"
    FACILITY = "facility"

class HiringTrend(BaseModel):
    department: str
    count: int
    trend: TrendDirection
    key_roles: List[str] = []
    growth_rate: Optional[float] = None
    
class LeadershipChange(BaseModel):
    name: str
    previous_role: Optional[str] = None
    new_role: str
    date: datetime
    type: ChangeType
    department: Optional[str] = None
    
class BranchExpansion(BaseModel):
    location: str
    date: datetime
    type: ExpansionType
    details: str
    employee_count: Optional[int] = None
    
class SkillTrend(BaseModel):
    skill: str
    demand: int  # percentage
    growth: int  # percentage growth
    related_roles: List[str] = []
    
class CompetitorData(BaseModel):
    name: str
    hiring_activity: int
    leadership_changes: int
    market_activity: int
    employee_count: Optional[int] = None
    recent_expansions: int = 0
    social_engagement: int = 0
    key_strengths: List[str] = []
    recent_milestones: List[str] = []

class Insight(BaseModel):
    company_name: str
    hiring_trends: List[HiringTrend] = []
    leadership_changes: List[LeadershipChange] = []
    branch_expansions: List[BranchExpansion] = []
    skills_trends: List[SkillTrend] = []
    competitor_comparison: List[CompetitorData] = []
    generated_at: datetime = Field(default_factory=datetime.now)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
