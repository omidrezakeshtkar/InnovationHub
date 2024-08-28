from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...models import Department, User
from ...schemas import DepartmentCreate, DepartmentInDB
from ...database import get_db
from ...dependencies import get_current_user
from ...auth.rbac import admin_only

router = APIRouter()

@router.post("/", response_model=DepartmentInDB)
async def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    new_department = Department(name=department.name)
    db.add(new_department)
    db.commit()
    db.refresh(new_department)
    return new_department

@router.get("/", response_model=list[DepartmentInDB])
async def get_all_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    departments = db.query(Department).all()
    return departments

# Add more department management routes as needed