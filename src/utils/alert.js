import { selectors } from "./selectors.js";

let timer;

/** Quick message at the bottom of the screen. */
export function alertMessage(message, { type = "info", duration = 3200 } = {}) {
  const { toast } = selectors;

  clearTimeout(timer);
  toast.textContent = message;
  toast.classList.toggle("toast--error", type === "error");
  toast.classList.add("is-visible");

  timer = setTimeout(() => toast.classList.remove("is-visible"), duration);
}
