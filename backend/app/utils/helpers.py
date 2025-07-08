import re
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

def format_date(date_obj: datetime, format_str: str = "%Y-%m-%d") -> str:
    """Format datetime object to string"""
    if not date_obj:
        return ""
    return date_obj.strftime(format_str)

def clean_text(text: str) -> str:
    """Clean and normalize text content"""
    if not text:
        return ""
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s\.\,\!\?\-\(\)]', '', text)
    
    return text

def extract_skills(text: str) -> List[str]:
    """Extract technical skills from text using pattern matching"""
    if not text:
        return []
    
    # Common technical skills patterns
    skill_patterns = [
        r'\b(Python|Java|JavaScript|TypeScript|C\+\+|C#|Go|Rust|Swift|Kotlin)\b',
        r'\b(React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Laravel)\b',
        r'\b(AWS|Azure|GCP|Docker|Kubernetes|Jenkins|Git|GitHub|GitLab)\b',
        r'\b(SQL|MySQL|PostgreSQL|MongoDB|Redis|Elasticsearch|Kafka)\b',
        r'\b(Machine Learning|AI|Data Science|Deep Learning|NLP|Computer Vision)\b',
        r'\b(Agile|Scrum|DevOps|CI/CD|Microservices|REST|GraphQL|API)\b'
    ]
    
    skills = []
    text_upper = text.upper()
    
    for pattern in skill_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        skills.extend(matches)
    
    # Remove duplicates and return
    return list(set(skills))

def calculate_growth_rate(current: int, previous: int) -> float:
    """Calculate growth rate percentage"""
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    
    return ((current - previous) / previous) * 100

def parse_tenure(tenure_str: str) -> int:
    """Parse tenure string to months"""
    if not tenure_str:
        return 0
    
    tenure_str = tenure_str.lower()
    months = 0
    
    # Extract years
    year_match = re.search(r'(\d+)\s*year', tenure_str)
    if year_match:
        months += int(year_match.group(1)) * 12
    
    # Extract months
    month_match = re.search(r'(\d+)\s*month', tenure_str)
    if month_match:
        months += int(month_match.group(1))
    
    return months

def categorize_company_size(employee_count: int) -> str:
    """Categorize company size based on employee count"""
    if employee_count <= 10:
        return "Startup"
    elif employee_count <= 50:
        return "Small"
    elif employee_count <= 200:
        return "Medium"
    elif employee_count <= 1000:
        return "Large"
    else:
        return "Enterprise"

def extract_location_info(location_str: str) -> Dict[str, str]:
    """Extract structured location information"""
    if not location_str:
        return {"city": "", "state": "", "country": ""}
    
    parts = [part.strip() for part in location_str.split(",")]
    
    if len(parts) >= 2:
        return {
            "city": parts[0],
            "state": parts[1] if len(parts) == 2 else parts[1],
            "country": parts[2] if len(parts) > 2 else "US"
        }
    else:
        return {"city": parts[0], "state": "", "country": ""}

def detect_hiring_keywords(text: str) -> List[str]:
    """Detect hiring-related keywords in text"""
    hiring_keywords = [
        "hiring", "recruiting", "job opening", "career opportunity",
        "join our team", "we're looking for", "now hiring",
        "apply now", "job posting", "open position"
    ]
    
    found_keywords = []
    text_lower = text.lower()
    
    for keyword in hiring_keywords:
        if keyword in text_lower:
            found_keywords.append(keyword)
    
    return found_keywords

def calculate_engagement_score(likes: int, comments: int, shares: int) -> int:
    """Calculate engagement score based on social media metrics"""
    # Weighted scoring: likes=1, comments=2, shares=3
    return likes + (comments * 2) + (shares * 3)

def validate_company_name(name: str) -> bool:
    """Validate company name format"""
    if not name or len(name.strip()) < 2:
        return False
    
    # Check for valid characters
    if not re.match(r'^[a-zA-Z0-9\s\.\-&,]+$', name):
        return False
    
    return True

def generate_search_variations(company_name: str) -> List[str]:
    """Generate search variations for company name"""
    variations = [company_name]
    
    # Add common variations
    if "Inc" not in company_name and "LLC" not in company_name:
        variations.extend([
            f"{company_name} Inc",
            f"{company_name} LLC",
            f"{company_name} Corp"
        ])
    
    # Add abbreviated version
    words = company_name.split()
    if len(words) > 1:
        abbreviated = "".join(word[0].upper() for word in words)
        variations.append(abbreviated)
    
    return variations

def format_currency(amount: float, currency: str = "USD") -> str:
    """Format currency amount"""
    if currency == "USD":
        return f"${amount:,.2f}"
    else:
        return f"{amount:,.2f} {currency}"

def time_ago(date_obj: datetime) -> str:
    """Get human-readable time ago string"""
    if not date_obj:
        return "Unknown"
    
    now = datetime.now()
    diff = now - date_obj
    
    if diff.days > 365:
        years = diff.days // 365
        return f"{years} year{'s' if years > 1 else ''} ago"
    elif diff.days > 30:
        months = diff.days // 30
        return f"{months} month{'s' if months > 1 else ''} ago"
    elif diff.days > 0:
        return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
    elif diff.seconds > 3600:
        hours = diff.seconds // 3600
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    else:
        minutes = diff.seconds // 60
        return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
