from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from crew.crew import run_pipeline
from services.paper_loader import load_pdf_text
import io

app = FastAPI()

# Allow React to talk to Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_paper(
    file: UploadFile = File(...), 
    industry: str = Form(None)
):
    # 1. Read the uploaded PDF
    content = await file.read()
    
    # 2. Use your existing logic to extract text
    paper_text = load_pdf_text(content)
    
    # 3. Add industry hint to text if provided
    if industry:
        paper_text = f"Target Industry: {industry}\n\n" + paper_text

    # 4. Run your CrewAI pipeline
    # Note: run_pipeline might take a while. In production, 
    # use BackgroundTasks or Celery, but this works for simple apps.
    result = run_pipeline(paper_text)
    
    return {"report": str(result)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
