/**
 * Converts 24-hour time string (e.g. "14:30") to 12-hour format (e.g. "2:30 PM").
 * Returns the original string if it doesn't match the expected pattern.
 */
export function formatTo12Hour(time: string): string {
  return time.replace(
    /(\d{1,2}):(\d{2})/,
    (_match, hours, minutes) => {
      const h = parseInt(hours);
      const ampm = h >= 12 ? "PM" : "AM";
      const displayHour = h % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    }
  );
}
