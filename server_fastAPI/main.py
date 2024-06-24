from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from crud import create_user, read_users, login, update_user, delete_user, get_user

app = FastAPI()

# Настройки CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение маршрутов
app.include_router(create_user)
app.include_router(read_users)
app.include_router(login)
app.include_router(update_user)
app.include_router(delete_user)
app.include_router(get_user)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
