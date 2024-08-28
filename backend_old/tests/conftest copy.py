import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.src.database.base import Base
from backend.src.main import app
from backend.src.database.database import get_db
from backend.src.models import User, UserRole, Idea, FeatureFlag
from backend.src.dependencies.auth import create_access_token
from backend.src.database.create_database import create_database
import os

# Use the test database URL from environment variables
SQLALCHEMY_DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./test.db')

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@pytest.fixture(scope="session", autouse=True)
def create_test_database():
    create_database()
    yield
    # Optionally, you can add cleanup code here

@pytest.fixture(scope="function")
def db():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    # Create a test FeatureFlag
    feature_flag = FeatureFlag(name="rate_limiting", is_enabled=False)
    session.add(feature_flag)
    session.commit()

    yield session

    session.close()
    transaction.rollback()
    connection.close()

    # Clear all tables after each test
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    del app.dependency_overrides[get_db]

@pytest.fixture(scope="function")
def test_user(db):
    user = User(
        username="testuser",
        email="testuser@example.com",
        password="testpassword",
        role=UserRole.USER,
        is_approved=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture(scope="function")
def token_header(test_user, db):
    access_token = create_access_token(data={"sub": test_user.username})
    logger.debug(f"Created access token for test user: {access_token}")
    logger.debug(f"Test user in database: {db.query(User).filter(User.username == test_user.username).first()}")
    return {"Authorization": f"Bearer {access_token}"}

@pytest.fixture(scope="function")
def admin_token_header(test_admin):
    access_token = create_access_token(data={"sub": test_admin.username})
    return {"Authorization": f"Bearer {access_token}"}