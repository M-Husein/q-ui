import './Select.css';

import React, { useId, useRef } from 'react';

export interface SelectOption {
  value: string | number;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<
    React.ComponentPropsWithoutRef<'select'>,
    'children' | 'onChange'
  > {
  /** Options list for the dropdown */
  options?: SelectOption[];
  /** Placeholder text shown when no value is selected */
  placeholder?: string;
  /** Shows a clear button (✕) when a value is selected */
  canClear?: boolean;
  /** Custom children if user prefers passing native <option> elements */
  children?: React.ReactNode;
  /** Direct top-level onChange callback */
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  /** Custom class for the wrapper container */
  className?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      placeholder,
      canClear = false,
      children,
      onChange,
      value,
      defaultValue,
      disabled = false,
      className = '',
      style,
      id,
      ...restProps
    },
    ref
  ) => {
    const internalRef = useRef<HTMLSelectElement>(null);
    const selectRef =
      (ref as React.RefObject<HTMLSelectElement>) || internalRef;
    const generatedId = useId();
    const selectId = id || generatedId;

    // Determine current value for clear button visibility
    const currentValue =
      value ?? selectRef.current?.value ?? defaultValue ?? '';
    const showClearBtn = canClear && !disabled && !!currentValue;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value, e);
    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (selectRef.current) {
        // Clear value programmatically and fire React onChange event
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLSelectElement.prototype,
          'value'
        )?.set;

        nativeSetter?.call(selectRef.current, '');

        const event = new Event('change', { bubbles: true });
        selectRef.current.dispatchEvent(event);
      }
    };

    const wrapperClasses = [
      'select-wrapper',
      disabled ? 'select-disabled' : '',
      showClearBtn ? 'has-clear' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses} style={style}>
        <select
          ref={selectRef}
          id={selectId}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={handleChange}
          className="select"
          {...restProps}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {options
            ? options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        {/* Floating Clear Button */}
        {showClearBtn && (
          <button
            type="button"
            className="select-clear-btn"
            onClick={handleClear}
            aria-label="Clear selection"
            tabIndex={-1}
          >
            ✕
          </button>
        )}

        {/* Native Arrow Indicator Icon */}
        <span className="select-arrow-icon" aria-hidden="true" />
      </div>
    );
  }
);

// Select.displayName = 'Select';
