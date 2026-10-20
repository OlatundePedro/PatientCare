// ---------- Password strength ----------

export function getPasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    long: password.length >= 12,
    case: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  let score = Object.values(checks).filter(Boolean).length;

  // A password shorter than 8 characters can never rate above "Weak"
  if (!checks.length) score = Math.min(score, 2);

  const level = password ? Math.max(score, 1) : 0;

  return { level, checks };
}

// ---------- Date of birth ----------

// Turns whatever is typed into DD/MM/YYYY as the user types.
export function formatDob(text) {
  const digits = text.replace(/\D/g, "").slice(0, 8);

  if (digits.length > 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }

  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return digits;
}

// Returns a Date for a real calendar date in DD/MM/YYYY, otherwise null.
export function parseDob(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

// ---------- Phone number ----------

const cleanPhone = (phone) => phone.replace(/[\s()-]/g, "");

export function isValidNigerianPhone(phone) {
  return /^(?:\+234|234|0)[789][01]\d{8}$/.test(cleanPhone(phone));
}

// 0803 123 4567 -> +2348031234567
export function toE164(phone) {
  return `+234${cleanPhone(phone).replace(/^(?:\+234|234|0)/, "")}`;
}

// +2348031234567 -> +234 803 123 4567
export function formatPhoneDisplay(e164) {
  const national = e164.replace(/^\+234/, "");
  return `+234 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
}

// Date -> DD/MM/YYYY
export function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}
