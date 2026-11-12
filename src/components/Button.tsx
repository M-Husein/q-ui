import React from 'react';

export type QButtonKind =
  | 'main'
  | 'success'
  | 'error'
  | 'warn'
  | 'info'
  | 'ghost'
  | 'link'
  | (string & {});

export type QButtonSize = 'sm' | 'md' | 'lg' | undefined;

export interface QBaseButtonProps {
  kind?: QButtonKind;
  size?: QButtonSize;
  outline?: boolean;
  base?: string;
  className?: string;
  disabled?: boolean;
}

export type QPolymorphicButtonProps<C extends React.ElementType> = QBaseButtonProps &
  Omit<
    React.ComponentPropsWithoutRef<C>,
    keyof QBaseButtonProps | 'as'
  > & { as?: C };

type QButtonComponent = <C extends React.ElementType = 'button'>(
  props: QPolymorphicButtonProps<C>
) => React.ReactElement | null;

export const Button: QButtonComponent = React.forwardRef(
  <C extends React.ElementType = 'button'>(
    {
      as,
      type,
      base = 'q-btn',
      kind = 'main',
      size,
      outline,
      className = '',
      disabled,
      onClick,
      onKeyDown,
      ...restProps
    }: QPolymorphicButtonProps<C>,
    ref: React.ForwardedRef<any>
  ) => {
    const Component = as || 'button';
    const isNativeButton = Component === 'button' || Component === 'input';

    const kindClass =
      kind && kind !== 'main'
        ? `${outline ? 'q-outline ' : ''}q-${kind}`
        : outline
          ? 'q-outline'
          : '';

    const classes = [base, kindClass, size ? `q-${size}` : '', className]
      .filter(Boolean)
      .join(' ')
      .trim();

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
  }
) as unknown as QButtonComponent;
