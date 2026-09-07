import { PERIODS } from "../../utils/opening-hours.js";
import {
  getPeriodForHour,
  sortByHour,
  formatTimeLocale,
  formatTimeGrouped,
} from "../../utils/hours.js";
import { selectors } from "../../utils/selectors.js";

/** Builds an appointment's <li> from the HTML <template>. */
function createItem(schedule) {
  const item = selectors.template.content.firstElementChild.cloneNode(true);
  item.dataset.id = schedule.id;

  const time = item.querySelector(".appointment__time");
  time.textContent = formatTimeGrouped(schedule.hour);
  time.dateTime = `${schedule.when}T${schedule.hour}`;

  item.querySelector(".appointment__pet").textContent = schedule.pet;
  item.querySelector(".appointment__tutor").textContent = schedule.tutor;
  item.querySelector(".appointment__service").textContent = schedule.service;

  // Keeps AM/PM here (unlike the visible time above): a screen reader
  // announcing this label on its own doesn't have the period header's
  // context the way a sighted user reading the card does.
  item.querySelector(".cancel-icon").setAttribute(
    "aria-label",
    `Remove ${schedule.pet}'s appointment at ${formatTimeLocale(schedule.hour)}`
  );

  return item;
}

/** "Empty" row shown when a period has no appointments. */
function createEmptyItem() {
  const item = document.createElement("li");
  item.className = "period__empty";
  item.textContent = "Nothing scheduled here yet.";
  return item;
}

/**
 * Renders the schedule: distributes appointments across the
 * Morning / Afternoon / Evening sections, sorted by time.
 *
 * @param {{ schedules: Array }} params
 */
export function schedulesShow({ schedules }) {
  PERIODS.forEach((period) => {
    const list = selectors.agendaList.querySelector(
      `[data-period="${period.id}"] .period__items`
    );

    const items = sortByHour(
      schedules.filter((schedule) => getPeriodForHour(schedule.hour)?.id === period.id)
    );

    list.replaceChildren(
      ...(items.length ? items.map(createItem) : [createEmptyItem()])
    );
  });
}
