const weekdayFormatter = new Intl.DateTimeFormat("id-ID", { weekday: "long" });

function normalizeWeekday(label) {
  if (!label) return "";
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatIsoDateId(isoDate, { withWeekday = false } = {}) {
  if (typeof isoDate !== "string") {
    return isoDate ?? "";
  }

  const trimmed = isoDate.trim();
  if (!trimmed) {
    return isoDate;
  }

  const parts = trimmed.split("-");
  if (parts.length !== 3) {
    return isoDate;
  }

  const [year, month, day] = parts;
  if (!year || !month || !day) {
    return isoDate;
  }

  const formatted = `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;

  if (!withWeekday) {
    return formatted;
  }

  const date = new Date(`${trimmed}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return formatted;
  }

  const weekday = normalizeWeekday(weekdayFormatter.format(date));
  return weekday ? `${weekday}, ${formatted}` : formatted;
}
