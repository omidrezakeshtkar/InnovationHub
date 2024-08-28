import pytest
from fastapi.testclient import TestClient

def test_register_success(client: TestClient):
    response = client.post(
        "/users/auth/register",
        json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "newpassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert "id" in data

def test_register_duplicate_username(client: TestClient, test_user):
    response = client.post(
        "/users/auth/register",
        json={
            "username": test_user.username,
            "email": "another@example.com",
            "password": "newpassword"
        }
    )
    assert response.status_code == 400
    assert "Username already registered" in response.json()["detail"]

def test_register_invalid_email(client: TestClient):
    response = client.post(
        "/users/auth/register",
        json={
            "username": "invaliduser",
            "email": "notanemail",
            "password": "newpassword"
        }
    )
    assert response.status_code == 422

def test_register_missing_fields(client: TestClient):
    response = client.post("/users/auth/register", json={})
    assert response.status_code == 422