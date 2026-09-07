import { selectors } from "../../utils/selectors.js";
import { hoursLoad } from "./hours-load.js";

/**
 * Time slot availability depends on the chosen day, so changing the
 * date in the form requires rebuilding the list.
 */
export function formDateChange() {
  selectors.dateInput.addEventListener("change", () => {
    hoursLoad({ date: selectors.dateInput.value });
  });
}
