import { selectors } from "../../utils/selectors.js";

/**
 * Shows the error messages below each field and focuses the first
 * invalid field. Call with {} to clear everything.
 */
export function formShowErrors(errors = {}) {
  selectors.form.querySelectorAll("[data-field]").forEach((field) => {
    const message = errors[field.dataset.field];
    const input = field.querySelector(".field__input");

    field.classList.toggle("field--invalid", Boolean(message));
    field.querySelector(".field__error").textContent = message ?? "";
    input?.setAttribute("aria-invalid", message ? "true" : "false");
  });

  selectors.form.querySelector(".field--invalid .field__input")?.focus();
}

export function formClearErrors() {
  formShowErrors({});
}

/** Clears the field's error as soon as the user starts fixing it. */
export function formClearErrorOnInput() {
  selectors.form.addEventListener("input", (event) => {
    const field = event.target.closest("[data-field]");

    if (field?.classList.contains("field--invalid")) {
      field.classList.remove("field--invalid");
      field.querySelector(".field__error").textContent = "";
      event.target.setAttribute("aria-invalid", "false");
    }
  });
}
