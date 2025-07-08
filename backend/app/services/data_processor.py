import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging
from collections import Counter

from app.models.company import CompanyAnalysis, CompanyPost, JobPosting
from app.models.employee import EmployeeProfile
from app.models.insights import HiringTrend, LeadershipChange, BranchExpansion, TrendDirection, ChangeType

logger = logging.getLogger(__name__)

class DataProcessor:
    """
    Process and analyze scraped LinkedIn data
    """
    
    def __init__(self):
        pass
    
    async def process_company_data(self, raw_data: Dict[str, Any]) -> CompanyAnalysis:
        """Process raw company data into structured analysis"""
        logger.info(f"Processing data for company: {raw_data['company'].name}")
        
        # Calculate key metrics
        key_metrics = await self._calculate_key_metrics(raw_data)
        
        analysis = CompanyAnalysis(
            company=raw_data['company'],
            recent_posts=raw_data['recent_posts'],
            job_postings=raw_data['job_postings'],
            key_metrics=key_metrics
        )
        
        return analysis
    
    async def _calculate_key_metrics(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate key business metrics from raw data"""
        metrics = {}
        
        # Employee metrics
        employees = raw_data.get('employees', [])
        metrics['total_employees'] = len(employees)
        metrics['recent_hires'] = await self._count_recent_hires(employees)
        
        # Job posting metrics
        job_postings = raw_data.get('job_postings', [])
        metrics['job_openings'] = len(job_postings)
        metrics['departments_hiring'] = len(set(job.department for job in job_postings))
        
        # Post engagement metrics
        posts = raw_data.get('recent_posts', [])
        if posts:
            metrics['avg_post_engagement'] = sum(post.engagement for post in posts) // len(posts)
        else:
            metrics['avg_post_engagement'] = 0
            
        # Hiring by department
        metrics['hiring_by_department'] = await self._analyze_hiring_by_department(job_postings)
        
        return metrics
    
    async def _count_recent_hires(self, employees: List[EmployeeProfile]) -> int:
        """Count employees hired in the last 30 days"""
        # Mock implementation - in real scenario, would check hire dates
        return len([emp for emp in employees if 'months' in emp.employee.tenure or '1 year' in emp.employee.tenure])
    
    async def _analyze_hiring_by_department(self, job_postings: List[JobPosting]) -> Dict[str, int]:
        """Analyze hiring activity by department"""
        department_counts = Counter(job.department for job in job_postings)
        return dict(department_counts)
    
    async def analyze_hiring_trends(self, job_postings: List[JobPosting], 
                                  historical_data: Optional[Dict] = None) -> List[HiringTrend]:
        """Analyze hiring trends by department"""
        logger.info("Analyzing hiring trends")
        
        department_counts = Counter(job.department for job in job_postings)
        trends = []
        
        for department, count in department_counts.items():
            # Mock trend calculation - in real implementation, compare with historical data
            trend_direction = TrendDirection.UP if count > 3 else TrendDirection.STABLE
            
            # Extract key roles for this department
            key_roles = list(set(job.title for job in job_postings if job.department == department))[:3]
            
            trend = HiringTrend(
                department=department,
                count=count,
                trend=trend_direction,
                key_roles=key_roles,
                growth_rate=15.0 if trend_direction == TrendDirection.UP else 0.0
            )
            trends.append(trend)
        
        return trends
    
    async def analyze_leadership_changes(self, employees: List[EmployeeProfile]) -> List[LeadershipChange]:
        """Analyze leadership and senior role changes"""
        logger.info("Analyzing leadership changes")
        
        changes = []
        senior_levels = ['manager', 'director', 'vp', 'c_level']
        
        # Mock leadership changes - in real implementation, would track role changes over time
        senior_employees = [emp for emp in employees if emp.employee.level.value in senior_levels]
        
        for i, emp in enumerate(senior_employees[:3]):  # Mock recent changes
            change = LeadershipChange(
                name=emp.employee.name,
                previous_role="Senior Manager" if i == 0 else None,
                new_role=emp.employee.title,
                date=datetime.now() - timedelta(days=i*10 + 5),
                type=ChangeType.PROMOTION if i == 0 else ChangeType.HIRE,
                department=emp.employee.department
            )
            changes.append(change)
        
        return changes
    
    async def detect_branch_expansions(self, posts: List[CompanyPost], 
                                     job_postings: List[JobPosting]) -> List[BranchExpansion]:
        """Detect branch expansions from posts and job locations"""
        logger.info("Detecting branch expansions")
        
        expansions = []
        
        # Analyze posts for expansion keywords
        expansion_keywords = ['opening', 'new office', 'expansion', 'branch', 'location']
        expansion_posts = [
            post for post in posts 
            if any(keyword in post.content.lower() for keyword in expansion_keywords)
        ]
        
        # Mock expansion detection
        if expansion_posts:
            expansion = BranchExpansion(
                location="Austin, TX",
                date=expansion_posts[0].date,
                type="office",
                details="New engineering hub focusing on cloud infrastructure",
                employee_count=50
            )
            expansions.append(expansion)
        
        return expansions
    
    async def analyze_skill_demands(self, job_postings: List[JobPosting]) -> Dict[str, int]:
        """Analyze in-demand skills from job requirements"""
        logger.info("Analyzing skill demands")
        
        all_skills = []
        for job in job_postings:
            all_skills.extend(job.requirements)
        
        skill_counts = Counter(all_skills)
        return dict(skill_counts.most_common(10))
    
    async def calculate_engagement_metrics(self, posts: List[CompanyPost]) -> Dict[str, Any]:
        """Calculate social media engagement metrics"""
        if not posts:
            return {}
        
        total_engagement = sum(post.engagement for post in posts)
        avg_engagement = total_engagement / len(posts)
        
        engagement_by_type = {}
        for post in posts:
            if post.type.value not in engagement_by_type:
                engagement_by_type[post.type.value] = []
            engagement_by_type[post.type.value].append(post.engagement)
        
        # Calculate average engagement by post type
        avg_by_type = {
            post_type: sum(engagements) / len(engagements)
            for post_type, engagements in engagement_by_type.items()
        }
        
        return {
            'total_engagement': total_engagement,
            'average_engagement': avg_engagement,
            'engagement_by_type': avg_by_type,
            'most_engaging_type': max(avg_by_type.items(), key=lambda x: x[1])[0] if avg_by_type else None
        }
