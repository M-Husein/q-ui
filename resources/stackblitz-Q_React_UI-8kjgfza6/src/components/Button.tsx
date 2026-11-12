import './Button.css';

import React from 'react';

// Predefined kind themes
export type StandardButtonKind = 'main' | 'success' | 'error' | 'warn' | 'info';

// (string & {}) enables custom kinds (e.g. "ok", "progress") without losing autocomplete in IDEs
export type ButtonKind = StandardButtonKind | (string & {});

export type ButtonSize = 'sm' | 'md' | 'lg' | undefined;

export interface BaseButtonProps {
  /** Visual variant theme */
  kind?: ButtonKind;

  /** Button sizing (md does not apply extra class) */
  size?: ButtonSize;

  /** Applies Bootstrap-style outline border variant */
  outline?: boolean;

  /** Base or prefix className, default "btn" */
  base?: string;

  /** Additional custom class names */
  className?: string;

  /** Disables interaction */
  disabled?: boolean;
}

// 1. Infer props of the targeted component/tag C while stripping our custom BaseButtonProps
export type PolymorphicProps<C extends React.ElementType, Props = {}> = Props &
  BaseButtonProps &
  Omit<
    React.ComponentPropsWithRef<C>,
    keyof BaseButtonProps | keyof Props | 'as'
  > & {
    as?: C;
  };

// 2. Type definition for the forwardRef polymorphic component
export type ButtonComponent = <C extends React.ElementType = 'button'>(
  props: PolymorphicProps<C>
) => React.ReactElement | null;

export const Button: ButtonComponent = React.forwardRef(
  <C extends React.ElementType = 'button'>(
    {
      as,
      type, //  = 'button'
      base = 'btn',
      kind = 'main',
      size, //  = "md"
      outline,
      className = '',
      tabIndex,
      disabled,
      onClick,
      onKeyDown,
      ...restProps
    }: PolymorphicProps<C>,
    ref: React.ForwardedRef<any>
  ) => {
    // Default element to 'button'
    const Component = as || 'button';

    // Elements that natively support button behaviors
    const isNativeButton = Component === 'button' || Component === 'input';

    const buttonClasses = [
      base,
      kind ? `${base}-${outline ? 'outline-' : ''}${kind}` : '',
      size && size !== 'md' ? `${base}-${size}` : '',
      disabled ? 'disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Keyboard accessibility for non-native button elements (div, span, b, i, etc.)
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

    // Construct additional ARIA & accessibility props for non-native tags
    const extraProps: Record<string, any> = {};

    if (isNativeButton) {
      // Only supply default type="button" to native button elements
      // Automatically defaults type to "button" for both <button> and <input> if undefined
      extraProps.type = type ?? 'button';
      extraProps.disabled = disabled;
    } else {
      // Non-native tags (a, div, span, etc.)
      extraProps.role = 'button';
      extraProps.tabIndex = disabled ? -1 : tabIndex ?? 0;
      if (disabled) {
        extraProps['aria-disabled'] = true;
      }
    }

    return (
      <Component
        {...restProps}
        {...extraProps}
        ref={ref}
        className={buttonClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      />
    );
  }
);

// (Button as React.FC).displayName = 'Button';
