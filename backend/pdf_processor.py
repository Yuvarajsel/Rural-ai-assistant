import fitz  # PyMuPDF
from fastapi import UploadFile

async def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Extracts text from an uploaded PDF file.
    """
    try:
        content = await file.read()
        doc = fitz.open(stream=content, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""

def summarize_medical_report(text: str) -> str:
    """
    Placeholder for LLM-based summarization of medical report.
    For hackathon, we can return a mock summary or first 500 chars.
    """
    # In real implementation: Use LangChain + LLM
    return f"Summary of Report: {text[:200]}..."
