/** Interval between offered time slots, in minutes. */
export const SLOT_MINUTES = 30;

/**
 * Pet shop's business hour windows. `start` and `end` are inclusive:
 * 12:00 is still Morning, 12:30 is already outside it.
 */
export const PERIODS = [
  { id: "morning", label: "Morning", range: "9 AM–12 PM", start: "09:00", end: "12:00" },
  { id: "afternoon", label: "Afternoon", range: "1 PM–6 PM", start: "13:00", end: "18:00" },
  { id: "evening", label: "Evening", range: "7 PM–9 PM", start: "19:00", end: "21:00" },
];

function buildOpeningHours() {
  const hours = [];

  PERIODS.forEach(({ start, end }) => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    for (
      let minutes = startHour * 60 + startMinute;
      minutes <= endHour * 60 + endMinute;
      minutes += SLOT_MINUTES
    ) {
      const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
      const minute = String(minutes % 60).padStart(2, "0");
      hours.push(`${hour}:${minute}`);
    }
  });

  return hours;
}

/**
 * Flat list of every served time slot:
 * ["09:00", "09:30", ..., "21:00"]
 *
 * Generated from PERIODS so we don't need to keep two lists in sync.
 */
export const openingHours = buildOpeningHours();
