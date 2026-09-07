import { scheduleDay } from "../../services/schedule-day.js";
import { schedulesShow } from "./show.js";
import { selectors } from "../../utils/selectors.js";
import { alertMessage } from "../../utils/alert.js";
import { today } from "../../utils/date.js";

/**
 * Loads the appointments for the date selected at the top of the page
 * and renders them on screen.
 */
export async function schedulesDay() {
  const date = selectors.appointmentsDate.value || today();

  selectors.appointmentsList.setAttribute("aria-busy", "true");

  try {
    const schedules = await scheduleDay({ date });
    schedulesShow({ schedules });
  } catch (error) {
    console.error(error);
    alertMessage(
      "Couldn't load the schedule. Is the API server running?",
      { type: "error", duration: 5000 }
    );
  } finally {
    selectors.appointmentsList.removeAttribute("aria-busy");
  }
}

/** Changing the date at the top reloads that day's schedule. */
export function schedulesDateChange() {
  selectors.appointmentsDate.addEventListener("change", () => {
    if (selectors.appointmentsDate.value) {
      schedulesDay();
    }
  });
}
