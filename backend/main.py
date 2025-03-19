import requests
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import recipes 



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # ✅ Allow all HTTP methods (POST, OPTIONS, etc.)
    allow_headers=["*"],  # ✅ Allow all headers
)


app.include_router(recipes.router)
