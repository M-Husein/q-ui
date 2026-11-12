import React, { useId, useRef, useEffect, useState, useImperativeHandle } from 'react';

export interface NativeSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectNativeProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    'onChange' | 'value' | 'defaultValue'
  > {
  options: NativeSelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  onChange?: (value: string, option?: NativeSelectOption) => void;
  className?: string;
}

export const SelectNative = React.forwardRef<HTMLSelectElement, SelectNativeProps>(
  (
    {
      options,
      value,
      defaultValue,
      placeholder = 'Choose...',
      searchPlaceholder = 'Search...',
      onChange,
      disabled = false,
      className = '',
      name,
      ...restProps
    },
    ref
  ) => {
    const id = useId().replace(/:/g, '');
    const popId = `q-sel-pop-${id}`;
    const anchor = `--q-sel-anchor-${id}`;
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    useImperativeHandle(ref, () => selectRef.current as HTMLSelectElement);

    const [val, setVal] = useState<string>(value ?? defaultValue ?? '');
    const [search, setSearch] = useState('');

    useEffect(() => {
      if (value !== undefined) setVal(value);
    }, [value]);

    const selected = options.find((o) => o.value === val);

    useEffect(() => {
      const pop = popRef.current;
      const trigger = triggerRef.current;
      if (!pop || !trigger) return;
      const handleToggle = (e: Event) => {
        const t = e as ToggleEvent;
        if (t.newState === 'open') {
          if (!CSS.supports('anchor-name: --test')) {
            const r = trigger.getBoundingClientRect();
            pop.style.position = 'fixed';
            pop.style.top = `${r.bottom + 4}px`;
            pop.style.left = `${r.left}px`;
            pop.style.width = `${r.width}px`;
          }
          requestAnimationFrame(() => searchRef.current?.focus());
        } else {
          setSearch('');
        }
      };
      pop.addEventListener('toggle', handleToggle);
      return () => pop.removeEventListener('toggle', handleToggle);
    }, []);

    const filtered = options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase().trim())
    );
    const size = Math.max(Math.min(filtered.length, 8), 2);

    const handleSelectChange = (v: string) => {
      if (value === undefined) setVal(v);
      onChange?.(v, options.find((o) => o.value === v));
      popRef.current?.hidePopover();
    };

    return (
      <div className={`q-select-native-wrap ${className}`.trim()}>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          popoverTarget={popId}
          popoverTargetAction="toggle"
          className="q-combobox-trigger"
          style={{ anchorName: anchor } as React.CSSProperties}
        >
          <span className={selected ? '' : 'q-combobox-placeholder'}>
            {selected ? selected.label : placeholder}
          </span>
          <span className="q-select-arrow" aria-hidden="true" />
        </button>
        <div
          id={popId}
          ref={popRef}
          popover="auto"
          className="q-combobox-popover"
          style={{ positionAnchor: anchor } as React.CSSProperties}
        >
          <div className="q-combobox-search">
            <input
              ref={searchRef}
              type="search"
              className="q-input"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            ref={selectRef}
            name={name}
            size={size}
            className="q-select"
            value={val}
            onChange={(e) => handleSelectChange(e.target.value)}
            {...restProps}
          >
            {filtered.length > 0 ? (
              filtered.map((o) => (
                <option key={o.value} value={o.value} disabled={o.disabled}>
                  {o.label}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No options found
              </option>
            )}
          </select>
        </div>
      </div>
    );
  }
);
