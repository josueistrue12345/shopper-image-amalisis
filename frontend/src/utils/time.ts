export function getDate(d?: string) {
  if (!d) {
    return "";
  }
  return new Date(d).toLocaleString("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });
}
