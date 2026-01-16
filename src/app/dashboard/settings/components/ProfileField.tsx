import React from "react";
import { LucideIcon, CheckCircle2 } from "lucide-react";
import { PhoneInput } from "./PhoneInput";

interface ProfileFieldProps {
  icon: LucideIcon;
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
  helperText?: string;
  inputType?: string;
  verified?: boolean;
  isPhoneField?: boolean;
  maxLength?: number;
}

export function ProfileField({
  icon: Icon,
  label,
  value,
  editing,
  onChange,
  helperText,
  inputType = "text",
  verified = false,
  isPhoneField = false,
  maxLength,
}: ProfileFieldProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 group">
      <div className="flex items-start md:items-center gap-4 flex-1">
        <div className="w-10 h-10 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center shrink-0 mt-1 md:mt-0 ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all">
          <Icon
            className="text-gray-500 group-hover:text-gray-600 transition-colors"
            size={18}
          />
        </div>
        <div className="w-full min-w-0">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">
            {label}
          </p>
          {editing ? (
            isPhoneField ? (
              <PhoneInput
                value={value}
                onChange={onChange}
                maxLength={maxLength}
              />
            ) : (
              <input
                type={inputType}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full md:w-80 text-gray-800 text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A082]/20 focus:border-[#00A082] transition-all hover:border-gray-300"
                maxLength={maxLength}
                placeholder={`Enter your ${label.toLowerCase()}`}
              />
            )
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-gray-800 text-sm truncate">{value}</p>
              {verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-linear-to-r from-green-50 to-emerald-50 text-green-700 text-[9px] uppercase rounded-md border border-green-200 ring-1 ring-green-100">
                  <CheckCircle2 size={10} />
                  Verified
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {helperText && !editing && (
        <span className="hidden md:block text-[10px] text-gray-400 italic whitespace-nowrap">
          {helperText}
        </span>
      )}
    </div>
  );
}
