import dayjs from "../libs/dayjs.js";

export function today() {
  return dayjs().format("YYYY-MM-DD");
}


export function formatDateLocale(date, locale = navigator.language) {
  const [year, month, day] = date.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(localDate);
}


export function isValidDate(date) {
  return dayjs(date, "YYYY-MM-DD", true).isValid();
}
