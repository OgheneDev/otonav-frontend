import React from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export function PhoneInput({
  value,
  onChange,
  maxLength = 11,
}: PhoneInputProps) {
  const formatPhoneInput = (input: string) => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, "");
    // Limit to maxLength digits
    return digits.slice(0, maxLength);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneInput(e.target.value);
    onChange(formattedPhone);
  };

  const digitCount = value.replace(/\D/g, "").length;

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          className="w-full md:w-64 text-gray-800 text-sm border border-gray-200 rounded-xl pl-4 pr-16 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A082]/20 focus:border-[#00A082]"
          placeholder="08012345678"
          maxLength={maxLength}
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-sm">
          (+234)
        </div>
      </div>
      <div className="flex justify-between">
        <p className="text-xs text-gray-500 font-medium">
          {digitCount}/{maxLength - 1} digits
        </p>
      </div>
    </div>
  );
}
