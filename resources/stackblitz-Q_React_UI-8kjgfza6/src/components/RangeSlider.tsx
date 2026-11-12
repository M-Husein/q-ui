import React, { useCallback, useEffect, useRef, useState } from 'react';

export type RangeSliderValue = number | [number, number];

export interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  /** Controlled value (single number or dual tuple [min, max]) */
  value?: RangeSliderValue;
  /** Initial value for uncontrolled usage */
  defaultValue?: RangeSliderValue;
  /** Fires when any handle value changes */
  onChange?: (value: RangeSliderValue) => void;
  className?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 0,
  onChange,
  className = '',
}) => {
  // Determine if component is dual-handle mode based on initial value or defaultValue type
  const isDual = Array.isArray(value ?? defaultValue);

  // Internal state for uncontrolled pattern
  const [internalVal, setInternalVal] = useState<RangeSliderValue>(
    value ?? defaultValue
  );

  // Sync internal state if controlled value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalVal(value);
    }
  }, [value]);

  const currentVal = value ?? internalVal;
  const rangeRef = useRef<HTMLDivElement>(null);

  // Normalize current values into numbers for calculations
  const minVal = isDual ? (currentVal as [number, number])[0] : min;
  const maxVal = isDual
    ? (currentVal as [number, number])[1]
    : (currentVal as number);

  // Calculate track position percentage
  const getPercent = useCallback(
    (val: number) => Math.round(((val - min) / (max - min)) * 100),
    [min, max]
  );

  // Update highlight bar width/position
  useEffect(() => {
    if (!rangeRef.current) return;

    const minPercent = isDual ? getPercent(minVal) : 0;
    const maxPercent = getPercent(maxVal);

    rangeRef.current.style.left = `${minPercent}%`;
    rangeRef.current.style.width = `${maxPercent - minPercent}%`;
  }, [minVal, maxVal, isDual, getPercent]);

  const updateValue = (newValue: RangeSliderValue) => {
    if (value == null) {
      setInternalVal(newValue);
    }
    onChange?.(newValue);
  };

  // Handler for Single Handle OR Dual-Handle Max thumb
  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(event.target.value);

    if (isDual) {
      const clampedMax = Math.max(newMax, minVal + step);
      updateValue([minVal, clampedMax]);
    } else {
      updateValue(newMax);
    }
  };

  // Handler for Dual-Handle Min thumb
  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(event.target.value), maxVal - step);
    updateValue([newMin, maxVal]);
  };

  return (
    <div className={`range-slider-container ${className}`.trim()}>
      {/* 1. Track Elements */}
      <div className="slider-track" />
      <div ref={rangeRef} className="slider-range-highlight" />

      {/* 2. Optional Min Thumb (Only rendered in Dual-Handle mode) */}
      {isDual && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="thumb thumb--min"
          style={{ zIndex: minVal > max - 10 ? 5 : 3 }}
        />
      )}

      {/* 3. Main Thumb (Single Value or Dual Max Value) */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={handleMaxChange}
        className="thumb thumb--max"
        style={{ zIndex: 4 }}
      />
    </div>
  );
};
