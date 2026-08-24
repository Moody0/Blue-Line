/**
 * Pure Validation & Normalization Utilities
 */

/** Strict Email Validator ensuring valid domain and 2+ char TLD */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const clean = email.trim();

  // Strict email regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(clean)) return false;

  // RFC syntax checks
  if (clean.includes("..") || clean.startsWith(".") || clean.endsWith(".")) return false;
  const parts = clean.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain || local.length > 64 || domain.length > 253) return false;
  if (!domain.includes(".")) return false;

  const tld = domain.split(".").pop();
  if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) return false;

  return true;
}

/** Strict Egyptian & International Mobile Phone Validator */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-\(\)\.]/g, "");

  // 1. Egyptian Mobile: 010, 011, 012, 015 followed by exactly 8 digits (11 digits total)
  const egMobileRegex = /^(010|011|012|015)[0-9]{8}$/;
  if (egMobileRegex.test(clean)) return true;

  // 2. Egyptian Mobile with Country Code (+2010... or 002010... or 2010...)
  const egIntlMobileRegex = /^(\+20|0020|20)(10|11|12|15)[0-9]{8}$/;
  if (egIntlMobileRegex.test(clean)) return true;

  // 3. Strict International E.164 (+ followed by country code, 9-15 digits total)
  const intlE164Regex = /^\+[1-9][0-9]{7,14}$/;
  if (intlE164Regex.test(clean)) return true;

  return false;
}

/** Standardizes Egyptian and International Phone Numbers */
export function normalizePhoneNumber(phone: string): string {
  let clean = phone.replace(/[\s\-\(\)\.]/g, "");
  if (/^(\+20|0020|20)(10|11|12|15)[0-9]{8}$/.test(clean)) {
    clean = clean.replace(/^(\+20|0020|20)/, "0");
  }
  return clean;
}
