import {
  WeeklyFormInput,
  PantryItem,
  CustomMeal,
  GymSession,
  OneOffItem,
  RecurringItem,
} from "@/types";
import { WEEKLY_TEMPLATE } from "./template";
import { categorizeIngredients } from "./ingredient-matcher";

function formatPantryForPrompt(items: PantryItem[]): string {
  if (items.length === 0) {
    return "No pantry items specified.";
  }

  const categorized: Record<string, PantryItem[]> = {
    protein: [],
    dairy: [],
    produce: [],
    grains: [],
    snacks: [],
    condiments: [],
    frozen: [],
    other: [],
  };

  items.forEach((item) => {
    const category = item.category || "other";
    if (categorized[category]) {
      categorized[category].push(item);
    } else {
      categorized.other.push(item);
    }
  });

  let output = "";
  Object.entries(categorized).forEach(([category, categoryItems]) => {
    if (categoryItems.length > 0) {
      output += `\n${category.toUpperCase()}:\n`;
      categoryItems.forEach((item) => {
        let itemLine = `- ${item.name} (${item.quantity} ${item.unit})`;
        if (item.expiresInDays !== undefined && item.expiresInDays <= 7) {
          itemLine += ` - EXPIRES IN ${item.expiresInDays} DAYS - USE SOON`;
        }
        if (item.notes) {
          itemLine += ` - ${item.notes}`;
        }
        output += itemLine + "\n";
      });
    }
  });

  return output;
}

function formatCustomMeals(
  meals: CustomMeal[],
  pantryItems: PantryItem[]
): string {
  if (meals.length === 0) {
    return "No custom meals specified.";
  }

  let output = "";
  meals.forEach((meal) => {
    output += `\n${meal.mealName}:\n`;
    output += `  Preferred Day: ${meal.preferredDay}\n`;
    if (meal.recipeLink) {
      output += `  Recipe: ${meal.recipeLink}\n`;
    }

    const ingredientMatches = categorizeIngredients(
      meal.ingredientsList,
      pantryItems
    );
    const fromPantry = ingredientMatches.filter((m) => m.inPantry);
    const toBuy = ingredientMatches.filter((m) => !m.inPantry);

    if (fromPantry.length > 0) {
      output += `  From Pantry: ${fromPantry
        .map((m) => m.ingredient)
        .join(", ")}\n`;
    }
    if (toBuy.length > 0) {
      output += `  Need to Buy: ${toBuy.map((m) => m.ingredient).join(", ")}\n`;
    }
  });

  return output;
}

function formatGymSessions(sessions: GymSession[]): string {
  if (sessions.length === 0) {
    return "No gym sessions specified.";
  }

  const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let output = "";

  DAYS.forEach((day) => {
    const daySession = sessions.find((s) => s.day === day);
    if (daySession) {
      output += `${day}: ${daySession.startTime} - ${daySession.endTime}`;
      if (daySession.gymType) {
        output += ` (${daySession.gymType})`;
      }
      output += "\n";
    }
  });

  return output;
}

function formatOneOffItems(items: OneOffItem[]): string {
  if (items.length === 0) {
    return "No one-off items this week.";
  }

  const meetings = items.filter((i) => i.type === "meeting");
  const appointments = items.filter((i) => i.type === "appointment");
  const events = items.filter((i) => i.type === "event");

  let output = "";

  if (meetings.length > 0) {
    output += "\nMEETINGS:\n";
    meetings.forEach((m) => {
      output += `- ${m.day}: ${m.description} (${m.startTime} - ${m.endTime})\n`;
    });
  }

  if (appointments.length > 0) {
    output += "\nAPPOINTMENTS:\n";
    appointments.forEach((a) => {
      output += `- ${a.day}: ${a.description} (${a.startTime} - ${a.endTime})\n`;
    });
  }

  if (events.length > 0) {
    output += "\nEVENTS:\n";
    events.forEach((e) => {
      output += `- ${e.day}: ${e.description} (${e.startTime} - ${e.endTime})\n`;
    });
  }

  return output;
}

function formatRecurringItems(items: RecurringItem[]): string {
  const activeItems = items.filter((i) => i.includeThisWeek);

  if (activeItems.length === 0) {
    return "No recurring items this week.";
  }

  const meetings = activeItems.filter((i) => i.type === "meeting");
  const chores = activeItems.filter((i) => i.type === "chore");

  let output = "";

  if (meetings.length > 0) {
    output += "\nRECURRING MEETINGS:\n";
    meetings.forEach((m) => {
      output += `- ${m.day}: ${m.description}`;
      if (m.startTime && m.endTime) {
        output += ` (${m.startTime} - ${m.endTime})`;
      }
      output += "\n";
    });
  }

  if (chores.length > 0) {
    output += "\nRECURRING CHORES:\n";
    chores.forEach((c) => {
      output += `- ${c.description} (${c.day})\n`;
    });
  }

  return output;
}

