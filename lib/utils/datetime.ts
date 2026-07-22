export function formatDateTime(value: string | Date | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
