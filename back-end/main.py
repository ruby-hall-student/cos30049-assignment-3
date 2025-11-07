from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model import SpamModel
from pydantic import BaseModel, Field

app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["http://localhost:3000"], # URL of React application
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SpamModel()

@app.get("/")
async def root():
    return {"message": "This is a test message"}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

