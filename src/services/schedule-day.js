import { driver } from "./driver.js";

/**
 * Fetches a day's appointments.
 * @param {{ date: string }} params - date in YYYY-MM-DD
 * @returns {Promise<Array>}
 */
export async function scheduleDay({ date }) {
  return driver.list({ date });
}
