/**
 * DOM references used by more than one module.
 * Centralizing them here avoids repeating querySelector across files.
 */
export const selectors = {
  agendaDate: document.getElementById("agenda-date"),
  agendaList: document.getElementById("agenda-list"),
  periods: document.querySelectorAll(".period"),
  newButton: document.getElementById("btn-new-appointment"),
  dialog: document.getElementById("schedule-dialog"),
  form: document.getElementById("schedule-form"),
  submitButton: document.getElementById("btn-submit"),
  closeButton: document.getElementById("btn-close-dialog"),
  phoneInput: document.getElementById("phone"),
  phoneNumberInput: document.getElementById("phone-number"),
  phoneCountryButton: document.getElementById("phone-country-button"),
  phoneCountryDial: document.getElementById("phone-country-dial"),
  phoneCountryList: document.getElementById("phone-country-list"),
  phoneOtherDial: document.getElementById("phone-other-dial"),
  dateInput: document.getElementById("date"),
  hourInput: document.getElementById("hour"),
  hoursList: document.getElementById("hours"),
  template: document.getElementById("appointment-template"),
  toast: document.getElementById("toast"),
};
