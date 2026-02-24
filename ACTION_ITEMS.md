# Action Items — v1 Build (On Hold)

Items discussed and committed to during planning but not yet implemented.

---

## Calendar Page Refactor

The calendar page currently has manual text fields that need to be replaced with data from the To Do list and Recurring Items.

**Fields to remove:**
- `mustDo1`, `mustDo2`, `mustDo3` → replaced by to-dos tagged "Must Do"
- `hobby1`, `hobby2`, `hobby3` → replaced by to-dos tagged "Want To"
- `weekendProject1/2/3` + duration dropdowns → replaced by tagged projects with `weeklyHoursMax`
- `chore1`, `chore2`, `chore3` → replaced by due Recurring Items

**Fields that stay as-is:**
- Gym sessions section
- Events section
- Schedule conflicts/notes textarea
- Week navigation

**New behavior:**
- Calendar page pulls tagged to-dos for the current week (must/want/if-time)
- Calendar page pulls due recurring items based on frequency + lastCompletedDate
- No manual entry of tasks — user tags items on the To Do page, calendar consumes them

---

## AI Generation Endpoints (All Stubbed as 503)

### 1. Calendar Generation — `/api/generate/calendar`
- **Workout scheduled times (startTime/endTime) must be treated as fixed appointments** — the AI should schedule around them, never move or overlap them
- Receives tagged to-dos (with priorities) + due recurring items + gym sessions + events + profile data
- AI estimates time duration for tasks that don't have user-set hours (one API call for all items)
- Respects `weeklyHoursMax` cap for projects (user sets this, AI obeys it)
- Groups errands by location (Level 1: LLM-based clustering, no external API)
- Considers proximity for scheduling (e.g., grocery store near gym → schedule grocery trip after gym)
- Outputs time-blocked daily schedule

### 2. Meal Plan Generation — `/api/generate/meals`
- Takes meal preferences + dietary needs + pantry from profile
- Generates meal suggestions that fit nutrition targets
- Outputs shopping list: items from pantry vs. items to buy

### 3. Workout Plan Generation — `/api/generate/workouts`
- Takes workout preferences + weekly focus areas
- Generates workouts for non-gym days (home workouts based on available equipment)
- Should reference a curated exercise library to avoid hallucinated exercises

### 4. Nutrition Estimation — `/api/estimate-nutrition`
- Takes freeform ingredient list (e.g., "chicken, broccoli, rice-a-roni")
- AI estimates calories, protein, carbs, fat
- Fallback for when nutrition label parser doesn't find structured data

---

## Recipe Scraper → Meals Page Wiring

- `/api/parse-recipe` route exists and calls `scrapeRecipe()`
- Needs to be wired into the Meals page UI (paste URL → auto-populate meal entry fields)

---

## Shopping List

- Discussed as output of meal plan AI generation
- Compare recipe ingredients against pantry inventory
- Output: "from pantry" list + "to buy" list
- May need its own UI section or page to display results
