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

  const locationsText = profile.locations
    .map((l) => `- ${l.name}: ${l.driveTimeMinutes} min drive`)
    .join("\n");

  return `You are a weekly calendar planning assistant. Create a realistic, balanced weekly schedule.

USER CONTEXT:
- Works ${profile.workStartTime} to ${profile.workEndTime} on weekdays
- Wake time: ${profile.wakeTime}
- Bed time: ${profile.bedTime}
- Active lifestyle: lifts heavy weights and does CrossFit 5+ days/week
- Post-gastric bypass: needs structured meal times for small, frequent portions

CALENDAR REQUEST:
Week of: ${formData.weekOf}

${formData.weeklyNotes ? `WEEKLY NOTES:\n${formData.weeklyNotes}\n` : ""}
===== FIXED SCHEDULE (ANCHORS) =====

WORK SCHEDULE:
Monday-Friday: ${profile.workStartTime} - ${profile.workEndTime}

ONE-OFF ITEMS THIS WEEK:
${oneOffText}

RECURRING ITEMS THIS WEEK:
${recurringText}

EVENT NIGHTS:
${eventNightsText}

===== BUFFER RULES =====

Apply these time buffers around scheduled activities (don't schedule tasks in buffer zones):
${bufferText}

LOCATIONS & DRIVE TIMES:
${locationsText}

===== INSTRUCTIONS =====

1. TIME BLOCKING STRATEGY:
   - Treat work schedule, gym sessions, meetings, appointments, and events as FIXED ANCHORS
   - Generate dynamic time blocks for each day based on these anchors
   - Leave some blocks as "flex" or blank — NOT everything needs to be scheduled
   - Respect buffer times around gym, events, and appointments
   - Account for drive times to/from locations
   - Don't over-schedule — leave breathing room

2. DAILY SCHEDULE STRUCTURE:
   For each day, create time blocks that show:
   - Work blocks (based on work schedule)
   - Gym blocks (with buffers before/after)
   - Meeting/appointment/event blocks (with buffers)
   - "Flex / Chores / Hobby" blocks for available time
   - Some completely blank blocks (don't over-schedule)

3. BIG ROCKS ASSIGNMENT:
   For each day, assign:
   - 1-3 "Big Rocks" — the most important tasks or goals for that day
   - 0-2 chores
   - 0-1 hobby that fits available time blocks

OUTPUT FORMAT:
Return a JSON object with this exact structure:

{
  "weekOf": "${formData.weekOf}",
  "strategyNotes": "2-3 sentences about the weekly approach, key priorities, and how the schedule balances",
  "dailySchedules": [
    {
      "day": "Sunday",
      "timeBlocks": [
        { "startTime": "6:30", "endTime": "10:00", "description": "Morning routine + breakfast", "shortLabel": "Morning" },
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
- Generate realistic time blocks based on actual schedule anchors
- Respect all buffer times and drive times
- Balance workout intensity with rest days
- Consider travel time for events/appointments
- Each timeBlock must include startTime, endTime, description, and shortLabel (a brief 1-2 word label)

Return ONLY the JSON object, no other text.`;
}
