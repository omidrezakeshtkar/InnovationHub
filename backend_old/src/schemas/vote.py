from pydantic import BaseModel

class VoteCreate(BaseModel):
    value: int  # 1 for upvote, -1 for downvote