# Scraper Standard Operating Procedure

## Purpose
Define the deterministic rules for all Layer 3 scrappers.

## Rules
1. **Time Constraint**: Only retrieve articles/posts published within the last 24 hours.
2. **Data Structure**: Must conform strictly to the Gemini JSON Data schema.
   Required fields: `id`, `source`, `title`, `url`, `summary`, `published_date`, `image_url`
3. **Error Handling**: Scrapers must use `try-except` blocks. If an API is unreachable, log the error and return an empty list rather than crashing the system.
4. **Execution**: All individual scrapers should export a `scrape()` function returning a list of dictionaries.

## Additions
* Target subreddits: `r/artificial`
* Target newsletters: Ben's Bytes, AI Rundown (to be mocked/implemented via respective methods)
