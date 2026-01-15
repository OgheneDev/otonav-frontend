import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";

interface ModalProps {
  onClose: () => void;
}

export function CreateRiderModal({ onClose }: ModalProps) {
  const { createRider, authUser, currentOrganization } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailType, setEmailType] = useState<
    "invitation" | "registration" | null
  >(null);

  // Check if user has permission to create riders
  useEffect(() => {
    if (authUser?.role !== "owner") {
      setError("You don't have permission to create riders");
    }
  }, [authUser]);

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);
    setEmailType(null);

    // Validation
    if (!name.trim()) {
      setError("Rider name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);

      // Call the createRider function from store
      const result = await createRider({
        riderEmail: email.trim().toLowerCase(),
        riderName: name.trim(),
      });

      console.log("Rider creation result:", result);

      // Determine email type from response
      if (result.emailType) {
        setEmailType(result.emailType);
      }

      setSuccess(true);

      // Clear form
      setName("");
      setEmail("");

      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: any) {
      console.error("Error creating rider:", err);

      // Handle specific error messages
      if (err.message?.includes("already belongs")) {
        setError("This rider already belongs to your organization");
      } else if (
        err.message?.includes("permission") ||
        err.message?.includes("unauthorized")
      ) {
        setError("You don't have permission to create riders");
      } else if (err.message?.includes("organization")) {
        setError("Organization not found");
      } else {
        setError(err.message || "Failed to create rider. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSubmitting) {
      handleSubmit();
    }
  };

  // Don't show modal if user doesn't have permission
  if (authUser?.role !== "owner") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#F8F9FA] rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-8 cursor-pointer top-8 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          <X size={24} />
        </button>

        <div className="space-y-2 mb-8">
          <h3 className="text-2xl font-semibold text-[#2D3748]">
            Invite Rider
          </h3>
          <p className="text-gray-600 text-sm f leading-relaxed">
            Enter rider's details to send them an invitation
          </p>
        </div>

        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-4">
            {/* Rider Name Field */}
            <input
              type="text"
              placeholder="Rider Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-white border-none rounded-xl text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-[#008B94]/20 outline-none transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Email Address Field */}
            <input
              type="email"
              placeholder="Email Address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-white border-none rounded-xl text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-[#008B94]/20 outline-none transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
              <div className="space-y-2">
                <p className="text-sm text-green-600 font-medium">
                  ✅{" "}
                  {emailType === "invitation"
                    ? "Invitation sent!"
                    : "Registration link sent!"}
                </p>
                <p className="text-xs text-green-500">
                  {emailType === "invitation"
                    ? `An invitation email has been sent to ${email}. If they already have an OtoNav account, they can accept it to join your organization.`
                    : `A registration link has been sent to ${email}. They should check their inbox (and spam folder) to complete registration.`}
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-col md:flex-row gap-4 md:justify-between items-center">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-200 w-full cursor-pointer text-sm hover:bg-gray-300 text-gray-700 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#008B94] w-full cursor-pointer text-sm hover:bg-[#007a82] text-white rounded-full transition-all shadow-lg shadow-teal-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Invitation"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
