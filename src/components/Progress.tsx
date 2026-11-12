import React from 'react';

export type ProgressVariant =
  | 'primary'
  | 'success'
  | 'error'
  | 'warn'
  | 'info';

export interface ProgressProps extends React.ComponentPropsWithoutRef<'div'> {
  value?: number;
  min?: number;
  max?: number;
  variant?: ProgressVariant;
  height?: string | number;
  striped?: boolean;
  animated?: boolean;
  transition?: boolean;
  label?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  min = 0,
  max = 100,
  variant = 'primary',
  height,
  striped = false,
  animated = false,
  transition = true,
  label,
  ariaLabel,
  className = '',
  style,
  ...restProps
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const variantClass =
    variant === 'primary' ? '' : `progress-${variant === 'error' ? 'error' : variant}`;

  const classes = [
    'progress',
    variantClass,
    transition ? 'q-transition' : '',
    striped ? 'q-striped' : '',
    animated ? 'q-animated' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const progressStyle: React.CSSProperties = {
    ...style,
    ['--p-w' as any]: `${percentage}%`,
    ...(typeof label === 'string' || typeof label === 'number'
      ? { ['--p-label' as any]: `"${label}"` }
      : {}),
    ...(height
      ? { ['--p-h' as any]: typeof height === 'number' ? `${height}px` : height }
      : {}),
  } as React.CSSProperties;

  return (
    <div
      className={classes}
      style={progressStyle}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={ariaLabel || (typeof label === 'string' ? label : 'Progress')}
      {...restProps}
    >
      {typeof label !== 'string' && typeof label !== 'number' && label && (
        <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
      )}
    </div>
  );
};
