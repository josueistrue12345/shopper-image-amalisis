from pymongo import AsyncMongoClient
from pymongo import MongoClient
from pymongo.server_api import ServerApi

from app.core.config import Settings

client_1 = AsyncMongoClient(Settings.INSPECT_DB, server_api=ServerApi('1'))
client_2 = MongoClient(Settings.ANALYSIS_DB)

inspect_db = client_1['admin']
analysis_db = client_2['image_analysis']