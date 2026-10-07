/** Calendar-day helpers. Days travel as "YYYY-MM-DD" strings (what <input type="date"> used to give us), in local time. */

const pad = (n: number) => String(n).padStart(2, "0");

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

/** The local Date for a "YYYY-MM-DD" key (not UTC midnight, which can land on the previous day). */
export function parseDateKey(key: string): Date {
  const [y, m, d] = key.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Whole days from today to a day key; 0 is today, negative is in the past. */
export function daysUntil(key: string): number {
  const target = parseDateKey(key);
  const today = parseDateKey(todayKey());
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
