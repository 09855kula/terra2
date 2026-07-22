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

// "10:00" -> "10:00 AM", "18:00" -> "6:00 PM"
export function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export interface DeliveryWindow {
  dayOfWeek: number;
  windowStart: string;
  windowEnd: string;
  label: string;
  date: Date;
  dateLabel: string;
  isPast: boolean;
}

// A day has exactly one delivery window — weekday evenings, weekend midday.
// Hardcoded business rule ("for now", per Travis) rather than driven by
// deliverySchedules, which is per-driver/per-district and stays that way for
// admin/driver-routing purposes — it just no longer determines what a
// customer can pick.
function windowForDate(date: Date): { start: string; end: string } {
  const dow = date.getDay();
  const isWeekend = dow === 0 || dow === 6;
  return isWeekend ? { start: "12:00", end: "15:00" } : { start: "18:00", end: "21:00" };
}

export function getAvailableWindows(options?: { bypassCutoff?: boolean }): DeliveryWindow[] {
  const now = getNowInWinnipeg();
  const windows: DeliveryWindow[] = [];

  for (let offset = 0; offset <= 1; offset++) {
    const date = new Date(now);
    date.setDate(now.getDate() + offset);
    date.setHours(0, 0, 0, 0);

    const { start, end } = windowForDate(date);
    const [h, m] = start.split(":").map(Number);
    const windowStartTime = new Date(date);
    windowStartTime.setHours(h, m, 0, 0);
    const isPast = !options?.bypassCutoff && offset === 0 && now >= windowStartTime;

    windows.push({
      dayOfWeek: date.getDay(),
      windowStart: start,
      windowEnd: end,
      label: `${formatTime12h(start)} – ${formatTime12h(end)}`,
      date: new Date(date),
      dateLabel: formatDateLabel(date),
      isPast,
    });
  }

  return windows;
}
