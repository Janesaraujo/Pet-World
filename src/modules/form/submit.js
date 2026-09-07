import { scheduleNew } from "../../services/schedule-new.js";
import { scheduleDay } from "../../services/schedule-day.js";
import { schedulesDay } from "../schedules/load.js";
import { selectors } from "../../utils/selectors.js";
import { alertMessage } from "../../utils/alert.js";
import { formatDateLocale } from "../../utils/date.js";
import { formatTimeLocale } from "../../utils/hours.js";
import { formValidate } from "./validate.js";
import { formShowErrors } from "./errors.js";
import { formClose } from "./close.js";

/** Reads the form fields already trimmed. */
function getFormData() {
  const form = new FormData(selectors.form);

  return {
    tutor: form.get("tutor").trim(),
    pet: form.get("pet").trim(),
    phone: form.get("phone").trim(),
    service: form.get("service").trim(),
    when: form.get("date"),
    hour: form.get("hour"),
  };
}

export function formSubmit() {
  selectors.form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = getFormData();
    selectors.submitButton.disabled = true;

    try {
      // Fetches the chosen date's schedules to check for a time conflict.
      const sameDay = data.when ? await scheduleDay({ date: data.when }) : [];

      const errors = formValidate(data, sameDay);

      if (Object.keys(errors).length) {
        formShowErrors(errors);
        return;
      }

      const created = await scheduleNew(data);

      formClose();

      // If the appointment is for the day currently open, reload the schedule.
      if (created.when === selectors.appointmentsDate.value) {
        schedulesDay();
      }

      alertMessage(
        `${created.pet} scheduled for ${formatDateLocale(created.when)} at ${formatTimeLocale(created.hour)}.`
      );
    } catch (error) {
      console.error(error);
      alertMessage("Couldn't save the appointment. Please try again.", {
        type: "error",
      });
    } finally {
      selectors.submitButton.disabled = false;
    }
  });
}
