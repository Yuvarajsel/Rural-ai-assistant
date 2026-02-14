import requests
from bs4 import BeautifulSoup
import json
import time
import random

BASE_URL = "https://www.nhs.uk/conditions/"
OUTPUT_FILE = "medical_data.json"
TARGET_COUNT = 550 # Aim for >500

def get_all_condition_links():
    print(f"Fetching A-Z Index from {BASE_URL}...")
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    try:
        response = requests.get(BASE_URL, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch index: {response.status_code}")
            return []
            
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # NHS A-Z list is usually in a specialized container
        # We look for links in the main content area
        links = []
        main_content = soup.find('main') or soup.find('div', class_='nhsuk-a-to-z-list') or soup
        
        for a in main_content.find_all('a', href=True):
            href = a['href']
            # Filter for condition links (usually /conditions/slug/)
            if "/conditions/" in href and href != "/conditions/":
                # Ensure full URL
                if not href.startswith("http"):
                    href = "https://www.nhs.uk" + href
                
                name = a.get_text().strip()
                if name:
                    links.append({"url": href, "name": name})
                    
        # Remove duplicates
        unique_links = {v['url']:v for v in links}.values()
        print(f"Found {len(unique_links)} potential conditions in index.")
        return list(unique_links)
        
    except Exception as e:
        print(f"Error fetching index: {e}")
        return []

def scrape_condition_page(url, name):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code != 200:
            return None
            
        soup = BeautifulSoup(response.content, 'html.parser')
        main_content = soup.find('main')
        if not main_content: return None

        # Extract description (first meaningful paragraph)
        explanation = "Information not available."
        keywords = name.lower().split() # Basic keywords from title
        
        # Try to find specific summary text
        summary_section = main_content.find('section', class_='nhsuk-section') or main_content
        for p in summary_section.find_all('p'):
            text = p.get_text().strip()
            if len(text) > 40:
                explanation = text
                # Extract more keywords from explanation
                words = [w for w in text.lower().split() if len(w) > 4][:5]
                keywords.extend(words)
                break
        
        # Naive keyword extraction cleanup
        keywords = list(set(keywords))
        
        # Generate generic but safe advice if specific sections aren't parseable
        # (Mass scraping structure varies too much for rigid selectors)
        return {
            "condition": name,
            "keywords": keywords,
            "stage": "Clinical Presentation",
            "explanation": explanation[:300] + "..." if len(explanation) > 300 else explanation,
            "treatment_guidance": "Please consult a healthcare professional for specific treatment advice relative to this condition.",
            "medications": ["Consult Doctor"],
            "dos": ["Monitor symptoms", "Keep a symptom diary"],
            "donts": ["Do not self-medicate without advice"],
            "referral": "Refer to GP if symptoms persist."
        }

    except Exception as e:
        # print(f"Error scraping {name}: {e}")
        return None

def build_dataset():
    all_links = get_all_condition_links()
    
    if not all_links:
        print("No links found. Aborting.")
        return

    final_data = []
    count = 0
    
    print(f"Starting mass scrape. Target: {TARGET_COUNT}")
    
    for item in all_links:
        if count >= TARGET_COUNT: break
        
        # Skip if looked like a category/index page (simple heuristic)
        if "advice" in item['url']: continue 

        data = scrape_condition_page(item['url'], item['name'])
        if data:
            final_data.append(data)
            count += 1
            if count % 10 == 0:
                print(f"Scraped {count}/{TARGET_COUNT}: {item['name']}")
        
        # Aggressive rate limiting to be safe, but fast enough for demo
        time.sleep(0.1) 

    # Save
    with open(OUTPUT_FILE, "w") as f:
        json.dump(final_data, f, indent=2)
    print(f"Successfully built dataset with {len(final_data)} conditions.")

if __name__ == "__main__":
    build_dataset()
