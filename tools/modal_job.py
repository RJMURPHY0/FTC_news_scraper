"""
modal_job.py — Antigravity AI News Scraper
------------------------------------------
Runs every 24 hours on Modal cloud to scrape the latest AI articles.

Commands:
  First time setup:  python -m modal setup
  Deploy (schedule): python -m modal deploy tools/modal_job.py
  Run manually now:  python -m modal run tools/modal_job.py
  View logs:         python -m modal app logs antigravity-scraper
"""

import modal
import json

app = modal.App("antigravity-scraper")


@app.function(schedule=modal.Cron("0 6 * * *"))  # Every day at 06:00 UTC
def scrape_articles():
    """Scrapes Reddit r/artificial for the last 24 hours of AI news."""
    import urllib.request
    from datetime import datetime, timezone, timedelta

    print("Starting Antigravity scrape job...")

    url = "https://www.reddit.com/r/artificial/top.json?t=day&limit=20"
    headers = {"User-Agent": "windows:antigravity.scraper:v1.0.0 (by /u/system_pilot)"}

    articles = []
    now = datetime.now(timezone.utc)
    yesterday = now - timedelta(days=1)

    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode("utf-8"))

        for child in data.get("data", {}).get("children", []):
            post = child.get("data", {})
            created_utc = post.get("created_utc")
            if not created_utc:
                continue

            post_date = datetime.fromtimestamp(created_utc, tz=timezone.utc)
            if post_date < yesterday:
                continue

            image_url = ""
            try:
                image_url = (
                    post["preview"]["images"][0]["source"]["url"]
                    .replace("&amp;", "&")
                )
            except Exception:
                pass

            text = post.get("selftext", "")
            articles.append({
                "id": post.get("name", str(post.get("id"))),
                "source": "Reddit (r/artificial)",
                "title": post.get("title", "Untitled"),
                "url": f"https://www.reddit.com{post.get('permalink', '')}",
                "summary": text[:200] + "..." if len(text) > 200 else text,
                "published_date": post_date.isoformat(),
                "image_url": image_url,
            })

        print(f"Scraped {len(articles)} articles from Reddit")

    except Exception as e:
        print(f"Error scraping Reddit: {e}")

    payload = {"articles": articles}
    print(json.dumps(payload, indent=2))
    return payload


@app.local_entrypoint()
def main():
    result = scrape_articles.remote()
    print(f"Done! Got {len(result['articles'])} articles.")
