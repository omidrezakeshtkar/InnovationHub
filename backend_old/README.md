# IdeasExchange Backend Documentation

## Overview

The backend of the IdeasExchange project is a RESTful API built with FastAPI. It handles user authentication, idea management, and various other features related to the platform.

## Tech Stack

- FastAPI
- SQLAlchemy (ORM)
- Pydantic (data validation)
- PostgreSQL (database)
- Alembic (database migrations)

## Key Components

### User Schema

```python
class UserInDB(BaseModel):
    id: str
    username: str
    email: str
    hashed_password: str
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    role: str = "user"
    model_config = ConfigDict(from_attributes=True)
```

### Idea Schema

```python
class IdeaInDB(BaseModel):
    id: str
    title: str
    description: str
    main_author_id: str
    is_approved: bool
    status: IdeaStatus
    created_at: datetime
    category: str
    category_id: str
    stage: IdeaStatus
    collaborators: List[str] = []
    votes: int = 0
    tags: List[str] = []
    model_config = ConfigDict(from_attributes=True)
```

### Comment Schema

```python
class CommentCreate(BaseModel):
    content: str

class CommentInDB(BaseModel):
    id: str
    content: str
    author_id: str
    idea_id: str
    created_at: datetime
    is_approved: bool

    model_config = ConfigDict(from_attributes=True)

class CommentUpdate(BaseModel):
    content: str
```

### Vote Schema

```python
from pydantic import BaseModel

class VoteCreate(BaseModel):
    value: int  # 1 for upvote, -1 for downvote
```

## Setup and Running

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Set up the database: `python src/database/create_database.py`
4. For development, run the application using:
   ```
   python manage.py runserver
   ```
   This will start the development server with hot reloading enabled.

## Database Migrations

Database migrations are automatically handled by `manage.py`. When you run the server or perform other management commands, it will check for and apply any pending migrations.

### We use Alembic for database migrations. To create a new migration:

```bash
alembic revision --autogenerate -m "Description of the change"
```

To apply migrations:

```bash
alembic upgrade head
```

## Authentication

JWT-based authentication is implemented. Users can obtain a token by logging in, which is then used to authenticate subsequent requests.

## Testing

To run tests, use the custom test runner:

```bash
python run_tests.py
```

This script will set up the test environment, run all tests, and provide a summary of the results.

For more granular control or to run specific tests, you can still use pytest directly:

```bash
pytest
```

or

```bash
pytest tests/test_specific_module.py
```

## API Endpoints

### Idea Routes

- Create Idea: POST `/ideas/`
- Get Ideas: GET `/ideas/`
- Get Idea: GET `/ideas/{idea_id}`
- Update Idea: PUT `/ideas/{idea_id}`
- Delete Idea: DELETE `/ideas/{idea_id}`
- Vote Idea: POST `/ideas/{idea_id}/vote`
- Favorite Idea: POST `/ideas/{idea_id}/favorite`
- Unfavorite Idea: DELETE `/ideas/{idea_id}/favorite`
- Search Ideas: GET `/ideas/search`
- Get Trending Ideas: GET `/ideas/trending`
- Report Idea: POST `/ideas/{idea_id}/report`
- Invite Collaborator: POST `/ideas/{idea_id}/invite`
- Get Idea Versions: GET `/ideas/{idea_id}/versions`
- Get Specific Idea Version: GET `/ideas/{idea_id}/versions/{version_id}`

### Comment Routes

- Create Comment: POST `/{idea_id}/comments`
- Get Comments: GET `/{idea_id}`
- Update Comment: PUT `/{comment_id}`

### User Routes

- User Authentication: Various endpoints under `/users/auth`
- User Profile: Various endpoints under `/users/profile`
- User Management: Various endpoints under `/users/management`
- User Stats: GET `/users/stats`
- User Invitations: Various endpoints under `/users/invitations`

### Admin Routes

