from backend.src.models import User, Idea, Comment
from backend.src.schemas import IdeaCreate, CommentCreate

def create_test_user(db, username="testuser", email="testuser@example.com", password="testpassword", role="USER", is_approved=True):
    user = User(username=username, email=email, password=password, role=role, is_approved=is_approved)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def create_test_idea(db, user, title="Test Idea", description="This is a test idea"):
    idea = Idea(title=title, description=description, main_author_id=user.id, is_approved=True)
    db.add(idea)
    db.commit()
    db.refresh(idea)
    return idea

def create_test_comment(db, user, idea, content="This is a test comment"):
    comment = Comment(content=content, author_id=user.id, idea_id=idea.id, is_approved=True)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment