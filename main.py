from fastapi import FastAPI, File, UploadFile, Form,Depends,Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse,HTMLResponse, Response
from fastapi.staticfiles import StaticFiles
import google.generativeai as genai
import fitz,os,shutil,tempfile,textwrap,httpx,json,requests
from datetime import datetime
import schemas
from dotenv import load_dotenv
from config import GEMINI_API_KEY, JSEARCH_API_KEY, JSEARCH_URL, GEMINI_MODEL, JSEARCH_HEADERS

# Load environment variables at the start
load_dotenv()

# Get API keys and config from environment variables
# GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
# JSEARCH_API_KEY = os.getenv('JSEARCH_API_KEY')
# JSEARCH_URL = os.getenv('JSEARCH_URL')
# GEMINI_MODEL = os.getenv('GEMINI_MODEL')

# PyMuPDF for extracting text from PDFs
# shutil  # For handling file operations
# tempfile  # For creating temporary files
# textwrap  # Add this import for text formatting
# httpx # Add this import for making HTTP requests
# json  # Import json for formatting output

# Create single FastAPI instance
app = FastAPI()

# Configure CORS properly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Explicitly allow POST
    allow_headers=["*"],
)

# Remove static file mounting
# app.mount("/static", StaticFiles(directory="."), name="static")

# Serve HTML pages
@app.get("/")
async def serve_index():
    return FileResponse("index.html")

@app.get("/analysis.html")
async def serve_analysis():
    return FileResponse("analysis.html")

@app.get("/enhancement.html")
async def serve_enhancement():
    return FileResponse("enhancement.html")

@app.get("/search.html")
async def serve_search():
    return FileResponse("search.html")

@app.get("/trends.html")
async def serve_trends():
    return FileResponse("trends.html")

# Serve static files
@app.get("/styles.css")
async def serve_css():
    return FileResponse("styles.css", media_type="text/css")

@app.get("/script.js")
async def serve_js():
    return FileResponse("script.js", media_type="text/javascript")

