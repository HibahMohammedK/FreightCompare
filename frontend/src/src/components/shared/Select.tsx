import React from "react";
import { ChevronDownIcon } from "lucide-react";
import clsx from "clsx";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;

  label?: string;
  placeholder?: string;

  disabled?: boolean;
  required?: boolean;
  error?: string;

  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  options,
  onChange,
  label,
  placeholder,
  disabled = false,
  required = false,
  error,
  className,
}) => {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-text-dark">
          {label}
          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={clsx(
            "w-full appearance-none rounded-xl border bg-white px-4 py-2.5 pr-10 text-sm",
            "text-text-dark transition-all duration-200",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            disabled &&
              "cursor-not-allowed bg-gray-100 text-text-light",
            error
              ? "border-red-500"
              : "border-border-light"
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDownIcon
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-light"
        />
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};