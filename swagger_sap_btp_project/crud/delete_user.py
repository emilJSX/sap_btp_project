from fastapi import APIRouter, HTTPException, status
from database import create_connection_mysql_db

router = APIRouter()

@router.delete('/users/{id}', status_code=status.HTTP_200_OK)
async def delete_user(id: int):
    delete_query = "DELETE FROM users WHERE id = %s"
    async with await create_connection_mysql_db() as conn:
        async with conn.cursor() as cursor:
            try:
                await cursor.execute(delete_query, (id,))
                await conn.commit()
                if cursor.rowcount == 0:
                    raise HTTPException(status_code=404, detail="User not found")
                return {"message": "User deleted successfully", "userId": id}
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}")
