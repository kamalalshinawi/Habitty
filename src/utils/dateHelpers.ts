export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getWeekDates(now = new Date()): string[] {
  const dates: string[] = [];
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(formatDateKey(d));
  }
  return dates;
}

export function isToday(date: string): boolean {
  return formatDateKey(new Date()) === date;
}
