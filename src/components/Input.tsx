import React, { forwardRef } from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...restProps }, ref) => (
    <input ref={ref} className={`q-input ${className}`.trim()} {...restProps} />
  )
);
