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
