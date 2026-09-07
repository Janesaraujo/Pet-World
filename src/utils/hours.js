import dayjs from "../libs/dayjs.js";
import { PERIODS } from "./opening-hours.js";

/** "09:30" -> 570 */
export function timeToMinutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

/** 570 -> "09:30" */
export function minutesToTime(minutes) {
  const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
  const minute = String(minutes % 60).padStart(2, "0");
  return `${hour}:${minute}`;
}

/** Returns the period for a given hour, or null if it's outside business hours. */
export function getPeriodForHour(hour) {
  if (!/^\d{2}:\d{2}$/.test(hour ?? "")) return null;

  const minutes = timeToMinutes(hour);

  return (
    PERIODS.find(
      (period) =>
        minutes >= timeToMinutes(period.start) &&
        minutes <= timeToMinutes(period.end)
    ) ?? null
  );
}

/**
 * Has the hour already passed?
 * Compares the full date + time against now, so 09:30 today at 09:45
 * counts as past (not just the current hour).
 */
export function isHourPast({ date, hour }) {
  if (!date || !hour) return false;
  return dayjs(`${date}T${hour}`).isBefore(dayjs());
}

/** Sorts schedules by hour ("HH:MM" already sorts correctly as a string). */
export function sortByHour(schedules) {
  return [...schedules].sort((a, b) => a.hour.localeCompare(b.hour));
}

export function formatTimeLocale(hour, locale = navigator.language) {
  const [h, m] = hour.split(":").map(Number);
  const time = new Date(2000, 0, 1, h, m);

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(time);
}

/**
 * Same as formatTimeLocale, but drops the AM/PM (or other locale's day
 * period) marker — for places already grouped under a Morning/Afternoon/
 * Evening header, where the marker would just repeat what the section
 * already says. Uses formatToParts so it works for any locale, not just
 * ones that spell it "AM"/"PM". Hour has no leading zero ("2:30", not
 * "02:30") — the minute still does, so it doesn't read as seconds.
 */
export function formatTimeGrouped(hour, locale = navigator.language) {
  const [h, m] = hour.split(":").map(Number);
  const time = new Date(2000, 0, 1, h, m);

  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" })
    .formatToParts(time)
    .filter((part) => part.type !== "dayPeriod")
    .map((part) => part.value)
    .join("")
    .trim();
}