export function buildPromptFromFormData(formData: WeeklyFormInput): string {
  const templateJSON = JSON.stringify(WEEKLY_TEMPLATE, null, 2);

  const tovalaMealsText = formData.tovalaMeals
    .map(
      (meal) =>
        `${meal.day}: ${meal.mealName} (${meal.protein}g protein, ${meal.calories} cal)`
    )
    .filter((text) => !text.includes(": (g protein,"))
    .join("\n");

  const pantryText = formatPantryForPrompt(formData.pantryItems);
  const customMealsText = formatCustomMeals(
    formData.customMeals,
    formData.pantryItems
  );
  const gymSessionsText = formatGymSessions(formData.gymSessions);
  const oneOffItemsText = formatOneOffItems(formData.oneOffItems);
  const recurringItemsText = formatRecurringItems(formData.recurringItems);

  const prompt = `You are a comprehensive weekly planning assistant for someone who is 10 years post-gastric bypass surgery. This person is 48 years old, in menopause, lifts heavy weights, and does CrossFit 5+ days per week. Their goal is to build muscle and lose fat.

CRITICAL CONTEXT:
- Post-gastric bypass: Small portions (2.5-4 oz protein per meal), high protein, minimal leftovers
- Protein target: ${formData.targetProtein}g per day
- Prefers salty/savory foods, low fruit/vegetable intake
- Has 1 alcoholic drink most days
- Works ${formData.workStartTime} to ${formData.workEndTime} on weekdays

WEEKLY PLAN REQUEST:
Week of: ${formData.weekOf}

===== WEEKLY FOCUS =====

MUST DO (3 goals for the week - schedule these in available time blocks):
1. ${formData.mustDo1 || "Not specified"}
2. ${formData.mustDo2 || "Not specified"}
3. ${formData.mustDo3 || "Not specified"}

HOBBIES (aim for at least 1 hour each this week):
1. ${formData.hobby1 || "Not specified"}
2. ${formData.hobby2 || "Not specified"}
3. ${formData.hobby3 || "Not specified"}

WEEKEND PROJECTS (Saturday/Sunday - several hours each):
1. ${formData.weekendProject1 || "Not specified"}
2. ${formData.weekendProject2 || "Not specified"}
3. ${formData.weekendProject3 || "Not specified"}

WEEKLY CHORES (distribute across the week):
1. ${formData.chore1 || "Not specified"}
2. ${formData.chore2 || "Not specified"}
3. ${formData.chore3 || "Not specified"}

===== FIXED SCHEDULE (ANCHORS) =====

WORK SCHEDULE:
Monday-Friday: ${formData.workStartTime} - ${formData.workEndTime}

GYM SESSIONS:
${gymSessionsText}

ONE-OFF ITEMS THIS WEEK:
${oneOffItemsText}

RECURRING ITEMS THIS WEEK:
${recurringItemsText}

===== BUFFER RULES =====

Apply these time buffers around scheduled activities (don't schedule chores/hobbies in buffer zones):
${formData.bufferRules
  .map(
    (b) =>
      `- ${b.activityType}: ${b.minutesBefore} min before, ${b.minutesAfter} min after`
  )
  .join("\n")}

LOCATIONS & DRIVE TIMES:
${formData.locations
  .map((l) => `- ${l.name}: ${l.driveTimeMinutes} min drive`)
  .join("\n")}

===== MEALS =====

FIXED TOVALA DINNERS:
${tovalaMealsText || "None specified"}

CUSTOM MEALS FOR THIS WEEK:
${customMealsText}

CURRENT PANTRY INVENTORY:
${pantryText}

MEAL TEMPLATE REFERENCE:
${templateJSON}

PREFERENCES THIS WEEK:
- Foods to avoid: ${formData.foodsToAvoid || "None"}
- Cravings/preferences: ${formData.cravingsPreferences || "None"}
- Schedule conflicts: ${formData.scheduleConflicts || "None"}

===== INSTRUCTIONS FOR GENERATING THE WEEKLY PLAN =====

1. TIME BLOCKING STRATEGY:
   - Treat work schedule, gym sessions, meetings, appointments, and events as FIXED ANCHORS
   - Generate dynamic time blocks for each day based on these anchors
   - Leave some blocks as "flex" or blank - NOT everything needs to be scheduled
   - Weave weekly goals, weekend projects, chores, and hobbies into OPEN blocks only
   - Respect buffer times around gym, events, and appointments
   - Account for drive times to/from locations

2. DAILY SCHEDULE STRUCTURE:
   For each day, create time blocks that show:
   - Work blocks (based on work schedule)
   - Gym blocks (with buffers before/after)
   - Meeting/appointment/event blocks (with buffers)
   - "Flex / Chores / Hobby" blocks for available time
   - Some completely blank blocks (don't over-schedule)

3. BIG ROCKS ASSIGNMENT:
   For each day, assign:
   - 1-3 "Big Rocks" from weekly Must Dos or weekend projects
   - 0-2 chores from the weekly chore list
   - 0-1 hobby that fits available time blocks

4. MEAL PLANNING:
   - Prioritize pantry items, especially those expiring soon
   - Use the exact Tovala meals listed - do NOT substitute or suggest different Tovala meals
   - Incorporate custom meals on preferred days (or any day if "Any day")
   - For other meals: EITHER use simple pantry-based meals (e.g., "1/2 cup cottage cheese + 1/4 cup almonds") with average nutritional values, OR search online for real recipes with actual links
   - When suggesting a recipe-based meal, include the recipe link in brackets: "Meal Name [recipe URL]"
   - Get protein/calorie counts from the actual recipe when possible, or use verified nutritional databases
   - All ingredients for suggested meals should appear in the shopping list (either "from pantry" or "to buy")
   - Meet daily protein target of ${formData.targetProtein}g
   - Consider post-workout protein timing (25-30g within 1-2 hours)

5. SHOPPING LIST:
   - FROM PANTRY: List pantry items that will be used in meals
   - TO BUY: List items needed for meals (including custom meal ingredients not in pantry)
   - Group items by category: protein, dairy, produce, grains, frozen, pantry staples, etc.

OUTPUT FORMAT:
Return a JSON object with this structure:

{
  "weekOf": "${formData.weekOf}",
  "proteinTarget": "${formData.targetProtein}g",
  "strategyNotes": "2-3 sentences about the weekly approach, key priorities, and how schedule/meals balance",
  
  "dailySchedules": [
    {
      "day": "Monday",
      "timeBlocks": [
        { "startTime": "6:30", "endTime": "10:00", "description": "Morning routine + breakfast" },
        { "startTime": "10:00", "endTime": "15:30", "description": "Work" },
        { "startTime": "16:00", "endTime": "17:00", "description": "Gym: Lifting" },
        { "startTime": "17:30", "endTime": "19:00", "description": "Flex / Dinner prep" },
        { "startTime": "19:00", "endTime": "21:00", "description": "Evening flex" }
      ],
      "bigRocks": ["Must do item 1", "Weekend project if applicable"],
      "choresAssigned": ["Chore 1 if fits"],
      "hobbyAssigned": "Hobby name or empty string"
    }
    // ... repeat for all 7 days
  ],
  
  "dailyMeals": [
    {
      "day": "Monday",
      "breakfast": "Specific breakfast with protein amount",
      "lunch": "Specific lunch with protein amount",
      "dinner": "Tovala meal name OR custom meal name + [Recipe Link] OR simple dinner",
      "snacks": "1-3 high-protein snacks with amounts"
    }
    // ... repeat for all 7 days
  ],
  
  "shoppingList": {
    "fromPantry": [
      {
        "category": "Protein",
        "items": ["Chicken breast (using 1 lb)", "Greek yogurt (6 cups)"]
      },
      {
        "category": "Dairy",
        "items": ["Cottage cheese (2 cups)"]
      }
    ],
    "toBuy": [
      {
        "category": "Protein",
        "items": ["Salmon fillet (4 oz)", "Ground beef (1 lb)"]
      },
      {
        "category": "Produce",
        "items": ["Asparagus (1 bunch)"]
      }
    ]
  }
}

IMPORTANT CONSTRAINTS:
- Generate realistic time blocks based on actual schedule anchors
- Don't over-schedule - leave breathing room
- Respect all buffer times
- Match custom meals to preferred days when possible
- Use fuzzy matching for pantry ingredients in custom meals
- Balance workout intensity with rest days
- Consider travel time for events/appointments
- When suggesting recipe-based meals, search for real recipes and include actual links
- Use verified nutritional information from recipes or databases - do NOT estimate wildly
- For simple meals (like "cottage cheese + fruit"), use standard USDA nutritional averages
- Ensure all meal ingredients appear in the shopping list appropriately



Return ONLY the JSON object, no other text.`;

  return prompt;
}
