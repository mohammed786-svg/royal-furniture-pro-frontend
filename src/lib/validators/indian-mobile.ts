/** Indian mobile: 10 digits, starts with 6–9 (no country code in field) */
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Strip +91 / leading 0 and return up to 10 digits */
export function normalizeIndianMobile(input: string): string {
  let digits = digitsOnly(input);
  if (digits.startsWith("91") && digits.length > 10) {
    digits = digits.slice(2);
  }
  if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
}

export function formatIndianMobileDisplay(digits: string): string {
  const d = normalizeIndianMobile(digits);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)} ${d.slice(5)}`;
}

export function isValidIndianMobile(input: string): boolean {
  return INDIAN_MOBILE_REGEX.test(normalizeIndianMobile(input));
}

export function indianMobileError(input: string): string | null {
  const digits = normalizeIndianMobile(input);
  if (!digits) return "Mobile number is required";
  if (digits.length < 10) return "Enter a valid 10-digit mobile number";
  if (!INDIAN_MOBILE_REGEX.test(digits)) {
    return "Enter a valid Indian mobile number (starts with 6–9)";
  }
  return null;
}

/** True when Google/social login user has no usable mobile on file. */
export function isMissingCustomerMobile(mobile?: string | null): boolean {
  if (!mobile) return true;
  const trimmed = mobile.trim().toUpperCase();
  if (trimmed === "NA" || trimmed === "N/A") return true;
  return normalizeIndianMobile(mobile).length !== 10;
}
