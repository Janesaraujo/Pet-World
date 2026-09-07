export function onlyDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

/** Brazil: "(00) 0000-0000" (landline) or "(00) 0 0000-0000" (mobile). */
function maskBR(digits) {
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/** United States / Canada: "(000) 000-0000". */
function maskUS(digits) {
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Everyone else: digits grouped in chunks of 3, e.g. "987 478 562". */
function maskGeneric(digits) {
  if (digits.length === 0) return "";
  return digits.match(/.{1,3}/g).join(" ");
}

const MASKS = { BR: maskBR, US: maskUS, GENERIC: maskGeneric };

/**
 * Formats a local phone number (area code + number, no dial code) using
 * the given country's mask type ("BR" | "US" | "GENERIC").
 *
 * Never embeds any digit that isn't part of what was typed — no fixed
 * literal prefix like a dial code is ever added here — which is what
 * makes this safe to call again on its own output on every keystroke.
 */
export function formatLocalNumber(value, maskType) {
  const digits = onlyDigits(value).slice(0, 14);
  const mask = MASKS[maskType] ?? maskGeneric;
  return mask(digits);
}

/** Builds the composed value stored in the form's hidden phone input. */
export function composePhoneValue({ dialCode, localNumber }) {
  if (!dialCode) return "";
  if (!onlyDigits(localNumber)) return `+${dialCode}`;
  return `+${dialCode} ${localNumber}`;
}

/**
 * Splits a composed phone value ("+55 (71) 9 7847-8562") back into the
 * dial code and the local number's digits, for validation. The dial code
 * is exactly what's between "+" and the first space — safe to parse this
 * way because it was chosen from a dropdown (or typed into its own field
 * for "Other"), never mixed into the local-number text.
 */
export function parsePhoneValue(value) {
  const raw = String(value ?? "").replace(/^\+/, "");
  const spaceIndex = raw.search(/\s/);

  if (spaceIndex === -1) {
    return { dialCode: onlyDigits(raw), localDigits: "" };
  }

  return {
    dialCode: onlyDigits(raw.slice(0, spaceIndex)),
    localDigits: onlyDigits(raw.slice(spaceIndex)),
  };
}
