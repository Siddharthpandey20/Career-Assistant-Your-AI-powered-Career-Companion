from pydantic import BaseModel
from typing import List, Optional

class Content(BaseModel):
    position: str = ""
    content: str = ""

class User(BaseModel):
    name:str
    email:str
    password:str
