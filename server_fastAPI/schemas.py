from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: Optional[int] = None
    username: str
    password: str
    email: str
    role: str
    position: Optional[str] = None
    education: Optional[str] = None
    contact_info: Optional[str] = None
    created_at: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class UpdateUserRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str
    position: str
    education: str
    contact_info: str
