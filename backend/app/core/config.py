import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    REDIS_URL = os.getenv("REDIS_URL")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    ANALYSIS_DB = os.getenv("ANALYSIS_DB")
    INSPECT_DB = os.getenv("INSPECT_DB")
    AUTH_S3_URL = os.getenv("AUTH_S3_URL")

settings = Settings()
