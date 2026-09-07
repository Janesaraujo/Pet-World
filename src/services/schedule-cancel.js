import { driver } from "./driver.js";

/**
 * Cancels an appointment.
 * @param {{ id: string }} params
 */
export async function scheduleCancel({ id }) {
  return driver.remove({ id });
}
