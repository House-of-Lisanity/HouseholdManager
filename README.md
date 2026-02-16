# Complete Weekly Planner

A comprehensive Next.js application for life planning that combines meal planning, workout scheduling, task management, and time blocking - all optimized for someone 10 years post-gastric bypass.

## What's New in This Version

This is the **complete version** that combines:
1. ✅ Original meal planning with Tovala integration
2. ✅ Pantry inventory management
3. ✅ **NEW: Weekly focus areas** (Must-dos, hobbies, weekend projects, chores)
4. ✅ **NEW: Time blocking** with dynamic schedule generation
5. ✅ **NEW: Gym sessions** with specific times
6. ✅ **NEW: One-off items** (meetings, appointments, events)
7. ✅ **NEW: Recurring items** (persisted across weeks)
8. ✅ **NEW: Custom meals** with recipe links
9. ✅ **NEW: Buffer rules** around activities
10. ✅ **NEW: Locations** with drive times
11. ✅ **NEW: Editable outputs** (all results can be modified)

## Key Features

### Weekly Planning
- **Must-Do Goals**: 3 critical items to accomplish this week
- **Hobbies**: 3 hobbies to spend at least 1 hour on
- **Weekend Projects**: 2-3 major projects for Saturday/Sunday
- **Weekly Chores**: 3 chores to distribute across the week

### Scheduling
- **Work Schedule**: Define weekday work hours
- **Gym Sessions**: Add specific gym times for each day (one per day)
- **One-Off Items**: Meetings, appointments, events with exact times
- **Recurring Items**: Saved meetings and chores (persist across weeks)
- **Buffer Rules**: Automatic time buffers around gym, events, appointments
- **Locations**: Define places with drive times

### Meals
- **Tovala Dinners**: 4 fixed dinners per week
- **Pantry Inventory**: Track what you have, prioritize expiring items
- **Custom Meals**: Add your own recipes with ingredient lists
- **Shopping List**: Automatically generated from pantry + custom meals

### Output Format
- **Daily Time Blocks**: Dynamic schedule based on your anchors
- **Big Rocks**: Daily priorities assigned from weekly goals
- **Chores**: Distributed across the week
- **Hobbies**: Scheduled in available time
- **Meals & Snacks**: Complete daily nutrition plan
- **Shopping List**: "From Pantry" vs "To Buy"
- **Everything Editable**: Modify any field in the results

## Installation

