import React, { useEffect, useRef } from 'react';

export interface CheckboxChangeEvent {
  target: {
    checked: boolean;
    name?: string;
    value?: unknown;
  };
  nativeEvent: React.ChangeEvent<HTMLInputElement>['nativeEvent'];
}

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange'> {
  /** Specifies whether the checkbox is selected (Controlled) */
  checked?: boolean;
  /** Specifies the initial state (Uncontrolled) */
  defaultChecked?: boolean;
  /** The indeterminate checked state of checkbox */
  indeterminate?: boolean;
  /** Disable checkbox */
  disabled?: boolean;
  /** Callback function triggered when state changes */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Label text or node rendered inside the label wrapper */
  children?: React.ReactNode;
  /** Custom class for the outer <label> container */
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
      style,
      id,
      name,
      value,
      autoFocus,
      tabIndex,
      ...restProps
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    // Sync native indeterminate DOM property
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, inputRef]);

    const labelClasses = [
      'custom-checkbox-wrapper',
      disabled ? 'custom-checkbox-disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label className={labelClasses} style={style}>
        <input
          ref={inputRef}
          type="checkbox"
          id={id}
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          autoFocus={autoFocus}
          tabIndex={tabIndex}
          onChange={onChange}
          className="custom-checkbox-input"
          {...restProps}
        />
        {children !== undefined && children !== null && (
          <span className="custom-checkbox-label">{children}</span>
        )}
      </label>
    );
  }
);

// Checkbox.displayName = 'Checkbox';
