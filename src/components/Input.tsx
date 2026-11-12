import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = ({ className = '', ref, ...restProps }: InputProps & { ref?: React.Ref<HTMLInputElement> }) => (
  <input ref={ref} className={`input ${className}`.trim()} {...restProps} />
);
