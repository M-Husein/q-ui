import { useRef, useState } from 'react';

export interface RangeProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue'> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  showTooltip?: boolean;
  onChange?: (value: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Range = ({
  value: controlled,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  showTooltip = true,
  onChange,
  className = '',
  disabled,
  style,
  ref,
  ...rest
}: RangeProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const innerRef = useRef<HTMLInputElement>(null);
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = useState<number>(
    isControlled ? controlled! : defaultValue
  );
  const current = isControlled ? controlled! : internal;

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (!isControlled) setInternal(v);
    onChange?.(v, e);
  };

  const range = max - min || 1;
  const pct = Math.min(1, Math.max(0, (current - min) / range));
  const containerClass = [
    'q-range-container',
    showTooltip ? 'q-range-tip' : '',
    disabled ? 'q-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const cssVars = showTooltip
    ? ({
        ['--percentage' as any]: pct,
        ['--data-value' as any]: current,
      } as React.CSSProperties)
    : undefined;

  return (
    <div className={containerClass} style={{ ...cssVars, ...style }}>
      <input
        ref={ref ?? innerRef}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        onChange={handle}
        {...rest}
      />
    </div>
  );
};
