from fastapi import APIRouter, HTTPException, status
from database import create_connection_mysql_db

router = APIRouter()

@router.get('/users/{id}', status_code=status.HTTP_200_OK)
async def get_user(id: int):
    select_query = "SELECT * FROM users WHERE id = %s"
    async with await create_connection_mysql_db() as conn:
        async with conn.cursor() as cursor:
            try:
                await cursor.execute(select_query, (id,))
                user = await cursor.fetchone()
                if not user:
                    raise HTTPException(status_code=404, detail="User not found")
                return user
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error retrieving user: {str(e)}")
