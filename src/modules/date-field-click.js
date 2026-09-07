/**
 * Makes clicking anywhere in a date field's control — the calendar icon,
 * the chevron, not just the date text itself — open the native date
 * picker. The `<input>`'s own invisible picker indicator only covers the
 * input's own box, so the icons sitting next to it (flex siblings, not
 * part of the input) don't trigger it on their own.
 */
export function dateFieldClickListener() {
  document.querySelectorAll(".field--date .field__control").forEach((control) => {
    const input = control.querySelector("input[type='date']");
    if (!input) return;

    control.addEventListener("click", (event) => {
      // Clicking the input itself already opens the picker natively.
      if (event.target === input) return;
      input.showPicker?.();
    });
  });
}
