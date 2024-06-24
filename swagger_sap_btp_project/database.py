from fastapi import FastAPI
import aiomysql

app = FastAPI()

async def create_connection_mysql_db():
    connection = await aiomysql.connect(
        host='localhost',
        port=3306,
        user='root',
        password='0775808024Em',
        db='user_database',
        cursorclass=aiomysql.DictCursor
    )
    async with connection.cursor() as cursor:
        await cursor.execute("SELECT DATABASE()")
        db_result = await cursor.fetchone()
        print("Connected to database:", db_result['DATABASE()'])
        
        await cursor.execute("SHOW TABLES")
        tables_result = await cursor.fetchall()
        tables = [table['Tables_in_user_database'] for table in tables_result]
        print("Tables in the database:", tables)
        
    return connection

@app.on_event("startup")
async def startup_event():
    await create_connection_mysql_db()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
