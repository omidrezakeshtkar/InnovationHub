import pytest
from fastapi.testclient import TestClient
from backend.src.models import User


def test_login_success(client: TestClient, test_user: User):
    response = client.post(
        "/users/auth/token",
        data={"username": test_user.username, "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials(client: TestClient):
    response = client.post(
        "/users/auth/token",
        data={"username": "invaliduser", "password": "invalidpassword"},
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect username or password"}


def test_login_missing_fields(client: TestClient):
    response = client.post("/users/auth/token", data={})
    assert response.status_code == 422
