# Feature Requests

Tracking ideas and enhancements for future builds.

---

## Nutritionix API Integration

**Priority:** Nice-to-have
**Area:** Meal Logging / Nutrition Tracking

Currently, nutrition estimation for logged meals uses the Perplexity API (LLM-based). A future enhancement would be integrating the [Nutritionix API](https://www.nutritionix.com/business/api) for more accurate, structured nutrition data.

**Why Nutritionix:**
- Purpose-built nutrition database with 1M+ food items
- Natural language endpoint — accepts freeform text like "chicken, broccoli, rice-a-roni" and returns per-item nutrition breakdowns
- More reliable calorie/macro data than LLM estimation
- Free tier available (up to 50 requests/day for development)

**Integration points:**
- Replace or supplement Perplexity nutrition estimation in meal log
- Could also enhance meal plan nutrition data (supplement recipe scraping)
- `/v2/natural/nutrients` endpoint accepts the same freeform text format we already use

**Notes:**
- Requires API key (sign up at developer.nutritionix.com)
- Consider using as primary source with Perplexity as fallback, or vice versa
- Evaluate free tier limits vs usage patterns before committing

---
