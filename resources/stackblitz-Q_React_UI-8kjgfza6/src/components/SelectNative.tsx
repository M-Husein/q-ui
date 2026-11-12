import './SelectNative.css';

import React, {
  useId,
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
} from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NativeSearchableSelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    'onChange' | 'value' | 'defaultValue'
  > {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  onChange?: (value: string, option: SelectOption | undefined) => void;
  className?: string;
}

export const Select = React.forwardRef<
  HTMLSelectElement,
  NativeSearchableSelectProps
>(
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
    const rawId = useId();
    const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
    const popoverId = `select-popover-${cleanId}`;
    const anchorName = `--select-anchor-${cleanId}`;

    const selectRef = useRef<HTMLSelectElement>(null);
    useImperativeHandle(ref, () => selectRef.current as HTMLSelectElement);

    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // State management
    const [selectedVal, setSelectedVal] = useState<string>(
      value ?? defaultValue ?? ''
    );
    const [searchTerm, setSearchTerm] = useState('');

    // Sync controlled value prop
    useEffect(() => {
      if (value !== undefined) {
        setSelectedVal(value);
      }
    }, [value]);

    const selectedOption = options.find((opt) => opt.value === selectedVal);

    // Filter options dynamically
    const filteredOptions = options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    // Dynamic size attribute for inline <select>
    const selectSize = Math.max(Math.min(filteredOptions.length, 8), 2);

    // Handle toggle event & focus management
    useEffect(() => {
      const popoverEl = popoverRef.current;
      const triggerEl = triggerRef.current;
      if (!popoverEl || !triggerEl) return;

      const handleToggle = (e: Event) => {
        const toggleEvt = e as ToggleEvent;
        if (toggleEvt.newState === 'open') {
          // Fallback manual positioning for engines lacking CSS Anchor Positioning
          if (!CSS.supports('anchor-name: --test')) {
            const rect = triggerEl.getBoundingClientRect();
            popoverEl.style.position = 'fixed';
            popoverEl.style.top = `${rect.bottom + 4}px`;
            popoverEl.style.left = `${rect.left}px`;
            popoverEl.style.width = `${rect.width}px`;
          }

          // Focus search input on open
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              searchInputRef.current?.focus();
            });
          });
        } else {
          setSearchTerm(''); // Clear search filter on close
        }
      };

      popoverEl.addEventListener('toggle', handleToggle);
      return () => popoverEl.removeEventListener('toggle', handleToggle);
    }, []);

    // Handle selection from native <select>
    const handleSelectChange = (val: string) => {
      if (value === undefined) {
        setSelectedVal(val);
      }
      const matchedOpt = options.find((opt) => opt.value === val);
      onChange?.(val, matchedOpt);

      // Hide top-layer popover on selection
      popoverRef.current?.hidePopover();
    };

    // Keyboard navigation from search input -> native <select> options
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation(); // Prevents light dismiss
      }

      if (!selectRef.current || !filteredOptions.length) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const selectEl = selectRef.current;
        selectEl.focus();

        // If no option is selected yet, pre-select the first one
        if (!selectEl.value && filteredOptions[0]) {
          selectEl.value = filteredOptions[0].value;
          setSelectedVal(filteredOptions[0].value);
        }
      } else if (e.key === 'Enter') {
        if (selectRef.current.value) {
          handleSelectChange(selectRef.current.value);
        }
      }
    };

    // Prevent keydown propagation on <select> to stop light dismiss
    const handleSelectKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.stopPropagation(); // Stop light-dismiss trigger
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.currentTarget.value) {
          handleSelectChange(e.currentTarget.value);
        }
      }
    };

    return (
      <div className={`native-search-select ${className}`.trim()}>
        {/* Trigger Button */}
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          popoverTarget={popoverId}
          popoverTargetAction="toggle"
          className="select-trigger form-control"
          style={{ anchorName: anchorName } as React.CSSProperties}
        >
          <span
            className={selectedOption ? 'select-text' : 'select-placeholder'}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="select-arrow" aria-hidden="true" />
        </button>

        {/* Popover Box Container */}
        <div
          id={popoverId}
          ref={popoverRef}
          popover="auto"
          className="select-box"
          style={{ positionAnchor: anchorName } as React.CSSProperties}
          onKeyDown={(e) => {
            // Prevent arrow key navigation inside popover from triggering light-dismiss
            if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
              e.stopPropagation();
            }
          }}
        >
          <div className="select-search-wrapper">
            <input
              ref={searchInputRef}
              type="search"
              className="form-control select-search-input"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>

          {/* Native Inline Expanded <select> */}
          <select
            ref={selectRef}
            name={name}
            size={selectSize}
            className="select-native"
            value={selectedVal}
            onChange={(e) => handleSelectChange(e.target.value)}
            onKeyDown={handleSelectKeyDown}
            {...restProps}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </option>
              ))
            ) : (
              <option value="" disabled className="select-no-results">
                No options found
              </option>
            )}
          </select>
        </div>
      </div>
    );
  }
);

// Select.displayName = 'Select';
