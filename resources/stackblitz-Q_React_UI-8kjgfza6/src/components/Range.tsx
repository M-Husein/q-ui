import React, { useState, useRef, useImperativeHandle } from 'react';

export interface RangeSliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Current value for controlled component */
  value?: number;
  /** Default value for uncontrolled component */
  defaultValue?: number;
  /** Minimum range value (Default: 0) */
  min?: number;
  /** Maximum range value (Default: 100) */
  max?: number;
  /** Step increment */
  step?: number;
  /** Controls whether the floating tooltip is rendered on focus/active state (Default: true) */
  showTooltip?: boolean;
  /** Callback fired when value updates */
  onChange?: (
    value: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  /** Custom CSS class for wrapper container */
  className?: string;
}

export const Range = React.forwardRef<HTMLInputElement, RangeSliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      showTooltip = true,
      onChange,
      className = '',
      style,
      disabled,
      ...restProps
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<number>(
      isControlled ? controlledValue : defaultValue
    );

    const currentValue = isControlled ? controlledValue : internalValue;

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue, e);
    };

    const containerClasses = [
      'range-container',
      showTooltip ? 'range-tip' : '',
      disabled ? 'disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Only compute position & attach attributes if showTooltip is true
    let tooltipProps: Record<string, any> = {};
    let combinedStyle = style;

    if (showTooltip) {
      const range = max - min || 1;
      const percentage = Math.min(1, Math.max(0, (currentValue - min) / range));

      tooltipProps['data-value'] = currentValue;
      combinedStyle = {
        ...style,
        '--percentage': percentage,
      } as React.CSSProperties;
    }

    return (
      <div className={containerClasses} style={combinedStyle} {...tooltipProps}>
        <input
          ref={inputRef}
          type="range"
          className="form-range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          disabled={disabled}
          onChange={handleValueChange}
          {...restProps}
        />
      </div>
    );
  }
);

// RangeSlider.displayName = 'RangeSlider';
