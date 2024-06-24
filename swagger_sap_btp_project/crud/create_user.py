from fastapi import APIRouter, HTTPException, status
from database import create_connection_mysql_db
from schemas import User

router = APIRouter()

@router.post('/user-creation', status_code=status.HTTP_201_CREATED)
async def create_user(user: User):
    if not (user.username and user.password and user.email and user.role):
        return {"error": "Missing required fields"}, status.HTTP_400_BAD_REQUEST
    
    query = """
    INSERT INTO users (username, password, email, role, position, education, contact_info)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    async with await create_connection_mysql_db() as conn:
        async with conn.cursor() as cursor:
            try:
                await cursor.execute(query, (user.username, user.password, user.email, user.role, user.position, user.education, user.contact_info))
                await conn.commit()
                user_id = cursor.lastrowid
                return {**user.dict(), "id": user_id}
            except Exception as e:
                await conn.rollback()
                raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
