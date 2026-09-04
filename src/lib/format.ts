const dateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatEventDate(date: Date) {
  return dateFmt.format(date);
}

export function formatEventTime(date: Date) {
  return timeFmt.format(date);
}

export function formatTimeRange(start: Date, end: Date | null) {
  if (!end) return formatEventTime(start);
  return `${formatEventTime(start)}–${formatEventTime(end)}`;
}
