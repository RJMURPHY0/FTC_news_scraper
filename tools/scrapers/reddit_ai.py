import urllib.request
from datetime import datetime, timezone, timedelta
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def scrape():
    """Scrape top posts from r/artificial over the last 24 hours."""
    url = "https://www.reddit.com/r/artificial/top.json?t=day&limit=15"
    headers = {
        "User-Agent": "windows:antigravity.scraper:v1.0.0 (by /u/system_pilot)"
    }
    
    articles = []
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
        
        now = datetime.now(timezone.utc)
        yesterday = now - timedelta(days=1)
        
        children = data.get("data", {}).get("children", [])
        for child in children:
            post = child.get("data", {})
            created_utc = post.get("created_utc")
            
            if not created_utc:
                continue
                
            post_date = datetime.fromtimestamp(created_utc, tz=timezone.utc)
            
            # Ensure it's within the last 24h (though API handles it, double checking)
            if post_date >= yesterday:
                # Handle preview images if available
                image_url = ""
                if "preview" in post and "images" in post["preview"] and len(post["preview"]["images"]) > 0:
                    try:
                        image_url = post["preview"]["images"][0]["source"]["url"].replace("&amp;", "&")
                    except Exception:
                        pass
                
                article = {
                    "id": post.get("name", str(post.get("id"))),
                    "source": "Reddit (r/artificial)",
                    "title": post.get("title", "Untitled"),
                    "url": f"https://www.reddit.com{post.get('permalink', '')}",
                    "summary": post.get("selftext", "")[:200] + ("..." if len(post.get("selftext", "")) > 200 else ""),
                    "published_date": post_date.isoformat(),
                    "image_url": image_url
                }
                
                articles.append(article)
                
    except Exception as e:
        logger.error(f"Error scraping Reddit: {e}")
        
    return articles

if __name__ == "__main__":
    print(json.dumps(scrape(), indent=2))
