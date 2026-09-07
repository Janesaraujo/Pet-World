import { formatLocalNumber, composePhoneValue } from "../../utils/phone.js";
import {
  COUNTRY_OPTIONS,
  countryLabel,
  detectDefaultCountry,
} from "../../utils/phone-countries.js";
import { selectors } from "../../utils/selectors.js";

/** Currently selected country; starts as the browser-locale guess. */
let selectedCountry = detectDefaultCountry();

/** Recomputes the hidden field's composed value from the current state. */
function updateComposedValue() {
  const dialCode =
    selectedCountry.code === "OTHER"
      ? selectors.phoneOtherDial.value.replace(/\D/g, "").slice(0, 3)
      : selectedCountry.dialCode;

  selectors.phoneInput.value = composePhoneValue({
    dialCode,
    localNumber: selectors.phoneNumberInput.value,
  });
}

/** Switches the UI to reflect a newly selected country. */
function applyCountry(country) {
  selectedCountry = country;

  if (country.code === "OTHER") {
    selectors.phoneCountryDial.textContent = "Other";
    selectors.phoneOtherDial.hidden = false;
    selectors.phoneOtherDial.value = "+";
  } else {
    selectors.phoneCountryDial.textContent = `+${country.dialCode}`;
    selectors.phoneOtherDial.hidden = true;
    selectors.phoneOtherDial.value = "";
  }

  selectors.phoneNumberInput.value = formatLocalNumber(
    selectors.phoneNumberInput.value,
    country.mask
  );

  updateComposedValue();

  // Clears any stale error message left over from before the country (and
  // therefore its digit-count rule) changed. Validation itself only runs
  // again on submit — this just stops an old message from lingering.
  selectors.phoneNumberInput.dispatchEvent(new Event("input", { bubbles: true }));
}

/** Builds the dropdown's option rows from the country list. */
function renderCountryList() {
  selectors.phoneCountryList.replaceChildren(
    ...COUNTRY_OPTIONS.map((country) => {
      const item = document.createElement("li");
      item.className = "phone-field__option";
      item.setAttribute("role", "option");
      item.dataset.code = country.code;
      item.textContent = countryLabel(country);
      return item;
    })
  );
}

function openList() {
  selectors.phoneCountryList.hidden = false;
  selectors.phoneCountryButton.setAttribute("aria-expanded", "true");
}

function closeList() {
  selectors.phoneCountryList.hidden = true;
  selectors.phoneCountryButton.setAttribute("aria-expanded", "false");
}

/** Sets up the country picker, the local-number mask, and their wiring. */
export function formPhoneMask() {
  renderCountryList();
  applyCountry(selectedCountry);

  selectors.phoneCountryButton.addEventListener("click", () => {
    if (selectors.phoneCountryList.hidden) {
      openList();
    } else {
      closeList();
    }
  });

  selectors.phoneCountryList.addEventListener("click", (event) => {
    const item = event.target.closest(".phone-field__option");
    if (!item) return;

    applyCountry(COUNTRY_OPTIONS.find((country) => country.code === item.dataset.code));
    closeList();

    if (selectedCountry.code === "OTHER") {
      selectors.phoneOtherDial.focus();
    } else {
      selectors.phoneNumberInput.focus();
    }
  });

  // Closes the dropdown on outside click or Escape.
  document.addEventListener("click", (event) => {
    if (
      !selectors.phoneCountryButton.contains(event.target) &&
      !selectors.phoneCountryList.contains(event.target)
    ) {
      closeList();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || selectors.phoneCountryList.hidden) return;

    // Without this, the native <dialog> also treats Escape as "cancel"
    // and closes the whole modal — losing every field the person filled
    // in just to dismiss the country dropdown.
    event.preventDefault();
    event.stopPropagation();
    closeList();
    selectors.phoneCountryButton.focus();
  });

  selectors.phoneNumberInput.addEventListener("input", () => {
    selectors.phoneNumberInput.value = formatLocalNumber(
      selectors.phoneNumberInput.value,
      selectedCountry.mask
    );
    updateComposedValue();
  });

  selectors.phoneOtherDial.addEventListener("input", () => {
    const digits = selectors.phoneOtherDial.value.replace(/\D/g, "").slice(0, 3);
    selectors.phoneOtherDial.value = digits ? `+${digits}` : "+";
    updateComposedValue();
  });
}
