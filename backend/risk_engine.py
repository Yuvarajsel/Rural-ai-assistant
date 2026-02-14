def calculate_risk_score(image_confidence: float, symptom_severity: float, retrieved_severity: float) -> dict:
    """
    Calculate risk score based on weighted formula:
    Risk = (0.4 * ImageScore) + (0.3 * SymptomScore) + (0.3 * RetrievedSeverity)
    
    Scores are normalized between 0 and 1.
    """
    risk_score = (0.4 * image_confidence) + (0.3 * symptom_severity) + (0.3 * retrieved_severity)
    
    risk_level = "Low"
    if risk_score > 0.75:
        risk_level = "Emergency"
    elif risk_score > 0.5:
        risk_level = "High"
    elif risk_score > 0.25:
        risk_level = "Moderate"
        
    return {
        "score": round(risk_score, 2),
        "level": risk_level
    }

def get_treatment_guidance(risk_level: str, condition: str) -> str:
    # Placeholder logic
    guidance = {
        "Low": "Monitor symptoms. Apply over-the-counter cream if applicable.",
        "Moderate": "Consult a local healthcare worker. Monitor for worsening symptoms.",
        "High": "Urgent consultation required. Refer to district hospital.",
        "Emergency": "IMMEDIATE REFERRAL REQUIRED. Transport patient to nearest emergency facility."
    }
    return guidance.get(risk_level, "Consult a specialist.")
