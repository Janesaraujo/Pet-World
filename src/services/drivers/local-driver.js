import dayjs from "../../libs/dayjs.js";
import { STORAGE_KEY } from "../api-config.js";

/**
 * Local driver: stores appointments in the visitor's browser.
 *
 * Used in the published version, where there's no server running.
 * Each visitor has their own schedule — nothing is shared.
 */

/** Initial schedule, so the demo doesn't open empty. */
function seed() {
  const today = dayjs().format("YYYY-MM-DD");

  return [
    {
      id: "demo-1",
      tutor: "Jennifer Carter",
      pet: "Thor",
      phone: "+1 (415) 555-0132",
      service: "Vaccination",
      when: today,
      hour: "09:00",
    },
    {
      id: "demo-2",
      tutor: "John Miller",
      pet: "Mel",
      phone: "+1 (312) 555-0198",
      service: "Nail Trim",
      when: today,
      hour: "14:00",
    },
    {
      id: "demo-3",
      tutor: "Camila Reyes",
      pet: "Max",
      phone: "+1 (206) 555-0147",
      service: "Teeth Cleaning",
      when: today,
      hour: "20:00",
    },
  ];
}

function readAll() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === null) {
      const initial = seed();
      writeAll(initial);
      return initial;
    }

    return JSON.parse(stored);
  } catch (error) {
    // localStorage blocked (private browsing in some browsers).
    console.error(error);
    return [];
  }
}

function writeAll(schedules) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.error(error);
  }
}

export async function list({ date }) {
  return readAll().filter((schedule) => schedule.when === date);
}

export async function create(schedule) {
  const created = { ...schedule, id: crypto.randomUUID() };

  writeAll([...readAll(), created]);

  return created;
}

export async function remove({ id }) {
  writeAll(readAll().filter((schedule) => String(schedule.id) !== String(id)));

  return null;
}
