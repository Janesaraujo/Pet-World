import { selectors } from "../utils/selectors.js";
import { today } from "../utils/date.js";

import { schedulesDay, schedulesDateChange } from "./schedules/load.js";
import { schedulesCancel } from "./schedules/cancel.js";
import { demoNotice } from "./demo-notice.js";
import { dateFieldClickListener } from "./date-field-click.js";

import { formOpenListener } from "./form/open.js";
import { formCloseListener } from "./form/close.js";
import { formDateChange } from "./form/date-change.js";
import { hoursClick } from "./form/hours-click.js";
import { formPhoneMask } from "./form/phone.js";
import { formClearErrorOnInput } from "./form/errors.js";
import { formSubmit } from "./form/submit.js";

/**
 * Runs once when the page loads: sets up the initial state
 * and registers all listeners.
 */
export function pageLoad() {
  // Initial state
  selectors.appointmentsDate.value = today();
  demoNotice();

  // Schedule
  schedulesDateChange();
  schedulesCancel();
  dateFieldClickListener();

  // Form
  formOpenListener();
  formCloseListener();
  formDateChange();
  hoursClick();
  formPhoneMask();
  formClearErrorOnInput();
  formSubmit();

  // First load
  schedulesDay();
}
