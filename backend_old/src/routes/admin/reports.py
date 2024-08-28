from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...models import Report, User
from ...schemas import ReportInDB
from ...database import get_db
from ...dependencies import get_current_user
from ...auth.rbac import admin_only

router = APIRouter()

@router.get("/", response_model=list[ReportInDB])
async def get_all_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    reports = db.query(Report).all()
    return reports

@router.put("/{report_id}/resolve")
async def resolve_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.is_resolved = True
    db.commit()
    db.refresh(report)
    return {"message": "Report resolved successfully"}

# Add more report management routes as needed