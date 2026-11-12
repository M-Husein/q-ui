import React from 'react';

export type QButtonKind =
  | 'primary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'ghost'
  | 'link'
  | (string & {});

export type QButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;

export type QButtonVariant = 'default' | 'outline' | 'dash' | 'soft';

/* Literal class names (Tailwind v4 cannot see dynamic templates). */
const VARIANT_CLASS: Record<QButtonVariant, string> = {
  default: '',
  outline: 'btn-outline',
  dash: 'btn-dash',
  soft: 'btn-soft',
};

/*
 * Tailwind v4 only emits classes that appear as complete string literals in
 * source. Dynamic `btn-${kind}` would be purged, so every DaisyUI color class
 * is spelled out here.
 */
const COLOR_CLASS: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  neutral: 'btn-neutral',
  info: 'btn-info',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
  ghost: 'btn-ghost',
  link: 'btn-link',
};
const SIZE_CLASS: Record<string, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  xl: 'btn-xl',
};

export interface QBaseButtonProps {
  kind?: QButtonKind;
  size?: QButtonSize;
  /** Shorthand for variant="outline". */
  outline?: boolean;
  /** DaisyUI style: outline (default), dash, or soft. */
  variant?: QButtonVariant;
  base?: string;
  className?: string;
  disabled?: boolean;
}

export type QPolymorphicButtonProps<C extends React.ElementType> = QBaseButtonProps &
  Omit<React.ComponentPropsWithoutRef<C>, keyof QBaseButtonProps | 'as'> & {
    as?: C;
    ref?: React.Ref<any>;
  };

type QButtonComponent = <C extends React.ElementType = 'button'>(
  props: QPolymorphicButtonProps<C>
) => React.ReactElement | null;

export const Button = (<C extends React.ElementType = 'button'>({
  as,
  type,
  base = 'btn',
  kind = 'primary',
  size,
  outline,
  variant,
  className = '',
  disabled,
  onClick,
  onKeyDown,
  ref,
  ...restProps
}: QPolymorphicButtonProps<C>) => {
  const Component = as || 'button';
  const isNativeButton = Component === 'button' || Component === 'input';

  const colorClass = (kind && COLOR_CLASS[kind]) || '';
  const styleClass = VARIANT_CLASS[variant ?? (outline ? 'outline' : 'default')] ?? '';
  const kindClass = [colorClass, styleClass, (size && SIZE_CLASS[size]) || '']
    .filter(Boolean)
    .join(' ');

  const classes = [base, kindClass, className].filter(Boolean).join(' ').trim();

  const handleKeyDown = (evt: React.KeyboardEvent<any>) => {
    onKeyDown?.(evt);
    if (!isNativeButton && !disabled) {
      if (evt.key === ' ' || evt.key === 'Enter') {
        evt.preventDefault();
        (evt.target as HTMLElement).click();
      }
    }
  };

  const handleClick = (evt: React.MouseEvent<any>) => {
    if (disabled) {
      evt.preventDefault();
      evt.stopPropagation();
      return;
    }
    onClick?.(evt);
  };

  const extraProps: Record<string, any> = {};
  if (isNativeButton) {
    extraProps.type = type ?? 'button';
    extraProps.disabled = disabled;
  } else {
    extraProps.role = 'button';
    extraProps.tabIndex = disabled ? -1 : (restProps as any).tabIndex ?? 0;
    if (disabled) extraProps['aria-disabled'] = true;
  }

  return (
    <Component
      {...restProps}
      {...extraProps}
      ref={ref}
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    />
  );
}) as unknown as QButtonComponent;