@app.get("/favicon.png")
async def serve_favicon():
    try:
        return FileResponse("favicon.jpg", media_type="image/jpg")
    except:
        # Return a default transparent pixel if favicon.png is missing
        transparent_pixel = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x00\x00\x02\x00\x01\xe5\x27\xde\xfc\x00\x00\x00\x00IEND\xaeB`\x82'
        return Response(content=transparent_pixel, media_type="image/jpg")

#func to tae text from pdf

def extract_text_from_pdf(file_content: bytes) -> str:
    """
    Extracts text from a PDF file provided as bytes.

    Args:
        file_content (bytes): The content of the uploaded PDF file.

    Returns:
        str: The extracted text from the PDF.
    """
    # Create a temporary file to store the PDF content
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(file_content)
        temp_file_path = temp_file.name

    try:
        # Open the PDF file with fitz (PyMuPDF)
        with fitz.open(temp_file_path) as doc:
            content = "\n".join([page.get_text() for page in doc])
            # Format text with proper wrapping
            content = textwrap.fill(content, width=80)
        return content

    except Exception as e:
        raise Exception(f"Error processing PDF: {str(e)}")

    finally:
        # Ensure the temporary file is deleted
        try:
            os.remove(temp_file_path)
        except Exception as e:
            print(f"Warning: Could not delete temp file. {e}")


# func to upload file

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), position: str = Form(...)):
    try:
        # Read the uploaded file content
        file_content = await file.read()
        
        # Use the extract_text_from_pdf function to extract text from the uploaded file
        extracted_content = extract_text_from_pdf(file_content)
        
        response_message = {'Resume_Content': extracted_content, 'Position': position}
        return {"message": response_message}

    except Exception as e:
        return {"error": f"Failed to process file: {str(e)}"}

# func to analyze resume

client = httpx.AsyncClient()  # Define the client

# Update Gemini configuration
genai.configure(api_key=GEMINI_API_KEY)

# Update JSearch configuration
headers = {
    "X-RapidAPI-Key": JSEARCH_API_KEY,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
}

@app.post("/gemini/")  # Ensure this is defined as POST
async def func_to_generate_content(file: UploadFile = File(...), position: str = Form(...)):
    try:
        print(f"Received analysis request for {position}")  # Debug log
        # First read the file content
        file_content = await file.read()

        # Extract text from the PDF
        extracted_content = extract_text_from_pdf(file_content)

        # Create the Content object with the extracted content
        request = schemas.Content(
            position=position,
            content=extracted_content
        )

        # Proceed with the Gemini AI logic
        model = genai.GenerativeModel(GEMINI_MODEL)

        # First prompt for analysis
        prompt_1 = f"""Analyze this resume: {request.content}
        For the position of: {request.position}
        Provide a structured analysis with:
        1. Detailed evaluation of skills and experience
        2. Clear verdict (selected/rejected)
        3. Specific improvements needed"""

        response_1 = model.generate_content(prompt_1)

        # Second prompt specifically requesting JSON format
        prompt_2 = """Create a JSON object with the following structure:
        {
            "comments": "detailed analysis of the resume",
            "verdict": "selected or rejected",
            "Reason": "reason for selection/rejection",
            "improvements": ["improvement 1", "improvement 2"],
            "job_opportunities": ["opportunity 1", "opportunity 2"],
            "missing_technologies": ["tech 1", "tech 2","tech 3","tech 4"],
            "average_package": "salary range"
        }
        Base it on this analysis: """ + response_1.text

        response_2 = model.generate_content(prompt_2)

        # Try to clean and extract the JSON part from the response
        try:
            response_text = response_2.text.strip()
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            if start != -1 and end != 0:
                json_str = response_text[start:end]
                json_response = json.loads(json_str)
            else:
                json_response = {
                    "comments": response_1.text,
                    "verdict": "Analysis completed but structured response unavailable",
                    "Reason": "Could not determine",
                    "improvements": ["Could not structure improvements"],
                    "job_opportunities": ["Could not structure opportunities"],
                    "missing_technologies": ["Could not structure technologies"],
                    "average_package": "Could not determine"
                }

            return json_response

        except json.JSONDecodeError as je:
            return {
                "comments": response_1.text,
                "error": "Could not structure the response",
                "raw_response": response_2.text
            }

    except Exception as e:
        return {
            "error": f"Failed to process request: {str(e)}",
            "status": "error"
        }



    

# func to search for jobs

@app.get("/find_jobs")
def find_jobs(skills: str = Query(..., description="Comma-separated skills"), location: str = Query(..., description="Location")):
    """
    Find jobs based on extracted skills.
    Example: /find_jobs?skills=Python,TensorFlow,Scikit-learn&location=United States
    """
    # Validate and format query parameters
    if not skills or not location:
        return {"error": "Both skills and location are required"}
        
    # Format skills for search query
    query = f"{skills.replace(',', 'OR ')}"
    
    params = {
        "query": query,
        "page": "1",
        "num_pages": "1",
        "num_results": "10",
        "location": location,
    }
    
    try:
        print(f"Sending request with params: {params}")  # Debug log
        response = requests.get(JSEARCH_URL, headers=JSEARCH_HEADERS, params=params)
        print(f"Response status: {response.status_code}")  # Debug log
        
        # Handle common API response codes
        if response.status_code == 400:
            return {"error": "Invalid search parameters", "details": response.text}
        elif response.status_code == 429:
            return {"error": "API rate limit exceeded. Please try again later."}
            
        response.raise_for_status()
        data = response.json()
        
        if not isinstance(data, dict):
            return {"error": "Invalid API response format"}
            
        jobs = data.get("data", [])
        if not jobs:
            return {"jobs": [], "message": "No jobs found matching your criteria"}

        # Process job results
        processed_jobs = []
        for job in jobs:
            try:
                job_entry = {
                    "title": job.get("job_title", "No title"),
                    "company": job.get("employer_name", "No company name"),
                    "location": f"{job.get('job_city', '')} {job.get('job_country', '')}".strip() or "Location not specified",
                    "posted_date": job.get("job_posted_at_datetime_utc", "Date not specified"),
                    "apply_link": job.get("job_apply_link", "#"),
                    "description": job.get("job_description", "No description available")[:200] + "..."
                }
                processed_jobs.append(job_entry)
            except Exception as e:
                print(f"Error processing job entry: {e}")
                continue
        
        return {
            "jobs": processed_jobs,
            "total_results": len(processed_jobs),
            "message": "Success"
        }

    except requests.RequestException as e:
        print(f"API Error: {str(e)}")
        return {"error": "Failed to fetch jobs", "details": str(e)}
    except Exception as e:
        print(f"Unexpected Error: {str(e)}")
        return {"error": "An unexpected error occurred", "details": str(e)}

# func to enhance resume
@app.post("/enhancement/")  # Ensure this is defined as POST
async def func_to_enhance_resume(
    file: UploadFile = File(...),
    position: str = Form(...)
):
    try:
        print(f"Received enhancement request for {position}")  # Debug log
        file_content = await file.read()
        extracted_content = extract_text_from_pdf(file_content)

        # Configure Gemini
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(GEMINI_MODEL)

        # Generate enhancement prompt
        prompt_1 = f"""Analyze the following resume text and suggest personalized enhancements for landing the desired job role. Provide detailed recommendations in the following structured format:
            1️⃣ Enhancements Needed:
            Identify key areas for improvement in the resume.
            Highlight missing but important sections or information.
            2️⃣ Skills to Add:
            List essential technical and soft skills missing from the resume that are critical for the target job role.
            Differentiate between must-have skills and good-to-have skills.
            3️⃣ Recommended Certifications & Courses:
            Provide high-value certifications that will strengthen the candidate’s profile.
            Mention relevant platforms (Coursera, Udacity, edX, Google, AWS, etc.).
            4️⃣ Other Resume Enhancements:
            Suggest ways to improve wording, structure, or achievements.
            Recommend quantifiable metrics to strengthen impact.
            5️⃣ Best Learning Sources:
            Suggest YouTube channels, MOOCs, books, or professors that provide in-depth learning on missing skills.
            Prioritize free + paid options from reputed sources.
            🔹 Additional Context:
            Resume Text: {extracted_content}
            Target Job Role: {position}
            Ensure that the output is clear, practical, and actionable, providing valuable insights for job seekers. Return the response in a well-structured format."""            
        response_1 = model.generate_content(prompt_1)

        # Second prompt specifically requesting JSON format
        prompt_2 = """Create a JSON object with the following structure:
        {
        "enhancements": 
        {
        "overall_improvements": ["General resume improvements suggested."],
        "skills_to_add": ["Essential skills missing from the resume."],
        "certifications": ["Recommended certifications to strengthen the profile."],
        "resume_format_suggestions": ["Ways to improve wording, structure, or clarity."],
         },
        "learning_resources": 
        {
        "online_courses": ["Best courses (Coursera, Udemy, edX, etc.) for skill improvement."],
        "youtube_channels": ["Top YouTube channels for learning the missing skills."],
        "books": ["Recommended books for deeper knowledge."],
        "professors_or_industry_experts": ["Experts who provide valuable insights on the required skills."]
        }
        }
        Based it on this output: """ + response_1.text

        response_2 = model.generate_content(prompt_2)

        # Try to clean and extract the JSON part from the response
        try:
            response_text = response_2.text.strip()
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            
            if start != -1 and end != 0:
                json_str = response_text[start:end]
                json_response = json.loads(json_str)
            else:
                json_response = {
                    "resume_enhancements": {
                        "overall_improvements": ["Could not structure improvements"],
                        "skills_to_add": ["Could not extract missing skills"],
                        "certifications": ["Could not extract certifications"],
                        "resume_format_suggestions": ["Could not extract format suggestions"]
                    },
                    "learning_resources": {
                        "online_courses": ["Could not extract courses"],
                        "youtube_channels": ["Could not extract YouTube channels"],
                        "books": ["Could not extract book recommendations"],
                        "professors_or_industry_experts": ["Could not extract expert recommendations"]
                    }
                }

            return json_response
        except json.JSONDecodeError as je:
            return {
                "comments": response_1.text,
                "error": "Could not structure the response",
                "raw_response": response_2.text
            }

    except Exception as e:
        return {
            "error": f"Failed to process request: {str(e)}",
            "status": "error"
        }