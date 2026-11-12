import './Combobox.css';

import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  useMemo,
  useCallback,
} from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Popover } from './Popover';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  [key: string]: any; // Allows custom metadata properties
}

export interface ComboboxGroup {
  title?: string;
  label: React.ReactNode;
  options: ComboboxOption[];
}

export type ComboboxItem = ComboboxOption | ComboboxGroup;

export interface ComboboxOptionRenderInfo {
  index: number;
  isSelected: boolean;
  isActive: boolean;
}

export interface ComboboxTagProps {
  label: string;
  value: string;
  option: ComboboxOption;
  disabled?: boolean;
  onClose: (evt?: React.MouseEvent | React.KeyboardEvent) => void;
}

export interface ComboboxProps {
  /** Flat options list OR array of grouped options (OptGroup structure) */
  options: ComboboxItem[];
  /** Controlled value (string for single select, string[] for multiple) */
  value?: string | string[];
  /** Uncontrolled initial value */
  defaultValue?: string | string[];
  /** Hidden input field name for form submissions */
  name?: string;
  /** Trigger placeholder */
  placeholder?: string;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Empty state message */
  emptyText?: string;
  /** Keys in option objects to search against (defaults to ['label']) */
  filterKeys?: string[];
  /** Enable virtualization for large datasets via @tanstack/react-virtual */
  virtual?: boolean;
  /** Estimated row height for virtualizer calculation (defaults to 32px) */
  itemHeight?: number;
  /** Auto-focus search input on popover open */
  autoFocusSearch?: boolean;
  /** Enable multi-select with tag/chip rendering */
  multiple?: boolean;
  /** Maximum number of items that can be selected in multiple mode */
  max?: number;
  /** Show clear button when value is present */
  canClear?: boolean;

  /** Show search input when true */
  canSearch?: boolean;

  /** Disable combobox component */
  disabled?: boolean;
  /** Custom wrapper CSS class name */
  className?: string;
  /** Custom render function for dropdown option items */
  renderOption?: (
    option: ComboboxOption,
    info: ComboboxOptionRenderInfo
  ) => React.ReactNode;
  /** Custom render function for selected option label in single select mode */
  renderLabel?: (option: ComboboxOption) => React.ReactNode;
  /** Custom render function for tags/chips in multiple selection mode */
  renderTag?: (props: ComboboxTagProps) => React.ReactNode;
  /** Custom render function to extend or decorate the dropdown content */
  renderPopup?: (originNode: React.ReactNode) => React.ReactNode;
  /** Selection change callback */
  onChange?: (
    value: string | string[],
    selectedOptions: ComboboxOption | ComboboxOption[] | undefined
  ) => void;
}

/** Type guard to check if item is an Option Group */
const isComboboxGroup = (item: ComboboxItem): item is ComboboxGroup =>
  'options' in item && Array.isArray((item as ComboboxGroup).options);

// Initial state setup
const normalizeInitialValue = (val?: string | string[]): string[] => {
  if (Array.isArray(val)) return val;
  return val ? [val] : [];
};