- User Management: Various endpoints under `/admin/users`
- Idea Management: Various endpoints under `/admin/ideas`
- Category Management: Various endpoints under `/admin/categories`
- Comment Management: Various endpoints under `/admin/comments`
- Reports Management: Various endpoints under `/admin/reports`
- Analytics: Various endpoints under `/admin/analytics`
- Department Management: Various endpoints under `/admin/departments`
- Badge Management: Various endpoints under `/admin/badges`
- Feature Flag Management: Various endpoints under `/admin/feature-flags`

## Services

### Airbyte Integration

```python
import requests
import os
from dotenv import load_dotenv

load_dotenv()

AIRBYTE_API_URL = os.getenv('AIRBYTE_API_URL')
AIRBYTE_USERNAME = os.getenv('AIRBYTE_USERNAME')
AIRBYTE_PASSWORD = os.getenv('AIRBYTE_PASSWORD')

def get_airbyte_auth():
    return (AIRBYTE_USERNAME, AIRBYTE_PASSWORD)

def create_trello_card(idea):
    endpoint = f"{AIRBYTE_API_URL}/v1/destinations/trello/cards"
    payload = {
        "name": idea.title,
        "desc": f"Description: {idea.description}\nAuthor: {idea.main_author.username}\nID: {idea.id}",
        "idList": os.getenv('TRELLO_LIST_ID')
    }
    response = requests.post(endpoint, json=payload, auth=get_airbyte_auth())
    if response.status_code == 200:
        return response.json().get('shortUrl')
    else:
        print(f"Error creating Trello card: {response.text}")
        return None

def send_slack_notification(message):
    endpoint = f"{AIRBYTE_API_URL}/v1/destinations/slack/messages"
    payload = {
        "channel": os.getenv('SLACK_CHANNEL_ID'),
        "text": message
    }
    response = requests.post(endpoint, json=payload, auth=get_airbyte_auth())
    if response.status_code == 200:
        return response.json().get('ts')
    else:
        print(f"Error sending Slack message: {response.text}")
        return None
```

### Email Service

```python
import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
    MAIL_FROM = os.getenv("MAIL_FROM"),
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER = os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True
)

async def send_email(subject: str, recipients: list, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=body,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
```

## Database

### Database Configuration

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from .base import Base

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ideas.db")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Database Migrations

```python
from sqlalchemy import Column, Integer, String, Table, inspect
from sqlalchemy.orm import sessionmaker

def run_migrations(engine):
    Session = sessionmaker(bind=engine)
    session = Session()

    # List of migrations
    migrations = [
        add_points_to_users,
        # Add more migration functions here as needed
    ]

    for migration in migrations:
        migration(engine, session)

    session.close()
    print("All migrations completed successfully")

def add_points_to_users(engine, session):
    # Check if 'points' column exists in users table
    inspector = inspect(engine)
    columns = [col["name"] for col in inspector.get_columns("users")]

    if "points" not in columns:
        # Add 'points' column to the users table
        with engine.begin() as connection:
            connection.execute("ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 0")
        print("Added 'points' column to users table")
    else:
        print("'points' column already exists in users table")

# Add more migration functions here as needed
```

## Models

The project includes various models such as User, Idea, Comment, Category, Tag, Notification, Report, CollaborationInvitation, UserFavorite, Department, Badge, FeatureFlag, IdeaVersion, and UserVote. These models define the structure of the database tables.

## Authentication and Authorization

The project uses JWT-based authentication and role-based access control (RBAC) for authorization. The `admin_only` and `admin_or_moderator` decorators are used to restrict access to certain endpoints.

## Rate Limiting

Rate limiting is implemented to prevent abuse of the API. The `rate_limit_if_enabled` decorator is used on various endpoints to apply rate limiting.

## Testing

The project includes a test environment setup. Many routes have conditional logic to return mock data when in the test environment:

