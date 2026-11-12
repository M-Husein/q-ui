import React, { useRef, useState, useEffect, useCallback } from 'react';

export type RangeSliderValue = number | [number, number];

export interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: RangeSliderValue;
  defaultValue?: RangeSliderValue;
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
  const isDual = Array.isArray(value ?? defaultValue);
  const [internal, setInternal] = useState<RangeSliderValue>(value ?? defaultValue);
  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  const current = value ?? internal;
  const ref = useRef<HTMLDivElement>(null);

  const minVal = isDual ? (current as [number, number])[0] : min;
  const maxVal = isDual ? (current as [number, number])[1] : (current as number);

  const getPercent = useCallback(
    (v: number) => Math.round(((v - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    if (!ref.current) return;
    const minPct = isDual ? getPercent(minVal) : 0;
    const maxPct = getPercent(maxVal);
    ref.current.style.left = `${minPct}%`;
    ref.current.style.width = `${maxPct - minPct}%`;
  }, [minVal, maxVal, isDual, getPercent]);

  const update = (next: RangeSliderValue) => {
    if (value == null) setInternal(next);
    onChange?.(next);
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(Number(e.target.value), minVal + step);
    if (isDual) update([minVal, Math.min(v, max)]);
    else update(v);
  };

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(Number(e.target.value), maxVal - step);
    update([Math.max(v, min), maxVal]);
  };

  return (
    <div className={`q-slider ${className}`.trim()}>
      <div className="q-slider-track" />
      <div ref={ref} className="q-slider-fill" />
      {isDual && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMin}
          className="q-range"
          style={{ zIndex: minVal > max - 10 ? 5 : 3 }}
        />
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={handleMax}
        className="q-range"
        style={{ zIndex: 4 }}
      />
    </div>
  );
};
