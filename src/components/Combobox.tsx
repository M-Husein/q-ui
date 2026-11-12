import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Popover } from './Popover';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  [key: string]: any;
}
export interface ComboboxGroup {
  title?: string;
  label: React.ReactNode;
  options: ComboboxOption[];
}
export type ComboboxItem = ComboboxOption | ComboboxGroup;

export interface ComboboxTagProps {
  label: string;
  value: string;
  option: ComboboxOption;
  disabled?: boolean;
  onClose: (e?: React.MouseEvent | React.KeyboardEvent) => void;
}
export interface ComboboxProps {
  options: ComboboxItem[];
  value?: string | string[];
  defaultValue?: string | string[];
  name?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  filterKeys?: string[];
  virtual?: boolean;
  itemHeight?: number;
  autoFocusSearch?: boolean;
  multiple?: boolean;
  max?: number;
  canClear?: boolean;
  canSearch?: boolean;
  disabled?: boolean;
  className?: string;
  renderOption?: (option: ComboboxOption, info: { index: number; isSelected: boolean; isActive: boolean }) => React.ReactNode;
  renderLabel?: (option: ComboboxOption) => React.ReactNode;
  renderTag?: (props: ComboboxTagProps) => React.ReactNode;
  renderPopup?: (node: React.ReactNode) => React.ReactNode;
  onChange?: (value: string | string[], selected: ComboboxOption | ComboboxOption[] | undefined) => void;
}

const isGroup = (i: ComboboxItem): i is ComboboxGroup =>
  'options' in i && Array.isArray((i as ComboboxGroup).options);

const normalize = (v?: string | string[]): string[] =>
  Array.isArray(v) ? v : v ? [v] : [];

