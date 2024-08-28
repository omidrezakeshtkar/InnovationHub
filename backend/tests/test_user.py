import pytest
from fastapi.testclient import TestClient

def test_read_users_me(client, test_user, token_header):
    response = client.get("/users/profile/me", headers=token_header)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "testuser@example.com"

def test_update_user_profile(client, test_user, token_header):
    response = client.put(
        "/users/profile/me",
        json={
            "username": "updateduser",
            "email": "updated@example.com"
        },
        headers=token_header
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "updateduser"
    assert data["email"] == "updated@example.com"

def test_get_user_stats(client: TestClient, mock_get_current_user, token_header):
    response = client.get("/users/stats", headers=token_header)
    assert response.status_code == 200
    data = response.json()
    assert "total_ideas" in data