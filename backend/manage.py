#!/usr/bin/env python
import os
import subprocess
import sys
import venv
import secrets
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from src.database import create_database, engine
from src.models import User, UserRole
from src.schemas.user import UserCreate


def clear_terminal():
    os.system("cls" if os.name == "nt" else "clear")


def create_venv():
    venv_path = Path("venv")
    if not venv_path.exists():
        print("Creating virtual environment...")
        venv.create(venv_path, with_pip=True)
    return venv_path


def run_in_venv(venv_path, command):
    if sys.platform == "win32":
        python = venv_path / "Scripts" / "python.exe"
    else:
        python = venv_path / "bin" / "python"
    return subprocess.run([str(python), "-m"] + command, check=True)


def install_requirements(venv_path):
    print("Installing/updating requirements...")
    run_in_venv(venv_path, ["pip", "install", "--upgrade", "-r", "requirements.txt"])


def run_app():
    print("Running the application...")
    os.environ["PYTHONPATH"] = str(Path.cwd())
    clear_terminal()
    try:
        run_in_venv(venv_path, ["uvicorn", "src.main:app", "--reload"])
    except subprocess.CalledProcessError as e:
        print(f"Error running the application: {e}")
        sys.exit(1)


def generate_secret_key():
    return secrets.token_urlsafe(32)


def setup_env():
    env_path = Path(".env")
    if not env_path.exists():
        print("Creating .env file...")
        secret_key = generate_secret_key()
        api_key = generate_secret_key()
        with open(env_path, "w") as f:
            f.write(
                f"""ENVIRONMENT=development
KEYCLOAK_URL=http://localhost:8080/auth
KEYCLOAK_REALM=your_realm
KEYCLOAK_CLIENT_ID=your_client_id
KEYCLOAK_CLIENT_SECRET=your_client_secret
DATABASE_URL=sqlite:///./ideas.db
SECRET_KEY={secret_key}
API_KEY={api_key}
DEBUG=True
"""
            )
        print("Please update the .env file with your specific configuration.")
    else:
        load_dotenv()
        if not os.getenv("SECRET_KEY"):
            update_env_file("SECRET_KEY", generate_secret_key())
        if not os.getenv("API_KEY"):
            update_env_file("API_KEY", generate_secret_key())


def update_env_file(key, value):
    env_path = Path(".env")
    with open(env_path, "a") as f:
        f.write(f"{key}={value}\n")
    print(f"Generated new {key} and added it to .env file.")


def create_test_users(db_session):
    admin_user = UserCreate(
        username="admin", email="admin@example.com", password="adminpassword"
    )
    normal_user = UserCreate(
        username="user", email="user@example.com", password="userpassword"
    )

    admin = db_session.query(User).filter(User.username == admin_user.username).first()
    if not admin:
        admin = User(**admin_user.dict(), role=UserRole.ADMIN, is_approved=True)
        db_session.add(admin)

    user = db_session.query(User).filter(User.username == normal_user.username).first()
    if not user:
        user = User(**normal_user.dict(), role=UserRole.USER, is_approved=True)
        db_session.add(user)

    db_session.commit()
    print("Test users created successfully.")


def setup_development_environment():
    load_dotenv()
    if os.getenv("ENVIRONMENT") == "development":
        Session = sessionmaker(bind=engine)
        db_session = Session()
        create_test_users(db_session)
        db_session.close()


def setup_database():
    print("Setting up the database...")
    create_database()
    print("Database setup complete.")


if __name__ == "__main__":
    try:
        venv_path = create_venv()
        setup_env()
        install_requirements(venv_path)
        setup_database()
        setup_development_environment()
        run_app()
    except Exception as e:
        print(f"An error occurred during setup: {e}")
        sys.exit(1)