export const Combobox = ({
  options,
  value,
  defaultValue,
  name,
  placeholder,
  searchPlaceholder = 'Search',
  emptyText = 'Not found',
  filterKeys = ['label'],
  virtual,
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
  ref,
}: ComboboxProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const hiddenRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // React 19: ref is a normal prop; expose the combobox as an input-like handle.
  useEffect(() => {
    if (!ref) return;
    const obj = ref as React.MutableRefObject<HTMLInputElement | null>;
    obj.current = hiddenRef.current;
    (obj.current as any) = {
      ...(hiddenRef.current as any),
      focus: () => triggerRef.current?.focus(),
    };
  });

    const allOptions = useMemo(() => {
      const flat: ComboboxOption[] = [];
      options.forEach((i) => (isGroup(i) ? flat.push(...i.options) : flat.push(i)));
      return flat;
    }, [options]);

    const [vals, setVals] = useState<string[]>(normalize(value ?? defaultValue));
    const [search, setSearch] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
      if (value != null) setVals(normalize(value));
    }, [value]);

    const isMaxReached = useMemo(
      () => !!multiple && max != null && vals.length >= max,
      [multiple, max, vals.length]
    );
    const selectedOptions = useMemo(
      () => allOptions.filter((o) => vals.includes(o.value)),
      [allOptions, vals]
    );

    const isMatch = useCallback(
      (o: ComboboxOption, q: string) =>
        !q ||
        filterKeys.some((k) => {
          const v = o[k];
          return v != null && ('' + v).toLowerCase().includes(q);
        }),
      [filterKeys]
    );

    const { groups, flatFiltered } = useMemo(() => {
      const q = search.toLowerCase().trim();
      const flat: ComboboxOption[] = [];
      if (options.length > 0 && isGroup(options[0])) {
        const g = (options as ComboboxGroup[])
          .map((grp) => {
            const fo = grp.options.filter((o) => isMatch(o, q));
            flat.push(...fo);
            return { title: grp.title ?? (typeof grp.label === 'string' ? grp.label : undefined), label: grp.label, options: fo };
          })
          .filter((g) => g.options.length > 0);
        return { groups: g, flatFiltered: flat };
      }
      const sf = (options as ComboboxOption[]).filter((o) => isMatch(o, q));
      return { groups: null, flatFiltered: sf };
    }, [options, search, isMatch]);

    const rowVirtualizer = useVirtualizer({
      count: virtual ? flatFiltered.length : 0,
      getScrollElement: () => listRef.current,
      estimateSize: () => itemHeight,
    });

    const update = (next: string[]) => {
      if (value == null) setVals(next);
      if (multiple) {
        const matched = allOptions.filter((o) => next.includes(o.value));
        onChange?.(next, matched);
      } else {
        const single = next[0] || '';
        const matched = allOptions.find((o) => o.value === single);
        onChange?.(single, matched);
      }
    };

    const handleToggle = (open: boolean) => {
      if (open) {
        setActiveIndex(flatFiltered.length ? (vals.length ? flatFiltered.findIndex((o) => o.value === vals[0]) : 0) : -1);
        requestAnimationFrame(() =>
          canSearch && autoFocusSearch ? searchRef.current?.focus() : triggerRef.current?.focus()
        );
      } else setSearch('');
    };

    const selectOption = (o: ComboboxOption, idx?: number) => {
      if (o.disabled || (!vals.includes(o.value) && isMaxReached)) return;
      if (idx != null) setActiveIndex(idx);
      if (multiple) {
        const next = vals.includes(o.value)
          ? vals.filter((v) => v !== o.value)
          : [...vals, o.value];
        update(next);
      } else {
        update([o.value]);
        (listRef.current?.closest('[popover]') as HTMLElement | null)?.hidePopover();
      }
    };

    const stopAndToggle = (e?: React.MouseEvent | React.KeyboardEvent) => {
      e?.stopPropagation();
      e?.preventDefault();
    };
    const removeTag = (v: string, e?: React.MouseEvent | React.KeyboardEvent) => {
      stopAndToggle(e);
      if (disabled) return;
      update(vals.filter((x) => x !== v));
    };
    const clearAll = (e: React.MouseEvent | React.KeyboardEvent) => {
      stopAndToggle(e);
      if (disabled) return;
      update([]);
    };

    const handleKey = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!flatFiltered.length) return;
          setActiveIndex((p) => (p < flatFiltered.length - 1 ? p + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!flatFiltered.length) return;
          setActiveIndex((p) => (p > 0 ? p - 1 : flatFiltered.length - 1));
          break;
        case 'Enter':
          if (listRef.current?.closest('[popover]:popover-open') && activeIndex >= 0) {
            e.preventDefault();
            selectOption(flatFiltered[activeIndex], activeIndex);
          }
          break;
        case 'Escape':
          (listRef.current?.closest('[popover]') as HTMLElement | null)?.hidePopover();
          break;
        case 'Backspace':
          if (multiple && search === '' && document.activeElement !== searchRef.current && vals.length) {
            update(vals.slice(0, -1));
          }
          break;
      }
    };

    const renderItem = (o: ComboboxOption, idx: number, s?: React.CSSProperties) => {
      const isSel = vals.includes(o.value);
      const isDis = o.disabled || (!isSel && isMaxReached);
      const isAct = idx === activeIndex;
      return (
        <div
          key={o.value}
          role="option"
          aria-selected={isSel}
          aria-disabled={isDis}
          style={s}
          className={`q-combobox-item ${isAct ? 'q-active' : ''}`}
          onClick={() => selectOption(o, idx)}
          onMouseEnter={() => setActiveIndex(idx)}
        >
          {renderOption ? (
            renderOption(o, { index: idx, isSelected: isSel, isActive: isAct })
          ) : (
            <>
              <span className="q-truncate">{o.label}</span>
              {isSel && <b>✓</b>}
            </>
          )}
        </div>
      );
    };

    const renderTagItem = (o: ComboboxOption) => {
      const isDis = disabled || o.disabled;
      if (renderTag)
        return (
          <React.Fragment key={o.value}>
            {renderTag({ label: o.label, value: o.value, option: o, disabled: isDis, onClose: (e) => removeTag(o.value, e) })}
          </React.Fragment>
        );
      return (
        <span key={o.value} className="q-combobox-tag">
          {o.label}
          <b role="button" tabIndex={-1} className="q-combobox-x" onClick={(e) => removeTag(o.value, e)} onMouseDown={(e) => e.stopPropagation()}>
            ✕
          </b>
        </span>
      );
    };

    let flatIdx = 0;
    const list = (
      <div
        ref={listRef}
        role="listbox"
        aria-multiselectable={multiple}
        className={`q-combobox-list ${virtual ? 'q-virtual' : ''}`}
        style={virtual ? undefined : ({ ['--ci-height' as any]: `${itemHeight}px` } as React.CSSProperties)}
      >
        {flatFiltered.length > 0 ? (
          virtual ? (
            <div className="q-combobox-virtual-inner" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
              {rowVirtualizer.getVirtualItems().map((vi) =>
                renderItem(flatFiltered[vi.index], vi.index, { transform: `translateY(${vi.start}px)` } as React.CSSProperties)
              )}
            </div>
          ) : groups ? (
            groups.map((g, gi) => (
              <div key={g.title || (typeof g.label === 'string' ? g.label : gi)} className="q-combobox-group">
                <div className="q-combobox-group-label">{g.label}</div>
                {g.options.map((o) => renderItem(o, flatIdx++))}
              </div>
            ))
          ) : (
            flatFiltered.map((o, idx) => renderItem(o, idx))
          )
        ) : (
          <div className="q-combobox-empty">{emptyText}</div>
        )}
      </div>
    );

    return (
      <div className={`q-combobox ${className ?? ''}`.trim()} onKeyDown={handleKey}>
        <Popover
          className="q-combobox-popover"
          onToggle={handleToggle}
          trigger={
            <button
              ref={triggerRef}
              type="button"
              role="combobox"
              aria-haspopup="listbox"
              disabled={disabled}
              className="q-combobox-trigger"
            >
              <div className="q-combobox-value">
                {multiple ? (
                  selectedOptions.length > 0 ? (
                    <div className="q-combobox-tags">{selectedOptions.map(renderTagItem)}</div>
                  ) : (
                    !!placeholder && <div className="q-combobox-placeholder q-truncate">{placeholder}</div>
                  )
                ) : selectedOptions[0] ? (
                  <div className="q-truncate">
                    {renderLabel ? renderLabel(selectedOptions[0]) : selectedOptions[0].label}
                  </div>
                ) : (
                  !!placeholder && <div className="q-combobox-placeholder q-truncate">{placeholder}</div>
                )}
              </div>
              <div className="q-combobox-actions">
                {!!canClear && vals.length > 0 && !disabled && (
                  <b role="button" tabIndex={-1} className="q-combobox-x" onClick={clearAll} onMouseDown={(e) => e.stopPropagation()}>
                    ✕
                  </b>
                )}
                <b className="q-combobox-x">↕</b>
              </div>
            </button>
          }
        >
          <div className="q-combobox-content">
            {canSearch && (
              <div className="q-combobox-search">
                <input
                  ref={searchRef}
                  type="search"
                  tabIndex={-1}
                  className="input"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setActiveIndex(0);
                  }}
                />
              </div>
            )}
            {renderPopup ? renderPopup(list) : list}
          </div>
        </Popover>
        <input ref={hiddenRef} type="hidden" name={name} value={value} disabled={disabled} />
      </div>
    );
  };

