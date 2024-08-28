import pytest
from fastapi.testclient import TestClient
from backend.src.models import User, Idea, IdeaStatus

@pytest.fixture
def create_test_idea(db):
    def _create_test_idea(user: User, title: str = "Test Idea", description: str = "This is a test idea"):
        idea = Idea(title=title, description=description, creator_id=user.id)
        db.add(idea)
        db.commit()
        db.refresh(idea)
        return idea
    return _create_test_idea

def test_create_idea(client: TestClient, mock_get_current_user, token_header):
    response = client.post(
        "/ideas/",
        json={"title": "Test Idea", "description": "This is a test idea"},
        headers=token_header,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Idea"
    assert data["description"] == "This is a test idea"

def test_get_ideas(client: TestClient, mock_get_current_user, token_header):
    response = client.get("/ideas/", headers=token_header)
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "ideas" in data

def test_get_idea(client: TestClient, mock_get_current_user, token_header):
    response = client.get("/ideas/1", headers=token_header)
    assert response.status_code == 200
    data = response.json()
    assert "title" in data
    assert "description" in data

def test_update_idea(client: TestClient, mock_get_current_user, token_header):
    response = client.put(
        "/ideas/1",
        json={"title": "Updated Idea", "description": "This is an updated idea"},
        headers=token_header,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Idea"
    assert data["description"] == "This is an updated idea"

def test_delete_idea(client: TestClient, mock_get_current_user, token_header):
    response = client.delete("/ideas/1", headers=token_header)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Idea deleted successfully"

def test_vote_idea(client: TestClient, mock_get_current_user, token_header):
    response = client.post("/ideas/1/vote", json={"value": 1}, headers=token_header)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Vote recorded successfully"

def test_favorite_idea(client: TestClient, mock_get_current_user, token_header):
    response = client.post("/ideas/1/favorite", headers=token_header)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Idea added to favorites"

def test_search_ideas(client: TestClient, mock_get_current_user, token_header):
    response = client.get("/ideas/search?query=test", headers=token_header)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_trending_ideas(client: TestClient, mock_get_current_user, token_header):
    response = client.get("/ideas/trending", headers=token_header)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_report_idea(client: TestClient, mock_get_current_user, token_header):
    response = client.post("/ideas/1/report", json={"reason": "Inappropriate content"}, headers=token_header)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Idea reported successfully"

def test_invite_collaborator(client: TestClient, mock_get_current_user, token_header):
    response = client.post("/ideas/1/invite?collaborator_id=2", headers=token_header)
    assert response.status_code == 200
    data = response.json()
    assert "title" in data
    assert "description" in data