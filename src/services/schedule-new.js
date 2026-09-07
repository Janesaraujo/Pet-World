import { driver } from "./driver.js";

/**
 * Creates a new appointment.
 * @param {{ tutor, pet, phone, service, when, hour }} schedule
 */
export async function scheduleNew(schedule) {
  return driver.create(schedule);
}
