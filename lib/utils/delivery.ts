const TZ = "America/Winnipeg";

export function getNowInWinnipeg(): Date {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "0";
  return new Date(
    parseInt(get("year")),
    parseInt(get("month")) - 1,
    parseInt(get("day")),
    parseInt(get("hour")),
    parseInt(get("minute")),
    parseInt(get("second"))
  );
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDateLabel(date: Date): string {
  const today = getNowInWinnipeg();
  if (isSameDay(date, today)) return "Today";
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (isSameDay(date, tomorrow)) return "Tomorrow";
  return date.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export interface DeliveryWindow {
  scheduleId: number;
  dayOfWeek: number;
  windowStart: string;
  windowEnd: string;
  label: string;
  date: Date;
  dateLabel: string;
  isPast: boolean;
}

interface RawSchedule {
  id: number;
  dayOfWeek: number;
  windowStart: string | null;
  windowEnd: string | null;
}

export function getAvailableWindows(
  schedules: RawSchedule[],
  options?: { bypassCutoff?: boolean }
): DeliveryWindow[] {
  const now = getNowInWinnipeg();
  const windows: DeliveryWindow[] = [];

  for (let offset = 0; offset <= 1; offset++) {
    const date = new Date(now);
    date.setDate(now.getDate() + offset);
    date.setHours(0, 0, 0, 0);
    const dow = date.getDay();

    const daySchedules = schedules.filter((s) => s.dayOfWeek === dow);

    for (const s of daySchedules) {
      const start = s.windowStart ?? "00:00";
      const end = s.windowEnd ?? "23:59";
      const [h, m] = start.split(":").map(Number);
      const windowStartTime = new Date(date);
      windowStartTime.setHours(h, m, 0, 0);
      const isPast = !options?.bypassCutoff && offset === 0 && now >= windowStartTime;

      windows.push({
        scheduleId: s.id,
        dayOfWeek: dow,
        windowStart: start,
        windowEnd: end,
        label: `${start} – ${end}`,
        date: new Date(date),
        dateLabel: formatDateLabel(date),
        isPast,
      });
    }
  }

  return windows;
}
