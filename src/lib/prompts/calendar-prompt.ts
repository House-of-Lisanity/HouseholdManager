import { CalendarFormInput, UserProfile } from "@/types";
import { formatOneOffItems, formatRecurringItems } from "./format-helpers";

function formatEventNights(
  eventNights: CalendarFormInput["eventNights"]
): string {
  const active = eventNights.filter((e) => e.isEvent);
  if (active.length === 0) return "No event nights this week.";

  return active
    .map((e) => `- ${e.day}: ${e.drinkNote || "Event night"}`)
    .join("\n");
}

export function buildCalendarPrompt(
  formData: CalendarFormInput,
  profile: UserProfile
): string {
  const oneOffText = formatOneOffItems(formData.oneOffItems);
  const recurringText = formatRecurringItems(formData.recurringItems);
  const eventNightsText = formatEventNights(formData.eventNights);

  const bufferText = profile.bufferRules
    .map(
      (b) =>
        `- ${b.activityType}: ${b.minutesBefore} min before, ${b.minutesAfter} min after`
    )
    .join("\n");

  const allLocations = [
    ...(profile.homeAddress ? [{ name: "Home", address: profile.homeAddress }] : []),
    ...(profile.workAddress ? [{ name: "Work", address: profile.workAddress }] : []),
    ...profile.locations.filter((l) => l.name && l.address),
  ];
  const locationsText = allLocations
    .map((l) => `- ${l.name}: ${l.address}`)
    .join("\n");

  return `You are a weekly calendar planning assistant. Create a realistic, balanced weekly schedule.

USER CONTEXT:
- Timezone: ${profile.timezone || "America/Denver"}
- Works ${profile.workStartTime} to ${profile.workEndTime} on weekdays
- Wake time: ${profile.wakeTime}
- Bed time: ${profile.bedTime}
- Active lifestyle: lifts heavy weights and does CrossFit 5+ days/week
${profile.schedulingPreferences ? `\nSCHEDULING PREFERENCES (follow these rules strictly):\n${profile.schedulingPreferences}\n` : ""}
CALENDAR REQUEST:
Week of: ${formData.weekOf}

${formData.weeklyNotes ? `WEEKLY NOTES:\n${formData.weeklyNotes}\n` : ""}
===== FIXED SCHEDULE (ANCHORS) =====

WORK SCHEDULE:
Monday-Friday: ${profile.workStartTime} - ${profile.workEndTime}
${formData.workFromHomeDays.length > 0 ? `Work from home: ${formData.workFromHomeDays.join(", ")}\nWork from office: ${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].filter((d) => !formData.workFromHomeDays.includes(d)).join(", ") || "None"}` : "Works from office every day"}

ONE-OFF ITEMS THIS WEEK:
${oneOffText}

RECURRING ITEMS THIS WEEK:
${recurringText}

EVENT NIGHTS:
${eventNightsText}

===== AWARENESS RULES (do NOT create blocks for these) =====

BUFFER TIMES — account for these when scheduling, but do NOT show them as time blocks:
${bufferText}

LOCATIONS — estimate realistic drive times between these addresses; factor into scheduling but do NOT create time blocks for travel:
${locationsText || "No locations provided."}

MEALS — do NOT schedule meal blocks. Meals are managed separately.

===== INSTRUCTIONS =====

1. ONLY SCHEDULE ACTIONABLE BLOCKS:
   - Work, gym sessions, appointments, events, and meetings are FIXED ANCHORS — show these
   - Chores and tasks assigned for the day — show these
   - Do NOT create blocks for: meals, commute/drive time, rest, flex time, morning routine, wind-down, or buffer zones
   - Unscheduled time IS the flex time — leave gaps open rather than labeling them
   - Fewer blocks is better. A day with 3-5 blocks is ideal.

2. SCHEDULING AWARENESS:
   - Use buffer times and drive times to determine WHEN things can be scheduled, but don't show them
   - Don't schedule tasks during buffer zones or overlapping with drive times
   - Respect wake/bed times as boundaries

3. BIG ROCKS ASSIGNMENT:
   For each day, assign:
   - 1-3 "Big Rocks" — the most important tasks or goals for that day
   - 0-2 chores
   - 0-1 hobby

OUTPUT FORMAT:
Return a JSON object with this exact structure:

{
  "weekOf": "${formData.weekOf}",
  "strategyNotes": "2-3 sentences about the weekly approach and key priorities",
  "dailySchedules": [
    {
      "day": "Sunday",
      "timeBlocks": [
        { "startTime": "10:00", "endTime": "12:00", "description": "Gym: CrossFit", "shortLabel": "Gym" }
      ],
      "bigRocks": ["Important task 1", "Important task 2"],
      "choresAssigned": ["Chore if applicable"],
      "hobbyAssigned": "Hobby name or empty string"
    }
  ]
}

Include all 7 days (Sunday through Saturday) in dailySchedules.

IMPORTANT:
- Only include blocks for things the user actually needs to DO or ATTEND
- Each timeBlock must include startTime, endTime, description, and shortLabel (1-2 words)
- Keep it sparse — open gaps are intentional breathing room

Return ONLY the JSON object, no other text.`;
}
