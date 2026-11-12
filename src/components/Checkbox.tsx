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

export const Checkbox = ({
  checked,
  defaultChecked,
  indeterminate = false,
  disabled = false,
  onChange,
  children,
  className = '',
  ref,
  ...restProps
}: CheckboxProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const innerRef = useRef<HTMLInputElement>(null);
  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') (ref as (n: HTMLInputElement | null) => void)(node);
    else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
  };

  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={`flex items-center gap-2 ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`.trim()}
    >
      <input
        ref={setRefs}
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
};

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

export const Radio = ({
  checked,
  defaultChecked,
  disabled = false,
  value,
  name,
  onChange,
  children,
  className = '',
  ref,
  ...restProps
}: RadioProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const innerRef = useRef<HTMLInputElement>(null);
  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') (ref as (n: HTMLInputElement | null) => void)(node);
    else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
  };

  return (
    <label
      className={`flex items-center gap-2 ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`.trim()}
    >
      <input
        ref={setRefs}
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
};
