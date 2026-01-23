// Format phone number for display with parentheses and spaces
export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return "Not provided";

  // Remove +234 prefix
  const cleaned = phone.replace(/^\+234/, "").replace(/^234/, "");

  // If empty, return Not provided
  if (!cleaned) return "Not provided";

  // Add leading 0 if not present
  const withZero = cleaned.startsWith("0") ? cleaned : `0${cleaned}`;

  // Format as (+234) XXX XXX XXXX
  if (withZero.length === 11) {
    return `(+234) ${withZero.substring(1, 4)} ${withZero.substring(4, 7)} ${withZero.substring(7)}`;
  }

  return withZero;
}

// Format phone number for editing - just the 10 digits (no leading 0)
export function formatPhoneForEditing(phone: string): string {
  if (!phone) return "";

  // Remove +234 prefix if present
  const cleaned = phone.replace(/^\+234/, "").replace(/^234/, "");

  // Remove leading 0 if present
  return cleaned.startsWith("0") ? cleaned.substring(1) : cleaned;
}

// Format phone number for backend - add +234 prefix
export function formatPhoneForBackend(phone: string): string {
  if (!phone) return "";

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // If empty after cleaning, return empty
  if (digits.length === 0) return "";

  // If it's 10 digits (without leading 0), add +234
  if (digits.length === 10) {
    return `+234${digits}`;
  }

  // If it starts with 0 and is 11 digits, convert to +234
  if (digits.startsWith("0") && digits.length === 11) {
    return `+234${digits.substring(1)}`;
  }

  // Return as is
  return digits;
}

// Clean phone input - remove all non-digits
export function cleanPhoneInput(value: string): string {
  return value.replace(/\D/g, "");
}
