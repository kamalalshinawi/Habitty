export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isToday(date: string | Date): boolean {
  const dateKey = typeof date === 'string' ? date : formatDateKey(date);
  return formatDateKey(new Date()) === dateKey;
}

export function isFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return target.getTime() > today.getTime();
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

export function getCurrentWeekDays(now = new Date()): { date: Date; dateKey: string; dayName: string; dayNumber: number }[] {
  const days: { date: Date; dateKey: string; dayName: string; dayNumber: number }[] = [];
  const start = new Date(now);
  // Start from Monday (standard weekly calendar view)
  const dayOfWeek = start.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  start.setDate(start.getDate() + diffToMonday);

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      date: d,
      dateKey: formatDateKey(d),
      dayName: dayLabels[i],
      dayNumber: d.getDate(),
    });
  }
  return days;
}

export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
}

export function getCalendarGridDays(
  year: number,
  month: number
): { date: Date; dateKey: string; isCurrentMonth: boolean; isToday: boolean; isFuture: boolean }[] {
  const days: { date: Date; dateKey: string; isCurrentMonth: boolean; isToday: boolean; isFuture: boolean }[] = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Leading days from previous month
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevDate = new Date(firstDayOfMonth);
    prevDate.setDate(prevDate.getDate() - (firstDayOfWeek - i));
    days.push({
      date: prevDate,
      dateKey: formatDateKey(prevDate),
      isCurrentMonth: false,
      isToday: isToday(prevDate),
      isFuture: isFutureDate(prevDate),
    });
  }

  // Days in current month
  for (let d = new Date(firstDayOfMonth); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
    const curDate = new Date(d);
    days.push({
      date: curDate,
      dateKey: formatDateKey(curDate),
      isCurrentMonth: true,
      isToday: isToday(curDate),
      isFuture: isFutureDate(curDate),
    });
  }

  // Trailing days from next month to fill grid rows (multiples of 7, up to 35 or 42 cells)
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const nextDate = new Date(lastDayOfMonth);
    nextDate.setDate(nextDate.getDate() + i);
    days.push({
      date: nextDate,
      dateKey: formatDateKey(nextDate),
      isCurrentMonth: false,
      isToday: isToday(nextDate),
      isFuture: isFutureDate(nextDate),
    });
  }

  return days;
}
