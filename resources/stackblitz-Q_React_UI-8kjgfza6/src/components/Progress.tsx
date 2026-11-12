import React from 'react';

export type ProgressVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'dark';

export interface ProgressProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Current value (0 to max) */
  value?: number;
  /** Minimum value (Default: 0) */
  min?: number;
  /** Maximum value (Default: 100) */
  max?: number;
  /** Color variant matching theme colors */
  variant?: ProgressVariant;
  /** Height of the progress container (e.g., '20px', '1.25rem') */
  height?: string | number;
  /** Shows striped background pattern */
  striped?: boolean;
  /** Animates the striped background */
  animated?: boolean;

  /** transition width or value */
  transition?: boolean;

  /** Label content displayed inside the progress bar pseudo-element */
  label?: React.ReactNode;
  /** Accessible label for screen readers */
  ariaLabel?: string;
  /** Custom CSS class */
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
  const percentage = Math.min(
    100,
    Math.max(0, ((value - min) / (max - min)) * 100)
  );

  const progressStyle: React.CSSProperties = {
    ...style,
    '--prog-width': `${percentage}%`,
    ...(typeof label === 'string' || typeof label === 'number'
      ? { '--prog-label': `"${label}"` }
      : {}),
    ...(height
      ? { height: typeof height === 'number' ? `${height}px` : height }
      : {}),
  } as React.CSSProperties;

  const progressClasses = [
    'progress',
    `bg-${variant}`,
    transition ? 'progress-transition' : '',
    striped ? 'progress-striped' : '',
    animated ? 'progress-animated' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={progressClasses}
      style={progressStyle}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={
        ariaLabel || (typeof label === 'string' ? label : 'Progress bar')
      }
      {...restProps}
    >
      {/* Visual node for JSX label nodes if non-string children are passed */}
      {typeof label !== 'string' && typeof label !== 'number' && label && (
        <span className="progress-label-content">{label}</span>
      )}
    </div>
  );
};
