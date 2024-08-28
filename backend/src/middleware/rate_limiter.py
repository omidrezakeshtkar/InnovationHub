from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from ..database import SessionLocal
from ..models import FeatureFlag
from sqlalchemy.exc import OperationalError

limiter = Limiter(key_func=get_remote_address)

def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> Response:
    return JSONResponse(
        status_code=429,
        content={
            "error": "Rate limit exceeded",
            "detail": f"Too many requests. Please try again in {exc.retry_after} seconds."
        }
    )

def is_rate_limiting_enabled():
    db = SessionLocal()
    try:
        feature_flag = db.query(FeatureFlag).filter(FeatureFlag.name == "rate_limiting").first()
        return feature_flag.is_enabled if feature_flag else False
    except OperationalError:
        # Table doesn't exist, which means we're probably setting up the database
        return False
    finally:
        db.close()

def rate_limit_if_enabled():
    def decorator(func):
        if is_rate_limiting_enabled():
            return limiter.limit("5/minute")(func)
        return func
    return decorator