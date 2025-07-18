from fastapi import APIRouter
from app.api.endpoints import companies, employees, insights

router = APIRouter()

router.include_router(companies.router, prefix="/companies", tags=["companies"])
router.include_router(employees.router, prefix="/employees", tags=["employees"])
router.include_router(insights.router, prefix="/insights", tags=["insights"])

# Add competitor routes to companies
router.include_router(companies.router, prefix="/competitors", tags=["competitors"])

# Add export routes 
router.include_router(insights.router, prefix="/export", tags=["export"])
