import { selectors } from "../../utils/selectors.js";

/**
 * Clicking an available time slot marks the selection and stores the
 * value in the hidden input, which is what the form submits.
 */
export function hoursClick() {
  selectors.hoursList.addEventListener("click", (event) => {
    const item = event.target.closest(".hour");

    if (!item || item.classList.contains("hour-unavailable")) return;

    selectors.hoursList
      .querySelectorAll(".hour-selected")
      .forEach((selected) => selected.classList.remove("hour-selected"));

    item.classList.add("hour-selected");
    selectors.hourInput.value = item.dataset.hour;

    // Notifies the form to clear the field's error message.
    selectors.hourInput.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
