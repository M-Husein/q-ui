import React, { useEffect, useRef } from 'react';

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange' | 'type'> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      indeterminate = false,
      disabled = false,
      onChange,
      children,
      className = '',
      ...restProps
    },
    ref
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || innerRef;

    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate, inputRef]);

    return (
      <label
        className={`flex items-center gap-2 ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`.trim()}
      >
        <input
          ref={inputRef}
          type="checkbox"
          className="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={onChange}
          {...restProps}
        />
        {children != null && <span>{children}</span>}
      </label>
    );
  }
);

export interface RadioProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange' | 'type'> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  className?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked,
      defaultChecked,
      disabled = false,
      value,
      name,
      onChange,
      children,
      className = '',
      ...restProps
    },
    ref
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || innerRef;

    return (
      <label
        className={`flex items-center gap-2 ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`.trim()}
      >
        <input
          ref={inputRef}
          type="radio"
          className="radio"
          value={value}
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={onChange}
          {...restProps}
        />
        {children != null && <span>{children}</span>}
      </label>
    );
  }
);
