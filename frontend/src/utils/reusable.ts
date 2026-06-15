export function formatTime(iso: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const result = new Date(iso).toLocaleString("pl-PL", options);
  return result;
}