```bash
cd weekly-planner-complete
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How It Works

### 1. Input Phase

**Week & Focus:**
- Set the week date
- Define work hours (e.g., 6:30 AM - 3:30 PM)
- List 3 must-do goals
- List 3 hobbies (1 hour minimum each)
- List 2-3 weekend projects
- List 3 weekly chores

**Gym Sessions:**
- Add gym times for specific days
- One session per day (e.g., "Monday 4-5 PM Lifting")
- System applies 30 min before / 15 min after buffers

**Pantry:**
- Add items with categories, quantities, expiration
- Persists across weeks in localStorage

**Tovala Meals:**
- Enter 4 dinners (Monday, Wednesday, Friday, Sunday)

**Custom Meals:**
- Add your own recipes
- Specify preferred day or "Any day"
- List ingredients (comma-separated)
- System fuzzy-matches against pantry

### 2. LLM Processing

The system builds a comprehensive prompt that includes:
- All your weekly focus items
- Fixed schedule anchors (work, gym, meetings, events)
- Buffer rules and drive times
- Pantry inventory
- Custom meal requirements

The LLM then:
1. Creates dynamic time blocks for each day
2. Assigns big rocks, chores, hobbies to available blocks
3. Plans meals using pantry-first approach
4. Generates shopping list for missing items
5. Respects all buffers and constraints

### 3. Output Phase

**Per-Day Schedule:**
- Time blocks showing work, gym, events, flex time
- Big rocks assigned for that day
- Chores assigned for that day
- Hobby assigned (if applicable)

**Per-Day Meals:**
- Breakfast (high protein)
- Lunch (pantry or leftovers)
- Dinner (Tovala, custom, or simple)
- Snacks (high protein)

**Shopping List:**
- FROM PANTRY: Items you're using
- TO BUY: Items you need (grouped by category)

**All Editable:**
- Every time block description
- Every big rock
- Every meal
- Every shopping list item

## Project Structure

```
weekly-planner-complete/
├── app/
│   ├── api/
│   │   └── weekly-plan/
│   │       └── route.ts          # API endpoint
│   ├── globals.css                # All styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main form
├── components/
│   └── PlanResults.tsx            # Results display with editing
├── lib/
│   ├── ingredient-matcher.ts      # Fuzzy matching for pantry
│   ├── llm-client.ts              # LLM integration
│   ├── prompt-builder.ts          # Comprehensive prompt
│   ├── storage.ts                 # localStorage utilities
│   └── template.ts                # Meal template data
├── types/
│   └── index.ts                   # All TypeScript types
└── [config files]
```

## Data Persistence

### What Persists (localStorage):
- ✅ Pantry items
- ✅ Recurring meetings
- ✅ Recurring chores
- ✅ Buffer rules
- ✅ Locations

### What Doesn't Persist:
- ❌ Weekly focus (must-dos, hobbies, projects, chores)
- ❌ Gym sessions (set fresh each week)
- ❌ One-off items
- ❌ Custom meals
- ❌ Tovala meals

This design lets you reuse pantry and recurring items while refreshing weekly plans.

## Connecting to Perplexity

Open `lib/llm-client.ts` and replace the mock function:

```typescript
export async function generatePlanFromLLM(prompt: string): Promise<string> {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}
```

Create `.env.local`:
```
PERPLEXITY_API_KEY=your_key_here
```

## Example Workflow

**Monday morning:**
1. Open the planner
2. Set week date
3. Define must-dos: "Quarterly report", "Review proposals", "Budget review"
4. Define hobbies: "Photography", "Reading", "Gardening"
5. Define weekend projects: "Organize garage", "Meal prep"
6. Define chores: "Laundry", "Vacuum", "Grocery shopping"
7. Add gym sessions with times
8. Add one-off appointment: "Thursday 10-11 AM Physical therapy"
9. Check recurring items that apply this week
10. Update pantry (chicken expires in 3 days)
11. Add custom meal: "Chicken and rice" for Thursday
12. Enter Tovala meals
13. Click "Generate Weekly Plan"

**Result:**
- Complete schedule for 7 days
- Chicken used Tuesday (before expiration)
- Custom meal Thursday with recipe link
- Big rocks distributed across week
- Chores scheduled in available blocks
- Hobbies fit into evening/weekend slots
- Shopping list shows: FROM PANTRY (chicken, yogurt, etc.) and TO BUY (rice, potatoes)

**Edit as needed:**
- Swap Tuesday's time blocks
- Change a meal
- Move a chore to different day
- Adjust shopping quantities

## Buffer Rules

Default buffers (editable):
- **Gym**: 30 min before, 15 min after
- **Event (Nuggets game)**: 2 hours before, 30 min after
- **Appointment**: 15 min before, 15 min after

LLM won't schedule chores/hobbies in these buffer zones.

## Custom Meals & Pantry Matching

**Example:**
```
Custom Meal: "Chicken and rice"
Ingredients: "chicken breast, rice, olive oil, garlic"
Pantry: "Chicken breast (1 lb)", "Greek yogurt", "Almonds"

Result:
  FROM PANTRY: "chicken breast (fuzzy matched)"
  TO BUY: "rice, olive oil, garlic"
```

The fuzzy matcher handles variations:
- "chicken breast" matches "chicken"
- "Greek yogurt" matches "yogurt"
- Case-insensitive
- Partial word matching

## Editable Outputs

All results render in input fields or textareas:
- Click any field to edit
- Changes are local only (not saved to database)
- Copy/paste friendly
- Export-ready

## TypeScript

Strongly typed throughout:
- `WeeklyFormInput` - All form data
- `WeeklyPlanResult` - Complete output
- `DaySchedule` - Time blocks + assignments
- `DayMeals` - Nutrition for one day
- `ShoppingListSection` - Categorized items
- Plus 10+ more interfaces

## Future Enhancements

Possible additions:
- Save/load weekly plans
- Export to calendar (iCal)
- Print-friendly view
- Mobile app version
- Sharing with household
- Template weeks
- Analytics (protein tracking, time usage)

## License

Private use only.
