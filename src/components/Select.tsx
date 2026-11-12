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
  options?: SelectOption[];
  placeholder?: string;
  canClear?: boolean;
  children?: React.ReactNode;
  onChange?: (value: string, e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export const Select = ({
  options,
  placeholder,
  canClear = false,
  children,
  onChange,
  value,
  defaultValue,
  disabled = false,
  className = '',
  ref,
  ...restProps
}: SelectProps & { ref?: React.Ref<HTMLSelectElement> }) => {
  const innerRef = useRef<HTMLSelectElement>(null);
  const setRefs = (node: HTMLSelectElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') (ref as (n: HTMLSelectElement | null) => void)(node);
    else if (ref) (ref as React.MutableRefObject<HTMLSelectElement | null>).current = node;
  };
  const selectRef = innerRef;
  const genId = useId();
  const id = (restProps as any).id || genId;

  const current = value ?? selectRef.current?.value ?? defaultValue ?? '';
  const showClear = canClear && !disabled && !!current;

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = selectRef.current;
    if (!el) return;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLSelectElement.prototype,
      'value'
    )?.set;
    setter?.call(el, '');
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };

  return (
    <div
      className={`q-select-wrap ${showClear ? 'q-has-clear' : ''} ${className}`.trim()}
    >
      <select
        ref={setRefs}
        id={id}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value, e)}
        className="select"
        {...restProps}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </option>
            ))
          : children}
      </select>
      {showClear && (
        <button
          type="button"
          className="q-select-clear"
          aria-label="Clear"
          tabIndex={-1}
          onClick={handleClear}
        >
          ✕
        </button>
      )}
      <span className="q-select-arrow" aria-hidden="true" />
    </div>
  );
};
