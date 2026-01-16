export function validateProfileForm(formData: {
  name: string;
  email: string;
  phoneNumber: string;
}): { isValid: boolean; error?: string } {
  if (!formData.name.trim()) {
    return { isValid: false, error: "Name is required" };
  }

  if (!formData.email.trim()) {
    return { isValid: false, error: "Email is required" };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  // Phone validation if provided
  if (formData.phoneNumber) {
    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      return {
        isValid: false,
        error: "Phone number must be exactly 10 digits",
      };
    }
  }

  return { isValid: true };
}

export function validatePasswordForm(passwordData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): { isValid: boolean; error?: string } {
  if (!passwordData.currentPassword) {
    return { isValid: false, error: "Current password is required" };
  }

  if (!passwordData.newPassword) {
    return { isValid: false, error: "New password is required" };
  }

  if (!passwordData.confirmPassword) {
    return { isValid: false, error: "Please confirm your new password" };
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    return { isValid: false, error: "New passwords do not match" };
  }

  if (passwordData.newPassword.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters" };
  }

  return { isValid: true };
}
