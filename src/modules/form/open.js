import { selectors } from "../../utils/selectors.js";
import { formClearErrors } from "./errors.js";
import { today } from "../../utils/date.js";
import { hoursLoad } from "./hours-load.js";

/**
 * Opens the modal: resets the form, already suggests the date that's
 * open in the schedule, focuses the first field, and builds the day's
 * time slots.
 */
export async function formOpen() {
  selectors.form.reset();
  formClearErrors();

  const date = selectors.agendaDate.value || today();
  selectors.dateInput.value = date;

  selectors.dialog.showModal();
  selectors.form.querySelector(".field__input").focus();

  await hoursLoad({ date });
}

/** Wires the "New appointment" button to opening the modal. */
export function formOpenListener() {
  selectors.newButton.addEventListener("click", formOpen);
}
