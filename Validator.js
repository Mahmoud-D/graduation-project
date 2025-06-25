// validation/Validator.js

class Validator {
  /**
   * Constructor to initialize the Validator with rules.
   * @param {Object} rules - The rules to validate the fields. 
   /**
 * @description Validator class for validating form data.
 * This class is used to validate fields based on the provided rules.
 * 
 * @availableRules
 * - required: Ensures the field is not empty.
 * - minLength: Ensures the field has a minimum length.
 * - emailFormat: Validates if the field is a valid email.
 * - phoneFormat: Validates if the field is a valid Egyptian phone number.
 * - noSpaces: Ensures the field has no spaces.
 * - matchField: Ensures two fields match (e.g., password and confirm password).
 * - noNumbers: Ensures the field contains no numbers.
 * - isAlpha: Ensures the field contains only alphabetic characters.
 */

  constructor(rules) {
    this.rules = rules; // Rules for each field
    this.errors = {}; // To store errors for each field
  }

  /**
   * Validates the data object based on the provided rules.
   * @param {Object} data - The data object to validate.
   * @returns {boolean} - Returns true if all fields are valid, otherwise false.
   */
  validate(data) {
    this.errors = {}; // Reset errors before each validation

    // Check for missing or invalid fields
    for (const field in this.rules) {
      if (!(field in data)) {
        this.errors[field] = [`${field} is missing.`]; // Add missing field error message
        continue;
      }

      const fieldRules = this.rules[field];
      const value = data[field];

      for (const rule of fieldRules) {
        // Stop validation once an error is found
        const error = rule(value, data);
        if (error) {
          if (!this.errors[field]) {
            this.errors[field] = [];
          }
          this.errors[field].push(error);
          break; // Stop validation on the first error
        }
      }
    }

    // If there are errors, return false
    return Object.keys(this.errors).length === 0;
  }

  /**
   * Returns the errors found during validation.
   * @returns {Object} - An object containing errors for each field.
   */
  getErrors() {
    return this.errors;
  }
}

// Validation Rules
const rules = {
  /**
   * Rule to check if the field is required.
   * @param {string} fieldName - The name of the field.
   * @returns {function} - The validation function.
   */
  required: (fieldName) => (value) => {
    if (value === undefined || value === null || value === "") {
      return `${fieldName} is required.`;
    }
    return null;
  },

  /**
   * Rule to check the minimum length of the field.
   * @param {string} fieldName - The name of the field.
   * @param {number} min - The minimum length.
   * @returns {function} - The validation function.
   */
  minLength: (fieldName, min) => (value) => {
    if (typeof value === "string" && value.length < min) {
      return `${fieldName} must be at least ${min} characters long.`;
    }
    return null;
  },

  /**
   * Rule to check if the field is a valid email.
   * @param {string} fieldName - The name of the field.
   * @returns {function} - The validation function.
   */
  emailFormat: (fieldName) => (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !regex.test(value)) {
      return `${fieldName} must be a valid email address.`;
    }
    return null;
  },

  /**
   * Rule to check if the field is a valid Egyptian phone number.
   * @param {string} fieldName - The name of the field.
   * @returns {function} - The validation function.
   */
  phoneFormat: (fieldName) => (value) => {
    const regex = /^01[0125][0-9]{8}$/;
    if (value && !regex.test(value)) {
      return `${fieldName} must be a valid Egyptian phone number.`;
    }
    return null;
  },

  /**
   * Rule to check if the field contains no spaces.
   * @param {string} fieldName - The name of the field.
   * @returns {function} - The validation function.
   */
  noSpaces: (fieldName) => (value) => {
    if (typeof value === "string" && /\s/.test(value)) {
      return `${fieldName} must not contain spaces.`;
    }
    return null;
  },

  /**
   * Rule to check if two fields match (e.g., password and confirm password).
   * @param {string} fieldName - The name of the field.
   * @param {string} matchFieldName - The name of the field to match.
   * @returns {function} - The validation function.
   */
  matchField: (fieldName, matchFieldName) => (value, data) => {
    if (value !== data[matchFieldName]) {
      return `${fieldName} must match ${matchFieldName}.`;
    }
    return null;
  },

  /**
   * Rule to check if the field contains no numbers.
   * @param {string} fieldName - The name of the field.
   * @returns {function} - The validation function.
   */
  noNumbers: (fieldName) => (value) => {
    if (typeof value === "string" && /\d/.test(value)) {
      return `${fieldName} must not contain numbers.`;
    }
    return null;
  },

  /**
   * Rule to check if the field contains only alphabetic characters.
   * @param {string} fieldName - The name of the field.
   * @returns {function} - The validation function.
   */
  isAlpha: (fieldName) => (value) => {
    if (typeof value === "string" && !/^[a-zA-Z]+$/.test(value)) {
      return `${fieldName} must contain only alphabetic characters.`;
    }
    return null;
  },
};

module.exports = { Validator, rules };

const validator = new Validator({
  email: [
    rules.required("البريد الإلكتروني"),
    rules.emailFormat("البريد الإلكتروني"),
    rules.noSpaces("البريد الإلكتروني"),
    rules.minLength("البريد الإلكتروني", 1),
  ],
  phone: [rules.required("رقم الهاتف"), rules.phoneFormat("رقم الهاتف")],
  password: [rules.required("كلمة المرور"), rules.minLength("كلمة المرور", 8)],
  confirmPassword: [
    rules.required("تأكيد كلمة المرور"),
    rules.matchField("تأكيد كلمة المرور", "password"),
  ],
});

const isValid = validator.validate({
  email: "test@ss.example",
  phone: "01012345678",
  password: "password123",
  confirmPassword: "password123",
});

console.log(validator.getErrors());
console.log(isValid);
