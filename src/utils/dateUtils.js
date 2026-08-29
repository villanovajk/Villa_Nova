// Shared date helpers so the booking flow always uses the real current date
// instead of a hardcoded baseline.

/**
 * Returns today's date as a "YYYY-MM-DD" string in the visitor's local time,
 * suitable for use as a native <input type="date" min="..."> value.
 */
export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
