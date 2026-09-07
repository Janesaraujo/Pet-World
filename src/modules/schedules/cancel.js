import { scheduleCancel } from "../../services/schedule-cancel.js";
import { schedulesDay } from "./load.js";
import { selectors } from "../../utils/selectors.js";
import { alertMessage } from "../../utils/alert.js";

/**
 * Listens for clicks on each period's "Remove appointment" button.
 * Uses delegation: the listener lives on the section, not on each row —
 * that way it keeps working for rows created afterward.
 */
export function schedulesCancel() {
  selectors.periods.forEach((period) => {
    period.addEventListener("click", async (event) => {
      const button = event.target.closest(".cancel-icon");
      if (!button) return;

      const item = button.closest(".appointment");

      // Gets the appointment's id to remove.
      const { id } = item.dataset;

      // Confirms an id was found.
      if (id) {
        // Confirms the user wants to cancel.
        const isConfirm = confirm("Are you sure you want to cancel this appointment?");

        if (isConfirm) {
          try {
            // Requests the API to cancel it.
            await scheduleCancel({ id });

            // Reloads the appointments.
            schedulesDay();

            alertMessage("Appointment canceled.");
          } catch (error) {
            console.error(error);
            alertMessage("Couldn't cancel it. Please try again.", {
              type: "error",
            });
          }
        }
      }
    });
  });
}
