import json
import os
import sys

# Ensure tools is in path so we can import scrapers
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scrapers import reddit_ai

def main():
    print("Initiating Scraper Runner...")
    
    # 1. Run all scrapers
    articles = []
    
    print("Running Reddit scraper...")
    articles.extend(reddit_ai.scrape())
    
    # (Future scrapers like bens_bytes and ai_rundown will be imported and run here)
    
    # 2. Package into Payload
    payload = {
        "articles": articles
    }
    
    # 3. Save to .tmp
    tmp_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".tmp")
    os.makedirs(tmp_path, exist_ok=True)
    
    out_file = os.path.join(tmp_path, "articles.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
        
    print(f"Successfully scraped {len(articles)} articles and saved to {out_file}")

if __name__ == "__main__":
    main()
