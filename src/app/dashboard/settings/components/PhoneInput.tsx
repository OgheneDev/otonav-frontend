import React from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export function PhoneInput({
  value,
  onChange,
  maxLength = 10, // Changed to 10 since we only want 10 digits (without leading 0)
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters
    const digits = e.target.value.replace(/\D/g, "");
    // Limit to maxLength digits (10)
    onChange(digits.slice(0, maxLength));
  };

  const digitCount = value.replace(/\D/g, "").length;

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
          (+234)
        </div>
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          className="w-full md:w-64 text-gray-800 text-sm border border-gray-200 rounded-xl pl-16 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A082]/20 focus:border-[#00A082] transition-all"
          placeholder="8071920976"
          maxLength={maxLength}
          inputMode="numeric"
        />
      </div>
      <div className="flex justify-between">
        <p className="text-xs text-gray-500">
          {digitCount}/{maxLength} digits
        </p>
      </div>
    </div>
  );
}
