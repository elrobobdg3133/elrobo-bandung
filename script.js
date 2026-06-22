const form = document.querySelector("#registrationForm");
const successMessage = document.querySelector("#successMessage");

const fields = {
  fullName: {
    input: document.querySelector("#fullName"),
    error: document.querySelector("#fullNameError"),
    validate: (value) => value.trim().length >= 2 || "Please enter your full name.",
  },
  email: {
    input: document.querySelector("#email"),
    error: document.querySelector("#emailError"),
    validate: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email address.",
  },
  phone: {
    input: document.querySelector("#phone"),
    error: document.querySelector("#phoneError"),
    validate: (value) =>
      value.replace(/[^\d]/g, "").length >= 7 || "Please enter a valid phone number.",
  },
  course: {
    input: document.querySelector("#course"),
    error: document.querySelector("#courseError"),
    validate: (value) => value !== "" || "Please select a course.",
  },
  level: {
    input: document.querySelector("#level"),
    error: document.querySelector("#levelError"),
    validate: (value) => value !== "" || "Please select your current level.",
  },
  consent: {
    input: document.querySelector("#consent"),
    error: document.querySelector("#consentError"),
    validate: () =>
      document.querySelector("#consent").checked || "Please agree to be contacted.",
  },
};

function setError(field, message) {
  field.error.textContent = message || "";
  field.input.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateField(field) {
  const result = field.validate(field.input.value);
  const message = result === true ? "" : result;
  setError(field, message);
  return result === true;
}

function validateSchedule() {
  const scheduleError = document.querySelector("#scheduleError");
  const selected = document.querySelector('input[name="schedule"]:checked');
  scheduleError.textContent = selected ? "" : "Please choose a preferred schedule.";
  return Boolean(selected);
}

Object.values(fields).forEach((field) => {
  field.input.addEventListener("input", () => {
    validateField(field);
    successMessage.textContent = "";
  });
});

document.querySelectorAll('input[name="schedule"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    validateSchedule();
    successMessage.textContent = "";
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const areFieldsValid = Object.values(fields).every(validateField);
  const isScheduleValid = validateSchedule();
  const isFormValid = areFieldsValid && isScheduleValid;

  if (!isFormValid) {
    successMessage.textContent = "";
    return;
  }

  successMessage.textContent =
    "Registration submitted successfully. We will contact you soon with class details.";
  form.reset();

  Object.values(fields).forEach((field) => setError(field, ""));
});