export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options,
      value,
      defaultValue,
      name,
      placeholder,
      searchPlaceholder = 'Search',
      emptyText = 'Not found',
      filterKeys = ['label'],
      virtual,
      // Adjusted default height to match CSS padding (8px top + 8px bottom + 22px line height)
      itemHeight = 32,
      autoFocusSearch = true,
      multiple,
      max,
      canClear,
      canSearch = true,
      disabled,
      className,
      renderOption,
      renderLabel,
      renderTag,
      renderPopup,
      onChange,
    },
    ref
  ) => {
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const triggerBtnRef = useRef<HTMLButtonElement>(null);
    const popoverContentRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listScrollRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      ...hiddenInputRef.current!,
      focus: () => triggerBtnRef.current?.focus(),
    }));

    // Normalize input options into a unified flattened list
    const allOptions = useMemo(() => {
      const flat: ComboboxOption[] = [];
      options.forEach((item) => {
        if (isComboboxGroup(item)) {
          flat.push(...item.options);
        } else {
          flat.push(item);
        }
      });
      return flat;
    }, [options]);

    const [selectedVals, setSelectedVals] = useState<string[]>(
      normalizeInitialValue(value ?? defaultValue)
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    // Sync controlled value prop updates
    useEffect(() => {
      if (value != null) {
        setSelectedVals(normalizeInitialValue(value));
      }
    }, [value]);

    const isMaxReached = useMemo(() => {
      return !!multiple && max != null && selectedVals.length >= max;
    }, [multiple, max, selectedVals.length]);

    const selectedOptions = useMemo(
      () => allOptions.filter((opt) => selectedVals.includes(opt.value)),
      [allOptions, selectedVals]
    );

    // Multi-key filter lookup
    const isMatch = useCallback(
      (opt: ComboboxOption, query: string): boolean => {
        if (!query) return true;
        return filterKeys.some((key) => {
          const val = opt[key];
          if (val == null) return false;
          return ('' + val).toLowerCase().includes(query);
        });
      },
      [filterKeys]
    );

    // Filtered group structures & flat array for virtualizer / keyboard navigation
    const { filteredGroups, filteredFlatOptions } = useMemo(() => {
      const query = searchTerm.toLowerCase().trim();
      const flatFiltered: ComboboxOption[] = [];

      if (options.length > 0 && isComboboxGroup(options[0])) {
        const groups = (options as ComboboxGroup[])
          .map((grp) => {
            const filteredOpts = grp.options.filter((opt) =>
              isMatch(opt, query)
            );
            flatFiltered.push(...filteredOpts);
            return {
              title:
                grp.title ??
                (typeof grp.label === 'string' ? grp.label : void 0),
              label: grp.label,
              options: filteredOpts,
            };
          })
          .filter((grp) => grp.options.length > 0);

        return { filteredGroups: groups, filteredFlatOptions: flatFiltered };
      }

      const simpleFiltered = (options as ComboboxOption[]).filter((opt) =>
        isMatch(opt, query)
      );

      return { filteredGroups: null, filteredFlatOptions: simpleFiltered };
    }, [options, searchTerm, isMatch]);

    // Initialize TanStack Virtualizer
    const rowVirtualizer = useVirtualizer({
      count: virtual ? filteredFlatOptions.length : 0,
      getScrollElement: () => listScrollRef.current,
      estimateSize: () => itemHeight,
    });

    const getSelectedIndex = (
      flatList: ComboboxOption[],
      selected: string[]
    ) => {
      if (!selected.length) return 0;
      const index = flatList.findIndex((opt) => opt.value === selected[0]);
      return index >= 0 ? index : 0;
    };

    // Keep activeIndex synchronized with scrolling during keyboard arrow navigation
    useEffect(() => {
      if (activeIndex >= 0) {
        if (virtual) {
          rowVirtualizer.scrollToIndex(activeIndex, { align: 'auto' });
        } else {
          (
            listScrollRef.current?.children[activeIndex] as HTMLElement
          )?.scrollIntoView({ block: 'nearest' });
        }
      }
    }, [activeIndex, virtual, rowVirtualizer]);

    // Selection changes
    const updateSelections = (nextVals: string[]) => {
      if (value == null) {
        setSelectedVals(nextVals);
      }

      if (multiple) {
        const matched = allOptions.filter((opt) =>
          nextVals.includes(opt.value)
        );
        onChange?.(nextVals, matched);
      } else {
        const singleVal = nextVals[0] || '';
        const matched = allOptions.find((opt) => opt.value === singleVal);
        onChange?.(singleVal, matched);
      }
    };

    // Handle popover open/toggle events
    const handleTogglePopover = (isOpen: boolean) => {
      if (isOpen) {
        setActiveIndex(
          filteredFlatOptions.length
            ? getSelectedIndex(filteredFlatOptions, selectedVals)
            : -1
        );

        requestAnimationFrame(() => {
          if (canSearch && autoFocusSearch) {
            searchInputRef.current?.focus();
          } else {
            triggerBtnRef.current?.focus();
          }
        });
      } else {
        setSearchTerm(''); // Clear search input value
      }
    };

    const handleSelectOption = (opt: ComboboxOption, optIndex?: number) => {
      const isSelected = selectedVals.includes(opt.value);

      if (opt.disabled || (!isSelected && isMaxReached)) return;

      if (optIndex != null) {
        setActiveIndex(optIndex);
      }

      if (multiple) {
        const nextVals = isSelected
          ? selectedVals.filter((v) => v !== opt.value)
          : [...selectedVals, opt.value];

        updateSelections(nextVals);
      } else {
        updateSelections([opt.value]);
        const popoverEl = popoverContentRef.current?.closest(
          '[popover]'
        ) as HTMLDivElement | null;
        popoverEl?.hidePopover();
      }
    };

    const stopPropagationAndToggle = (
      evt?: React.MouseEvent | React.KeyboardEvent
    ) => {
      if (evt) {
        evt.stopPropagation();
        evt.preventDefault();
      }
    };

    const handleRemoveTag = (
      valToRemove: string,
      evt?: React.MouseEvent | React.KeyboardEvent
    ) => {
      stopPropagationAndToggle(evt);
      if (disabled) return;
      updateSelections(selectedVals.filter((v) => v !== valToRemove));
    };

    const handleClearAll = (evt: React.MouseEvent | React.KeyboardEvent) => {
      stopPropagationAndToggle(evt);
      if (disabled) return;
      updateSelections([]);
    };

    const handleKeyDown = (evt: React.KeyboardEvent) => {
      switch (evt.key) {
        case 'ArrowDown': {
          evt.preventDefault();
          if (!filteredFlatOptions.length) return;
          setActiveIndex((prev) =>
            prev < filteredFlatOptions.length - 1 ? prev + 1 : 0
          );
          break;
        }
        case 'ArrowUp': {
          evt.preventDefault();
          if (!filteredFlatOptions.length) return;
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : filteredFlatOptions.length - 1
          );
          break;
        }
        case 'Enter': {
          if (
            !!popoverContentRef.current?.closest('[popover]:popover-open') &&
            activeIndex >= 0 &&
            activeIndex < filteredFlatOptions.length
          ) {
            evt.preventDefault();
            handleSelectOption(filteredFlatOptions[activeIndex], activeIndex);
          }
          break;
        }
        case 'Escape': {
          popoverContentRef.current
            ?.closest<HTMLElement>('[popover]')
            ?.hidePopover();
          break;
        }
        case 'Backspace': {
          if (
            multiple &&
            searchTerm === '' &&
            // Prevent deleting tags if focus is actively inside the search input
            document.activeElement !== searchInputRef.current &&
            selectedVals.length > 0 &&
            selectedVals.at(-1)
          ) {
            updateSelections(selectedVals.slice(0, -1));
          }
          break;
        }
        default:
          break;
      }
    };

    const hasValue = selectedVals.length > 0;

    // Helper to render an individual option item
    const renderOptionItem = (
      opt: ComboboxOption,
      flatIdx: number,
      style?: React.CSSProperties
    ) => {
      const isSelected = selectedVals.includes(opt.value);
      const isOptionDisabled = opt.disabled || (!isSelected && isMaxReached);
      const isActive = flatIdx === activeIndex;

      return (
        <div
          key={opt.value}
          role="option"
          title={opt.label}
          aria-selected={isSelected}
          aria-disabled={isOptionDisabled}
          style={style}
          className={'combobox-item' + (isActive ? ' active' : '')}
          onClick={() => handleSelectOption(opt, flatIdx)}
          onMouseEnter={() => setActiveIndex(flatIdx)}
        >
          {renderOption ? (
            renderOption(opt, { index: flatIdx, isSelected, isActive })
          ) : (
            <>
              <span className="truncate">{opt.label}</span>
              {isSelected && <b className="combobox-check">✓</b>}
            </>
          )}
        </div>
      );
    };

    const renderTagItem = (opt: ComboboxOption) => {
      const isTagDisabled = disabled || opt.disabled;
      const onClose = (evt?: React.MouseEvent | React.KeyboardEvent) => {
        handleRemoveTag(opt.value, evt);
      };

      if (renderTag) {
        return (
          <React.Fragment key={opt.value}>
            {renderTag({
              label: opt.label,
              value: opt.value,
              option: opt,
              disabled: isTagDisabled,
              onClose,
            })}
          </React.Fragment>
        );
      }

      return (
        <span key={opt.value} className="combobox-tag">
          {opt.label}
          <b
            role="button"
            tabIndex={-1}
            inert={isTagDisabled}
            aria-disabled={isTagDisabled}
            className="combobox-x-tag"
            // aria-label={`Remove ${opt.label}`}
            onClick={onClose}
            onMouseDown={(evt) => evt.stopPropagation()}
          >
            {/* ✕ | × */}✕
          </b>
        </span>
      );
    };

    const renderSingleLabelContent = () => {
      const selectedOpt = selectedOptions[0];
      if (!selectedOpt) {
        return (
          !!placeholder && (
            <div className="combobox-placeholder truncate">{placeholder}</div>
          )
        );
      }

      if (renderLabel) {
        return (
          <div className="combobox-text truncate">
            {renderLabel(selectedOpt)}
          </div>
        );
      }

      return <div className="combobox-text truncate">{selectedOpt.label}</div>;
    };

    let currentFlatIndex = 0;

    // Build the options list menu according to `virtual` mode status
    const popupListMenu = (
      <div
        ref={listScrollRef}
        role="listbox"
        aria-multiselectable={multiple}
        className={'combobox-list' + (virtual ? ' virtual' : '')}
        style={
          virtual
            ? void 0
            : ({
                '--ci-height': itemHeight + 'px',
              } as React.CSSProperties)
        }
      >
        {filteredFlatOptions.length > 0 ? (
          virtual ? (
            /* Mode 1: Virtualized Rendering via @tanstack/react-virtual */
            <div
              className="combobox-virtual-inner"
              style={{ height: rowVirtualizer.getTotalSize() + 'px' }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualItem) =>
                renderOptionItem(
                  filteredFlatOptions[virtualItem.index],
                  virtualItem.index,
                  {
                    transform: `translateY(${virtualItem.start}px)`,
                  }
                )
              )}
            </div>
          ) : /* Mode 2: Standard Non-Virtual Rendering with native CSS content-visibility */
          filteredGroups ? (
            filteredGroups.map((grp, gIdx) => (
              <div
                key={
                  grp.title ||
                  (typeof grp.label === 'string' ? grp.label : gIdx)
                }
                className="combobox-group"
              >
                <div
                  className="combobox-group-label"
                  title={
                    grp.title ??
                    (typeof grp.label === 'string' ? grp.label : void 0)
                  }
                >
                  {grp.label}
                </div>
                {grp.options.map((opt) => {
                  const idx = currentFlatIndex++;
                  return renderOptionItem(opt, idx);
                })}
              </div>
            ))
          ) : (
            filteredFlatOptions.map((opt, idx) => renderOptionItem(opt, idx))
          )
        ) : (
          <div className="combobox-empty">{emptyText}</div>
        )}
      </div>
    );

    return (
      <div
        className={'combobox' + (className ? ' ' + className : '')}
        onKeyDown={handleKeyDown}
      >
        <Popover
          className="combobox-popover"
          onToggle={handleTogglePopover}
          trigger={
            <button
              ref={triggerBtnRef}
              type="button"
              role="combobox"
              aria-haspopup="listbox"
              disabled={disabled}
              className="combobox-trigger"
            >
              <div className="combobox-value-container">
                {multiple ? (
                  selectedOptions.length > 0 ? (
                    <div className="combobox-tags">
                      {selectedOptions.map(renderTagItem)}
                    </div>
                  ) : (
                    !!placeholder && (
                      <div className="combobox-placeholder truncate">
                        {placeholder}
                      </div>
                    )
                  )
                ) : (
                  renderSingleLabelContent()
                )}
              </div>

              <div className="combobox-actions">
                {!!canClear && hasValue && !disabled && (
                  <b
                    role="button"
                    tabIndex={-1}
                    className="combobox-x-btn"
                    onClick={handleClearAll}
                    onMouseDown={(evt) => evt.stopPropagation()}
                    title="Clear selection"
                    // aria-label="Clear selection"
                  >
                    {/* ✕ | × */}✕
                  </b>
                )}
                <b className="combobox-icon" aria-hidden="true">
                  ↕
                </b>
              </div>
            </button>
          }
        >
          <div ref={popoverContentRef} className="combobox-content">
            {canSearch && (
              <div className="combobox-search-header">
                <span className="combobox-search-icon">🔍</span>
                <input
                  ref={searchInputRef}
                  type="search"
                  tabIndex={-1}
                  // autoFocus={autoFocusSearch} // May not work
                  className="combobox-search-input"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setActiveIndex(0);
                  }}
                />
              </div>
            )}

            {renderPopup ? renderPopup(popupListMenu) : popupListMenu}
          </div>
        </Popover>

        {/* Hidden Input for Form Submissions */}
        <input
          ref={hiddenInputRef}
          type="hidden"
          name={name}
          value={value}
          disabled={disabled}
        />
      </div>
    );
  }
);

// Combobox.displayName = 'Combobox';
