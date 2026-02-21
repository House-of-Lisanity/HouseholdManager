/** Grid math and color categorization for the calendar time grid. */

const GRID_START_HOUR = 6; // 6 AM
const GRID_END_HOUR = 22; // 10 PM
const SLOTS_PER_HOUR = 2; // 30-min granularity

/**
 * Converts "HH:MM" time to a 1-based CSS grid row number.
 * Row 1 = day header; row 2 = 6:00 AM slot.
 */
export function timeToRow(time: string): number {
  const [h, m] = time.split(":").map(Number);
  const totalSlots = (h - GRID_START_HOUR) * SLOTS_PER_HOUR + Math.floor(m / 30);
  return totalSlots + 2; // +1 for header row, +1 for 1-based indexing
}

/** Number of 30-min rows a block spans. Minimum 1. */
export function timeBlockSpan(start: string, end: string): number {
  return Math.max(1, timeToRow(end) - timeToRow(start));
}

/** Hour labels for the time gutter: ["6 AM", "7 AM", ..., "9 PM"]. */
export function getHourLabels(): string[] {
  const labels: string[] = [];
  for (let h = GRID_START_HOUR; h < GRID_END_HOUR; h++) {
    const display = h % 12 || 12;
    const ampm = h >= 12 ? "PM" : "AM";
    labels.push(`${display} ${ampm}`);
  }
  return labels;
}

/** Total number of 30-min rows in the grid (excluding the header row). */
export const TOTAL_SLOTS = (GRID_END_HOUR - GRID_START_HOUR) * SLOTS_PER_HOUR;

export type BlockCategory =
  | "work"
  | "exercise"
  | "meal"
  | "errand"
  | "routine"
  | "default";

const CATEGORY_KEYWORDS: Record<Exclude<BlockCategory, "default">, string[]> = {
  work: ["work", "meeting", "client", "report", "proposal", "focus", "project"],
  exercise: [
    "gym", "crossfit", "wod", "lifting", "cardio", "stretching",
    "foam rolling", "workout", "yoga",
  ],
  meal: ["breakfast", "lunch", "dinner", "meal prep", "snack", "coffee"],
  errand: [
    "grocery", "shopping", "errands", "hardware", "store",
    "pick up", "drop off",
  ],
  routine: ["morning routine", "walk", "free time", "read", "crochet"],
};

/** Categorize a time block description by keyword matching. */
export function categorizeBlock(description: string): BlockCategory {
  const lower = description.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category as BlockCategory;
    }
  }
  return "default";
}

/** CSS class for a block category, e.g. "cal-block--work". */
export function categoryClass(category: BlockCategory): string {
  return `cal-block--${category}`;
}
