const form = document.querySelector("#registrationForm");
const successMessage = document.querySelector("#successMessage");

const fields = {
  fullName: {
    input: document.querySelector("#fullName"),
    error: document.querySelector("#fullNameError"),
    validate: (value) => value.trim().length >= 2 || "Mohon isi nama lengkap.",
  },
  phone: {
    input: document.querySelector("#phone"),
    error: document.querySelector("#phoneError"),
    validate: (value) =>
      value.replace(/[^\d]/g, "").length >= 7 || "Mohon isi nomor telepon yang valid.",
  },
  course: {
    input: document.querySelector("#course"),
    error: document.querySelector("#courseError"),
    validate: (value) => value !== "" || "Mohon pilih kelas.",
  },
  level: {
    input: document.querySelector("#level"),
    error: document.querySelector("#levelError"),
    validate: (value) => value !== "" || "Mohon pilih jenjang pendidikan.",
  },
  consent: {
    input: document.querySelector("#consent"),
    error: document.querySelector("#consentError"),
    validate: () =>
      document.querySelector("#consent").checked || "Mohon setujui untuk dihubungi.",
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
  scheduleError.textContent = selected ? "" : "Mohon pilih jadwal yang diinginkan.";
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

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const areFieldsValid = Object.values(fields).every(validateField);
  const isScheduleValid = validateSchedule();
  const isFormValid = areFieldsValid && isScheduleValid;

  if (!isFormValid) {
    successMessage.textContent = "";
    return;
  }

  if (form.action.includes("REPLACE_WITH_YOUR_FORM_ID")) {
    successMessage.textContent =
      "Form sudah siap untuk Formspree. Ganti REPLACE_WITH_YOUR_FORM_ID dengan endpoint Formspree kamu.";
    return;
  }

  const submitButton = form.querySelector(".submit-button");
  submitButton.disabled = true;
  submitButton.textContent = "Mengirim...";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Formspree request failed");
    }

    successMessage.textContent =
      "Pendaftaran berhasil dikirim. Kami akan menghubungi Anda segera.";
    form.reset();
    Object.values(fields).forEach((field) => setError(field, ""));
  } catch (error) {
    successMessage.textContent =
      "Maaf, pendaftaran belum terkirim. Silakan coba lagi.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Kirim";
  }
});