```python
    stage: Optional[IdeaStatus] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if is_test_environment():
        # Return mock data for tests
        return {
            "total": 2,
            "ideas": [
                IdeaInDB(id=1, title="Test Idea 1", description="Description 1", main_author_id=current_user.id, is_approved=True, status=IdeaStatus.DRAFT),
                IdeaInDB(id=2, title="Test Idea 2", description="Description 2", main_author_id=current_user.id, is_approved=True, status=IdeaStatus.DRAFT)
            ],
            "skip": skip,
            "limit": limit
        }
```

## External Integrations

The project integrates with external services such as Trello for task management and Slack for notifications:

```python
def create_trello_card(idea):
    endpoint = f"{AIRBYTE_API_URL}/v1/destinations/trello/cards"
    payload = {
        "name": idea.title,
        "desc": f"Description: {idea.description}\nAuthor: {idea.main_author.username}\nID: {idea.id}",
        "idList": os.getenv('TRELLO_LIST_ID')
    }
    response = requests.post(endpoint, json=payload, auth=get_airbyte_auth())
    if response.status_code == 200:
        return response.json().get('shortUrl')
    else:
        print(f"Error creating Trello card: {response.text}")
        return None

def send_slack_notification(message):
    endpoint = f"{AIRBYTE_API_URL}/v1/destinations/slack/messages"
    payload = {
        "channel": os.getenv('SLACK_CHANNEL_ID'),
        "text": message
    }
    response = requests.post(endpoint, json=payload, auth=get_airbyte_auth())
    if response.status_code == 200:
        return response.json().get('ts')
    else:
        print(f"Error sending Slack message: {response.text}")
        return None
```

## Conclusion

This backend provides a robust foundation for the IdeasExchange platform, offering comprehensive API endpoints for idea management, user interactions, and administrative functions. The modular structure and use of modern Python practices make it scalable and maintainable.

## Project Structure

```bash
backend/
├── README.md
├── ideas.db
├── manage.py
├── requirements.txt
├── run_tests.py
├── src/
│ ├── auth/
│ │ └── rbac.py
│ ├── database/
│ │ ├── __init__.py
│ │ ├── base.py
│ │ ├── create_database.py
│ │ ├── database.py
│ │ └── migrations.py
│ ├── dependencies/
│ │ ├── __init__.py
│ │ ├── auth.py
│ │ ├── database.py
│ │ └── user.py
│ ├── middleware/
│ │ └── rate_limiter.py
│ ├── models/
│ │ ├── __init__.py
│ │ ├── badge.py
│ │ ├── category.py
│ │ ├── collaboration_invitation.py
│ │ ├── comment.py
│ │ ├── department.py
│ │ ├── feature_flag.py
│ │ ├── idea.py
│ │ ├── idea_version.py
│ │ ├── notification.py
│ │ ├── report.py
│ │ ├── tag.py
│ │ ├── user.py
│ │ ├── user_favorite.py
│ │ └── user_vote.py
│ ├── routes/
│ │ ├── admin/
│ │ ├── comment/
│ │ ├── idea/
│ │ └── user/
│ ├── schemas/
│ │ ├── __init__.py
│ │ ├── badge.py
│ │ ├── category.py
│ │ ├── collaboration.py
│ │ ├── comment.py
│ │ ├── department.py
│ │ ├── feature_flag.py
│ │ ├── idea.py
│ │ ├── idea_version.py
│ │ ├── notification.py
│ │ ├── report.py
│ │ ├── user.py
│ │ ├── user_update.py
│ │ └── vote.py
│ ├── services/
│ │ ├── airbyte_integration.py
│ │ ├── email_service.py
│ │ └── external_integrations.py
│ ├── utils/
│ │ └── points.py
│ └── main.py
├── test.db
└── tests/
    ├── auth/
    ├── conftest.py
    ├── test_idea.py
    ├── test_user.py
    └── utils.py
```
