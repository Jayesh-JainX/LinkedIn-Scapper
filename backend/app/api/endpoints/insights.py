from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
import logging

from app.models.insights import Insight
from app.services.linkedin_scraper import LinkedInScraper
from app.services.data_processor import DataProcessor
from app.services.insight_generator import InsightGenerator

router = APIRouter()
logger = logging.getLogger(__name__)

class InsightRequest(BaseModel):
    company_name: str
    competitors: Optional[List[str]] = []
    analysis_type: str = "comprehensive"  # comprehensive, hiring, leadership, market

class CompetitorComparisonRequest(BaseModel):
    companies: List[str]
    metrics: Optional[List[str]] = ["hiring_activity", "leadership_changes", "market_activity"]

@router.get("/{company_name}")
async def get_company_insights(company_name: str, competitors: Optional[str] = None):
    """Get comprehensive insights for a company"""
    if not company_name.strip():
        raise HTTPException(status_code=400, detail="Company name is required")

    try:
        logger.info(f"Generating insights for {company_name}")
        
        # Parse competitors if provided
        competitor_list = []
        if competitors:
            competitor_list = [c.strip() for c in competitors.split(",") if c.strip()]
            if len(competitor_list) > 5:  # Limit number of competitors
                raise HTTPException(
                    status_code=400,
                    detail="Maximum 5 competitors allowed for comparison"
                )
        
        # Initialize services
        scraper = LinkedInScraper()
        processor = DataProcessor()
        insight_generator = InsightGenerator()
        
        try:
            # Get company data
            raw_data = await scraper.scrape_company_data(company_name)
        except Exception as e:
            logger.error(f"Failed to scrape company data: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to collect company data: {str(e)}")

        try:
            # Process the data
            analysis = await processor.process_company_data(raw_data)
        except Exception as e:
            logger.error(f"Failed to process company data: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to process company data: {str(e)}")
        
        try:
            # Generate insights
            insights = await insight_generator.generate_comprehensive_insights(
                analysis, competitor_list
            )
            return insights.dict()
        except Exception as e:
            logger.error(f"Failed to generate insights: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")
        
    except Exception as e:
        logger.error(f"Error generating insights for {company_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")

@router.post("/generate")
async def generate_insights(request: InsightRequest, background_tasks: BackgroundTasks):
    """Generate custom insights based on request parameters"""
    try:
        logger.info(f"Generating {request.analysis_type} insights for {request.company_name}")
        
        # Initialize services
        scraper = LinkedInScraper()
        processor = DataProcessor()
        insight_generator = InsightGenerator()
        
        # Get company data
        raw_data = await scraper.scrape_company_data(request.company_name)
        analysis = await processor.process_company_data(raw_data)
        
        if request.analysis_type == "comprehensive":
            insights = await insight_generator.generate_comprehensive_insights(
                analysis, request.competitors
            )
        elif request.analysis_type == "hiring":
            hiring_trends = await processor.analyze_hiring_trends(analysis.job_postings)
            insights = Insight(
                company_name=request.company_name,
                hiring_trends=hiring_trends
            )
        elif request.analysis_type == "market":
            market_intel = await insight_generator.generate_market_intelligence(
                request.company_name, analysis.company.industry.value
            )
            insights = {
                "company_name": request.company_name,
                "market_intelligence": market_intel
            }
        else:
            insights = await insight_generator.generate_comprehensive_insights(
                analysis, request.competitors
            )
        
        return insights.dict() if hasattr(insights, 'dict') else insights
        
    except Exception as e:
        logger.error(f"Error generating insights: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")

@router.post("/competitors/compare")
async def compare_competitors(request: CompetitorComparisonRequest):
    """Compare multiple companies across key metrics"""
    try:
        logger.info(f"Comparing {len(request.companies)} companies")
        
        scraper = LinkedInScraper()
        insight_generator = InsightGenerator()
        
        # Get competitor data
        competitor_data = await insight_generator._analyze_competitors(request.companies)
        
        # Format comparison data
        comparison = {
            "companies": request.companies,
            "metrics": request.metrics,
            "data": [comp.dict() for comp in competitor_data],
            "summary": {
                "highest_hiring_activity": max(competitor_data, key=lambda x: x.hiring_activity).name,
                "most_leadership_changes": max(competitor_data, key=lambda x: x.leadership_changes).name,
                "highest_market_activity": max(competitor_data, key=lambda x: x.market_activity).name
            }
        }
        
        return comparison
        
    except Exception as e:
        logger.error(f"Error comparing competitors: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to compare competitors: {str(e)}")

@router.get("/{company_name}/hiring-predictions")
async def get_hiring_predictions(company_name: str):
    """Get hiring predictions for a company"""
    try:
        logger.info(f"Generating hiring predictions for {company_name}")
        
        scraper = LinkedInScraper()
        processor = DataProcessor()
        insight_generator = InsightGenerator()
        
        # Get company data
        raw_data = await scraper.scrape_company_data(company_name)
        analysis = await processor.process_company_data(raw_data)
        
        # Generate predictions
        predictions = await insight_generator.predict_hiring_needs(analysis)
        
        return predictions
        
    except Exception as e:
        logger.error(f"Error generating hiring predictions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate predictions: {str(e)}")

@router.get("/{company_name}/export")
async def export_insights(company_name: str, format: str = "json"):
    """Export insights in different formats"""
    try:
        if format not in ["json", "csv", "pdf"]:
            raise HTTPException(status_code=400, detail="Unsupported format")
        
        # Get insights
        scraper = LinkedInScraper()
        processor = DataProcessor()
        insight_generator = InsightGenerator()
        
        raw_data = await scraper.scrape_company_data(company_name)
        analysis = await processor.process_company_data(raw_data)
        insights = await insight_generator.generate_comprehensive_insights(analysis)
        
        if format == "json":
            return insights.dict()
        elif format == "csv":
            # Mock CSV export
            return {"message": "CSV export functionality would be implemented here"}
        elif format == "pdf":
            # Mock PDF export
            return {"message": "PDF export functionality would be implemented here"}
            
    except Exception as e:
        logger.error(f"Error exporting insights: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to export insights: {str(e)}")
