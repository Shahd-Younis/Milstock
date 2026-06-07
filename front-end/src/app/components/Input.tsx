import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-1.5 text-sm font-medium text-[#2E3A24]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-4 py-2.5 rounded-xl',
            'bg-white border border-[#4E4631]/15 text-[#2E3A24]',
            'text-sm transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#6A7B4D]/30 focus:border-[#6A7B4D]',
            'placeholder:text-[#5A6B50]/50',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#ECEEE2]',
            error && 'border-[#C0392B] focus:ring-[#C0392B]/25 focus:border-[#C0392B]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-[#C0392B]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
