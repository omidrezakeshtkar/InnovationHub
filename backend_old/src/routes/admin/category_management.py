from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...models import Category, User
from ...schemas import CategoryCreate, CategoryInDB
from ...database import get_db
from ...dependencies import get_current_user
from ...auth.rbac import admin_only

router = APIRouter()

@router.post("/", response_model=CategoryInDB)
async def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    new_category = Category(name=category.name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.get("/", response_model=list[CategoryInDB])
async def get_all_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    categories = db.query(Category).all()
    return categories

# Add more category management routes as needed