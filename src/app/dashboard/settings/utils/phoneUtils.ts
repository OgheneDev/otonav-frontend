// Format phone number for display - remove +234 prefix if present
export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return "";

  // Remove +234 prefix
  if (phone.startsWith("+234")) {
    return "0" + phone.substring(4);
  }

  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, "");

  // If it's 13 digits and starts with 234, convert to 0 format
  if (digits.length === 13 && digits.startsWith("234")) {
    return "0" + digits.substring(3);
  }

  // Otherwise return digits (max 10)
  return digits.slice(0, 10);
}

// Format phone number for backend - add +234 prefix
export function formatPhoneForBackend(phone: string): string {
  if (!phone) return "";

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // If empty after cleaning, return empty
  if (digits.length === 0) return "";

  // If it starts with 0, convert to +234
  if (digits.startsWith("0") && digits.length >= 10) {
    return `+234${digits.substring(1, 11)}`;
  }

  // If it's already in +234 format or 234 format, ensure proper format
  if (digits.startsWith("234") && digits.length >= 13) {
    return `+${digits.substring(0, 13)}`;
  }

  // Otherwise, assume it's a 10-digit number and add +234
  if (digits.length === 10) {
    return `+234${digits}`;
  }

  // Return as is (backend should handle validation)
  return phone;
}

// Format phone number as user types - only allow 10 digits
export function formatPhoneInput(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");
  // Limit to 10 digits
  return digits.slice(0, 10);
}
