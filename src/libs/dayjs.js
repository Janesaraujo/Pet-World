/**
 * Central dayjs configuration.
 * ALWAYS import from this file (never straight from "dayjs"), so the
 * "en" locale is guaranteed across the whole project.
 */
import dayjs from "dayjs";
import "dayjs/locale/en";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
dayjs.locale("en");

export default dayjs;
