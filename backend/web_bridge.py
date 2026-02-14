import requests
from bs4 import BeautifulSoup
import urllib.parse

def get_live_nhs_data(query):
    """
    Attempts to fetch data for a condition directly from NHS website in real-time.
    Strategies:
    1. Direct Slug Guess (e.g. "brain tumor" -> "brain-tumour")
    2. (future) NHS Search
    """
    print(f"DEBUG: Attempting live web fetch for: {query}")
    
    # Clean query to slug format
    # simplistic: spaces to hyphens
    slug = query.lower().strip().replace(" ", "-")
    
    # List of URL candidates to try
    urls_to_try = [
        f"https://www.nhs.uk/conditions/{slug}/",
        f"https://www.nhs.uk/conditions/{slug.replace('tumor', 'tumour')}/", # UK spelling
        f"https://www.nhs.uk/conditions/{slug.replace('edema', 'oedema')}/",
        f"https://www.nhs.uk/conditions/{slug.replace('anemia', 'anaemia')}/"
    ]
    
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    for url in urls_to_try:
        try:
            print(f"Checking URL: {url}")
            response = requests.get(url, headers=headers, timeout=3)
            
            if response.status_code == 200:
                print("Hit! Parsing content...")
                soup = BeautifulSoup(response.content, 'html.parser')
                main_content = soup.find('main')
                
                if not main_content: continue
                
                # Extract Title
                title = soup.find('h1').get_text().strip() if soup.find('h1') else query.title()
                
                # Extract Description
                explanation = "Information not available."
                summary_section = main_content.find('section', class_='nhsuk-section') or main_content
                
                # Get first 2 substantial paragraphs
                paragraphs = []
                for p in summary_section.find_all('p'):
                    text = p.get_text().strip()
                    if len(text) > 40:
                        paragraphs.append(text)
                        if len(paragraphs) >= 2: break
                
                if paragraphs:
                    explanation = " ".join(paragraphs)
                
                # Construct Response Object
                return {
                    "condition": title,
                    "stage": "Live Web Result",
                    "explanation": explanation,
                    "treatment_guidance": "Please consult a GP for specific guidance on this condition.",
                    "medications": ["Consult Doctor"],
                    "dos": ["Monitor symptoms", "Consult NHS 111 if urgent"],
                    "donts": ["Do not self-diagnose"],
                    "referral": "Refer to GP.",
                    "keywords": query.split()
                }
                
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            
    return None
