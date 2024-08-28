from sqlalchemy import create_engine
from .database import SQLALCHEMY_DATABASE_URL
from .base import Base
from .migrations import run_migrations
from sqlalchemy.orm import sessionmaker


def create_database():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

    # Import all models here to ensure they're registered with Base
    from ..models import (
        User, Idea, Comment, Category, Tag, Notification, Report,
        CollaborationInvitation, UserFavorite, Department, Badge,
        FeatureFlag, IdeaVersion, UserVote
    )

    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")

    # Create a session
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # Run migrations
        run_migrations(engine, session)
    except Exception as e:
        print(f"An error occurred during migrations: {e}")
        print("Please check your database configuration and try again.")
    finally:
        session.close()


if __name__ == "__main__":
    create_database()
