from fastapi import APIRouter, HTTPException, status
from database import create_connection_mysql_db
from schemas import UpdateUserRequest

router = APIRouter()

@router.put('/users/{id}', status_code=status.HTTP_200_OK)
async def update_user(id: int, user: UpdateUserRequest):
    update_query = """
        UPDATE users
        SET username = %s, email = %s, password = %s, role = %s, position = %s, education = %s, contact_info = %s
        WHERE id = %s
    """

    select_query = """
        SELECT * FROM users WHERE id = %s
    """

    async with await create_connection_mysql_db() as conn:
        async with conn.cursor() as cursor:
            print(user, "-==================================================================")
            try:
                await cursor.execute(update_query, (user.username, user.email, user.password, user.role, user.position, user.education, user.contact_info, id))
                await conn.commit()
                if cursor.rowcount == 0:
                    raise HTTPException(status_code=404, detail="User not found")

                await cursor.execute(select_query, (id,))
                updated_user = await cursor.fetchone()
                if updated_user:
                    return {"message": "User updated successfully", "userData": updated_user}
                else:
                    raise HTTPException(status_code=404, detail="User not found after update")
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")
