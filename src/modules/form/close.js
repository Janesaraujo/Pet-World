import { selectors } from "../../utils/selectors.js";

export function formClose() {
  selectors.dialog.close();
}

/**
 * Closes via the X button or by clicking the dark backdrop.
 * ESC is already handled by the <dialog> element itself.
 */
export function formCloseListener() {
  selectors.closeButton.addEventListener("click", formClose);

  selectors.dialog.addEventListener("click", (event) => {
    if (event.target === selectors.dialog) {
      formClose();
    }
  });
}
