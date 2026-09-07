import { openingHours } from "../../utils/opening-hours.js";
import { getPeriodForHour, isHourPast, formatTimeGrouped } from "../../utils/hours.js";
import { selectors } from "../../utils/selectors.js";
import { scheduleDay } from "../../services/schedule-day.js";

/**
 * Tracks the most recent call. Since hoursLoad is async, opening the modal
 * and then changing the date fires two loads at once — without this both
 * would render and the list would come out duplicated.
 */
let currentRequest = 0;

/** Period header inside the time slot list. */
function hourHeaderAdd(title) {
  const header = document.createElement("li");
  header.classList.add("hour-period");
  header.textContent = title;
  return header;
}

/**
 * Builds the form's time slot list for a specific date.
 *
 * A time slot is unavailable when:
 *  - it has already passed (only happens for today's date), or
 *  - there's already another appointment at that time on the same date.
 *
 * @param {{ date: string }} params
 */
export async function hoursLoad({ date }) {
  const { hoursList, hourInput } = selectors;
  const request = ++currentRequest;

  // Clears the previous selection.
  hourInput.value = "";

  // Time slots already taken on this day.
  let taken = new Set();

  if (date) {
    try {
      const schedules = await scheduleDay({ date });
      taken = new Set(schedules.map((schedule) => schedule.hour));
    } catch (error) {
      // Without the API the list still shows — it just can't mark taken slots.
      console.error(error);
    }
  }

  // A newer load started while this one was waiting on the API: discard it.
  if (request !== currentRequest) return;

  // Only clear the list now that we have the data in hand.
  hoursList.replaceChildren();

  const opening = openingHours.map((hour) => ({
    hour,
    period: getPeriodForHour(hour),
    available: !taken.has(hour) && !isHourPast({ date, hour }),
    taken: taken.has(hour),
  }));

  let lastPeriod = null;

  // Renders the time slots.
  opening.forEach(({ hour, period, available, taken: isTaken }) => {
    // Opens a new section whenever the period changes.
    if (period.id !== lastPeriod) {
      hoursList.append(hourHeaderAdd(`${period.label} · ${period.range}`));
      lastPeriod = period.id;
    }

    const item = document.createElement("li");
    item.classList.add("hour");
    item.classList.add(available ? "hour-available" : "hour-unavailable");
    item.dataset.hour = hour;
    item.textContent = formatTimeGrouped(hour);

    if (!available) {
      item.title = isTaken ? "Time already taken" : "Time unavailable";
    }

    hoursList.append(item);
  });
}
