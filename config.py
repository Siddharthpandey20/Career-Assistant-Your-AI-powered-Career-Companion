import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Keys
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
JSEARCH_API_KEY = os.getenv('JSEARCH_API_KEY')

# API Configurations
JSEARCH_URL = os.getenv('JSEARCH_URL')
GEMINI_MODEL = os.getenv('GEMINI_MODEL')

# Headers
JSEARCH_HEADERS = {
    "X-RapidAPI-Key": JSEARCH_API_KEY,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
}
