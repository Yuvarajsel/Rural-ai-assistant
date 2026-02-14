import os
import json
import time
import random
import difflib
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from . import web_bridge # Custom Live Search Module
from .pdf_processor import extract_text_from_pdf

app = FastAPI(
    title="Rural Clinical AI Assistant API",
    description="Backend API with Real-Time Web Bridge",
    version="0.4.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    risk_level: str
    probable_condition: str
    disease_stage: str
    detailed_explanation: str
    treatment_guidance: str
    medications: List[str]
    patient_dos: List[str]
    patient_donts: List[str]
    referral_recommendation: str

# --- Load Knowledge Base ---
MEDICAL_DATA_FILE = "medical_data.json"
MEDICAL_DATA = []

def load_data():
    global MEDICAL_DATA
    try:
        with open(MEDICAL_DATA_FILE, "r") as f:
            MEDICAL_DATA = json.load(f)
        print(f"Loaded {len(MEDICAL_DATA)} conditions from knowledge base.")
    except Exception as e:
        print(f"Error loading medical data: {e}")
        MEDICAL_DATA = []

load_data()

def save_new_data(new_entry):
    global MEDICAL_DATA
    MEDICAL_DATA.append(new_entry)
    try:
        with open(MEDICAL_DATA_FILE, "w") as f:
            json.dump(MEDICAL_DATA, f, indent=2)
        print(f"Automatically learned new condition: {new_entry['condition']}")
    except Exception as e:
        print(f"Could not save learned data: {e}")

# --- Generative Logic Engine ---
def generate_dynamic_response(query: str, match_data: dict, input_type: str):
    """
    Constructs a unique response based on the specific input query and the matched condition.
    Usage: Combines clinical templates with user-specific context.
    """
    query = query.lower()
    condition = match_data["condition"]
    
    # 1. Dynamic Detailed Explanation
    explanation_templates = [
        f"Based on the clinical presentation of '{query}', the symptoms align closely with {condition}.",
        f"The reported indicators ({query}) are characteristic of {condition}.",
        f"Analysis indicates {condition}, specifically triggered by the presence of {query}."
    ]
    
    # Add context specific nuance
    nuance = ""
    if "child" in query or "baby" in query:
        nuance = " Note: Special care is required for pediatric presentation."
    elif "severe" in query or "pain" in query or "bleeding" in query:
        nuance = " The mention of severity/pain suggests an acute presentation."
    
    # Use template OR if it's a web result, stick closer to the truth
    if match_data.get("stage") == "Live Web Result":
        final_explanation = f"LIVE WEB RESULT: {match_data['explanation']}"
    else:
        final_explanation = (
            random.choice(explanation_templates) + " " + match_data["explanation"] + nuance
        )

    # 2. Dynamic Risk Assessment
    risk_level = "Moderate Risk"
    if "blood" in query or "breathing" in query or "chest" in query or "severe" in query:
        risk_level = "High Risk / Emergency"
    elif "mild" in query or "itch" in query:
        risk_level = "Low to Moderate Risk"
        
    # Override if condition is effectively dangerous
    if ("Malaria" in condition or "Pneumonia" in condition or
            "TB" in condition or "Cancer" in condition):
        if risk_level != "High Risk / Emergency":
            risk_level = "Moderate to High Risk"

    return {
        "risk_level": risk_level,
        "probable_condition": condition,
        "disease_stage": match_data.get("stage", "Clinical Presentation"),
        "detailed_explanation": final_explanation,
        "treatment_guidance": match_data.get("treatment_guidance", "Consult GP"),
        "medications": match_data.get("medications", []),
        "patient_dos": match_data.get("dos", []),
        "patient_donts": match_data.get("donts", []),
        "referral_recommendation": match_data.get("referral", "Refer to GP")
    }

# --- Helper: Search Algorithm ---
def find_best_match(query: str):
    query = query.lower()
    best_match = None
    max_score = 0.0
    
    # 1. Direct Keyword Counting
    for condition in MEDICAL_DATA:
        if condition["condition"].lower() in query:
             return condition, 1.0 # Perfect match
             
        score = 0
        if len(condition["keywords"]) == 0: continue
        
        for keyword in condition["keywords"]:
            if keyword.lower() in query:
                score += 1
        
        if score > max_score:
            max_score = score
            best_match = condition

    # 2. Fuzzy Matching fallback
    if max_score == 0:
        condition_names = [c["condition"] for c in MEDICAL_DATA]
        matches = difflib.get_close_matches(query, condition_names, n=1, cutoff=0.4)
        if matches:
            for c in MEDICAL_DATA:
                if c["condition"] == matches[0]:
                    return c, 0.8

    # 3. LIVE WEB FALLBACK (Aggressive)
    # If we don't have a PERFECT local match, try the web to get the best real-time data.
    if max_score < 1.0:
        print(f"Local confidence low ({max_score}). Attempting Live Web Search for '{query}'...")
        web_result = web_bridge.get_live_nhs_data(query)
        if web_result:
            # Check if we already have this condition to avoid duplicates
            exists = False
            for c in MEDICAL_DATA:
                if c["condition"] == web_result["condition"]:
                    exists = True
                    break
            
            if not exists:
                save_new_data(web_result)
                return web_result, 1.0
            else:
                # If it existed but keyword matching failed, return the found web result anyway
                return web_result, 1.0

    if max_score == 0:
        return None, 0.0

    return best_match, max_score

def find_condition_in_text(text: str):
    """
    Scans a large text block for known conditions.
    Returns the best matching condition entry or None.
    """
    text = text.lower()
    best_match = None
    max_count = 0
    
    for entry in MEDICAL_DATA:
        condition = entry["condition"]
        # Efficiency: Check if condition is in text
        if condition.lower() in text:
            # Count occurrences to find most relevant topic
            count = text.count(condition.lower())
            
            # Heuristic: Prefer more frequent mentions
            if count > max_count:
                max_count = count
                best_match = entry
            elif count == max_count and count > 0:
                # Tie-breaker: Prefer longer/more specific names
                # e.g. "Type 2 Diabetes" over "Diabetes" if both appear once (unlikely but possible)
                if best_match and len(condition) > len(best_match["condition"]):
                    best_match = entry
                elif not best_match:
                     best_match = entry
                     
    return best_match

# --- Fallback Response ---
UNKNOWN_RESPONSE = {
    "risk_level": "Unknown / Assessment Required",
    "probable_condition": "Unidentified Condition",
    "disease_stage": "N/A",
    "detailed_explanation": (
        "The reported symptoms do not match our database or live web search. "
        "Please visit the closest medical facility."
    ),
    "treatment_guidance": "Consult a doctor immediately for proper diagnosis.",

    "patient_dos": ["Monitor symptoms", "Visit nearest clinic"],
    "patient_donts": ["Do not ignore worsening symptoms"],
    "referral_recommendation": "Refer to General Physician (GP) for diagnosis."
}

@app.get("/")
def read_root():
    return {"message": "Rural Clinical AI Assistant (Web-Connected) is Online"}

@app.post("/analyze-image", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    filename = file.filename.lower()
    # Remove file extension for query
    query = os.path.splitext(filename)[0]
    
    match, score = find_best_match(query)
    
    time.sleep(1.5)
    
    if not match:
        return UNKNOWN_RESPONSE

    return generate_dynamic_response(query, match, "image")

@app.post("/analyze-symptoms", response_model=AnalysisResponse)
async def analyze_symptoms(symptoms: str):
    time.sleep(1.0)
    
    match, score = find_best_match(symptoms)
    
    if not match:
        return UNKNOWN_RESPONSE

    return generate_dynamic_response(symptoms, match, "text")

@app.post("/analyze-report", response_model=AnalysisResponse)
async def analyze_report(file: UploadFile = File(...)):
    filename = file.filename.lower()
    query = os.path.splitext(filename)[0]
    
    # STRATEGY: Prioritize Content Analysis over Filename
    match = None
    
    # 1. Try to read and analyze content first (Most Accurate)
    print(f"Analyzing PDF content for '{filename}'...")
    try:
        validation_text = await extract_text_from_pdf(file)
        if validation_text:
            text_match = find_condition_in_text(validation_text)
            if text_match:
                 match = text_match
                 query = match["condition"] # Use found condition as query context
                 print(f"Found condition in PDF text: {query}")
    except Exception as e:
        print(f"Error during PDF text analysis: {e}")

    # 2. Fallback to filename if content yield no match
    if not match:
        print("PDF content yield no match. Falling back to filename...")
        match, score = find_best_match(query)
        
        if not match and "blood" in query:
             match, _ = find_best_match("anemia")
    
    time.sleep(2)
    
    if not match:
        return UNKNOWN_RESPONSE

    return generate_dynamic_response(query, match, "report")
