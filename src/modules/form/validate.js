import { PERIODS, SLOT_MINUTES } from "../../utils/opening-hours.js";
import { getPeriodForHour, isHourPast, timeToMinutes } from "../../utils/hours.js";
import { parsePhoneValue } from "../../utils/phone.js";
import { findCountryByDialCode } from "../../utils/phone-countries.js";
import { isValidDate } from "../../utils/date.js";

const RANGES = PERIODS.map((period) => period.range).join(", ");

/**
 * Validates the form data.
 *
 * @param {object} data    - { tutor, pet, phone, service, when, hour }
 * @param {Array}  sameDay - appointments that already exist on the same date
 * @returns {Record<string, string>} field -> message map (empty object = valid)
 */
export function formValidate(data, sameDay = []) {
  const errors = {};

  if (!data.tutor) {
    errors.tutor = "Enter the owner's name.";
  }

  if (!data.pet) {
    errors.pet = "Enter the pet's name.";
  }

  // Uses the same split the phone field's own composer/parser use, so
  // validation always agrees with what's actually stored — no separate
  // digit-counting logic that could drift out of sync with it.
  const { dialCode, localDigits } = parsePhoneValue(data.phone);

  if (!dialCode || !localDigits) {
    errors.phone = "Enter a phone number, including the country code.";
  } else {
    const [minDigits, maxDigits] = findCountryByDialCode(dialCode).digits;

    if (localDigits.length < minDigits || localDigits.length > maxDigits) {
      errors.phone = "Enter a valid phone number for the selected country.";
    }
  }

  if (!data.service) {
    errors.service = "Describe the service to be performed.";
  }

  if (!data.when) {
    errors.date = "Choose the appointment date.";
  } else if (!isValidDate(data.when)) {
    errors.date = "Invalid date.";
  }

  if (!data.hour) {
    errors.hour = "Choose a time.";
  } else if (!getPeriodForHour(data.hour)) {
    errors.hour = `Time outside business hours (${RANGES}).`;
  } else if (timeToMinutes(data.hour) % SLOT_MINUTES !== 0) {
    errors.hour = `Times are in ${SLOT_MINUTES}-minute increments.`;
  } else if (!errors.date && isHourPast({ date: data.when, hour: data.hour })) {
    errors.hour = "That time has already passed. Choose another one.";
  } else if (
    !errors.date &&
    sameDay.some(
      (schedule) => schedule.when === data.when && schedule.hour === data.hour
    )
  ) {
    errors.hour = "There's already an appointment at that time. Choose another one.";
  }

  return errors;
}
