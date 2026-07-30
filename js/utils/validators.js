const Validators = {
  required: (val) => val && val.trim().length > 0 ? null : 'This field is required',
  email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : 'Invalid email address',
  phone: (val) => /^[\d\s\-\(\)\+]{7,15}$/.test(val) ? null : 'Invalid phone number',
  minLength: (min) => (val) => val && val.length >= min ? null : `Minimum ${min} characters required`,
  maxLength: (max) => (val) => !val || val.length <= max ? null : `Maximum ${max} characters allowed`,
  numeric: (val) => /^\d+$/.test(val) ? null : 'Must be a number',
  decimal: (val) => /^\d+(\.\d+)?$/.test(val) ? null : 'Must be a valid number',
  password: (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(val) ? null : 'Password must have 8+ chars with uppercase, lowercase & number',
  url: (val) => /^https?:\/\/.+/.test(val) ? null : 'Invalid URL',
  date: (val) => !isNaN(Date.parse(val)) ? null : 'Invalid date',
  afterToday: (val) => new Date(val) > new Date() ? null : 'Date must be in the future',
  match: (otherVal, label) => (val) => val === otherVal ? null : `Must match ${label}`,
  positive: (val) => parseFloat(val) > 0 ? null : 'Must be positive',
  validate: (value, rules) => { for (const rule of rules) { if (typeof rule === 'function') { const err = rule(value); if (err) return err; } } return null; },
  validateForm: (data, rules) => { const errors = {}; for (const [field, fieldRules] of Object.entries(rules)) { const err = Validators.validate(data[field], fieldRules); if (err) errors[field] = err; } return Object.keys(errors).length > 0 ? errors : null; }
};
