from fastapi import APIRouter, HTTPException
from database import create_connection_mysql_db
from schemas import User
from typing import List
from datetime import datetime

router = APIRouter()

@router.get("/users", response_model=List[User])
async def read_users():
    query = "SELECT id, username, password, email, role, position, education, contact_info, created_at FROM users"
    async with await create_connection_mysql_db() as conn:
        async with conn.cursor() as cursor:
            try:
                await cursor.execute(query)
                result = await cursor.fetchall()

                # Преобразование поля created_at в строку
                for user in result:
                    if isinstance(user['created_at'], datetime):
                        user['created_at'] = user['created_at'].isoformat()
                
                return result
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error retrieving users: {str(e)}")
