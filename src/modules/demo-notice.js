import { apiMode } from "../services/driver.js";
import { selectors } from "../utils/selectors.js";

/**
 * The published version has no server: appointments are kept in the
 * visitor's own browser. Making this explicit on screen avoids anyone
 * thinking the data is shared.
 */
export function demoNotice() {
  if (apiMode !== "local") return;

  const notice = document.createElement("p");
  notice.className = "demo-notice";
  notice.textContent =
    "Demo version — appointments are only saved in this browser.";

  selectors.appointmentsDate.closest(".appointments__header").after(notice);
}
