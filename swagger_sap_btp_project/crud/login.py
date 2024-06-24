from fastapi import APIRouter, HTTPException, status
from database import create_connection_mysql_db
from schemas import LoginRequest

router = APIRouter()

@router.post('/login', status_code=status.HTTP_200_OK)
async def login(request: LoginRequest):
    query = "SELECT * FROM users WHERE username = %s AND password = %s"
    async with await create_connection_mysql_db() as conn:
        async with conn.cursor() as cursor:
            try:
                await cursor.execute(query, (request.username, request.password))
                user = await cursor.fetchone()
                if user:
                    return {"success": True, "message": "Login successful"}
                else:
                    return {"success": False, "message": "Invalid username or password"}
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
