import os
from fastapi import FastAPI, Request, Depends
from .routes.idea import router as idea_router
from .routes.user import router as user_router
from .routes.comment import router as comment_router
from .routes.admin import router as admin_router
from .database import engine, Base
from .dependencies import get_current_active_user
from dotenv import load_dotenv
from .middleware.rate_limiter import limiter, rate_limit_exceeded_handler, rate_limit_if_enabled
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(debug=True)  # Set debug to True for development

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.include_router(idea_router, prefix="/ideas", tags=["ideas"])
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(comment_router, prefix="/comments", tags=["comments"])
app.include_router(admin_router, prefix="/admin", tags=["admin"])

@app.get("/")
@rate_limit_if_enabled()
async def read_root(request: Request):
    return {"message": "Welcome to the Idea Exchange API"}

@app.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_active_user)):
    return {"message": "This is a protected route", "user": current_user}