import React, { InputHTMLAttributes } from 'react';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}
export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label &&
      <label className="text-xs font-medium text-text-medium">{label}</label>
      }
      <div className="relative flex items-center">
        {icon &&
        <div className="absolute left-3 text-text-lighter pointer-events-none">
            {icon}
          </div>
        }
        <input
          className={`
            w-full rounded-xl border border-border-light bg-white px-4 py-2.5 text-sm text-text-darker 
            placeholder:text-text-lighter focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary
            ${icon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-error focus:border-error focus:ring-error' : ''}
            ${className}
          `}
          {...props} />
        
        {rightIcon &&
        <div className="absolute right-3 text-text-lighter">{rightIcon}</div>
        }
      </div>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>);

};