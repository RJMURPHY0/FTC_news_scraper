# Gemini - Project Law

## Data Schema (Payload Shape)
```json
{
  "articles": [
    {
      "id": "string (unique identifier)",
      "source": "string (e.g., 'Ben's Bytes', 'The AI Rundown', 'Reddit')",
      "title": "string",
      "url": "string",
      "summary": "string (brief description of the article)",
      "published_date": "string (ISO-8601 timestamp)",
      "image_url": "string (optional, path or url to thumbnail)"
    }
  ]
}
```

## System Rules
- **Aesthetics First:** The dashboard UI must be gorgeous, interactive, and visually stunning.
- **Local First (For Now):** Article saving functionality uses local storage initially before Supabase integration.
- **Scraping Restraints:** Scrape only articles published within the last 24 hours. Scrapers must be modular in Layer 3 (`tools/`).

## Maintenance Log
(To be defined during deployment)
