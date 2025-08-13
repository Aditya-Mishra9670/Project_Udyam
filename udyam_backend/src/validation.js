/**
 * Checks only Aadhaar and name fields for presence and format.
 * @param {Object} payload - The form data to validate
 * @returns {string|null} Returns an error message if invalid, otherwise null
 */
function checkAadhaarAndName(payload = {}) {
  const { name, aadhaar } = payload;
  if (!name?.toString().trim()) {
    return 'Name is required.';
  }
  const aadhaarPattern = /^\d{12}$/;
  if (!aadhaarPattern.test(aadhaar)) {
    return 'Aadhaar number must contain exactly 12 digits.';
  }
  return null;
}
// src/validator.js

/**
 * Runs basic field and format checks on the submitted form data.
 * @param {Object} payload - The form data to validate
 * @returns {string|null} Returns an error message if invalid, otherwise null
 */
function checkFormData(payload = {}) {
  const { name, aadhaar, pan, pin, city, state } = payload;

  // Presence check
  if ([name, aadhaar, pan, pin, city, state].some(field => !field?.toString().trim())) {
    return 'Please fill in all the required fields.';
  }

  // Aadhaar: exactly 12 digits
  const aadhaarPattern = /^\d{12}$/;
  if (!aadhaarPattern.test(aadhaar)) {
    return 'Aadhaar number must contain exactly 12 digits.';
  }

  // PAN: 5 letters, 4 digits, 1 letter
  const panPattern = /^[A-Z]{5}\d{4}[A-Z]$/i;
  if (!panPattern.test(pan)) {
    return 'PAN format is invalid (Example: ABCDE1234F).';
  }

  // PIN: exactly 6 digits
  const pinPattern = /^\d{6}$/;
  if (!pinPattern.test(pin)) {
    return 'PIN code must be exactly 6 digits.';
  }

  return null; // All good
}

module.exports = { checkFormData, checkAadhaarAndName };
