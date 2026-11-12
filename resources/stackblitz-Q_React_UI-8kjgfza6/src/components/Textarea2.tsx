import React, { useState, useRef, useImperativeHandle } from 'react';

export type TextareaResize = 'vertical' | 'horizontal' | 'both' | false;

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Automatically expands/contracts height based on text content */
  autosize?: boolean;

  /** Minimum rows to display (Active when autosize is enabled) */
  minRows?: number;

  /** Maximum rows to display before showing a scrollbar (Active when autosize is enabled) */
  maxRows?: number;

  /** Controls manual resize handle behavior */
  resize?: TextareaResize;

  /** Additional custom CSS class names */
  className?: string;

  /** Custom inline styles */
  style?: React.CSSProperties;
}

const detectFieldSizingSupport = (): boolean => {
  // if (typeof window === 'undefined') return false;

  // 1. Primary check: Standard CSS.supports engine
  // if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
  //   if (CSS.supports('field-sizing', 'content')) {
  //     return true;
  //   }
  // }

  // if (typeof CSS !== 'undefined' && CSS.supports?.('field-sizing', 'content')) {
  //   return true;
  // }
  // OR

  if (globalThis.CSS?.supports?.('field-sizing', 'content')) {
    return true;
  }

  // 2. Fallback DOM check: Verify value retention for 'content'
  // Fallback: Create a test element (for older browsers without CSS.supports)
  try {
    const testEl = document.createElement('textarea');

    // Check if the property exists on CSSStyleDeclaration
    if ('fieldSizing' in testEl.style) {
      // Attempt to assign the 'content' value
      testEl.style.fieldSizing = 'content';

      // If the browser supports 'content', the property holds 'content'.
      // If unsupported, the browser discards it and returns an empty string ("").
      return testEl.style.fieldSizing === 'content';
    }
  } catch {
    return false;
  }

  return false;

  // Simple fallback
  // const testEl = document.createElement('textarea')
  // testEl.style.fieldSizing = 'content'
  // return testEl.style.fieldSizing === 'content'
};

// Client-only direct check for native field-sizing support
// const supportsFieldSizing =
//   typeof window !== 'undefined' &&
//   typeof CSS !== 'undefined' &&
//   CSS.supports?.('field-sizing', 'content');

const supportsFieldSizing = detectFieldSizingSupport();

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      autosize,
      minRows,
      maxRows,
      resize,
      rows = 3,
      value,
      defaultValue,
      onChange,
      className = '',
      style,
      disabled,
      ...restProps
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    // Fallback state used exclusively when native field-sizing is not supported
    const [internalValue, setInternalValue] = useState<string>(
      '' + (value ?? defaultValue) ?? ''
    );

    const isControlled = value != null;
    const currentText = isControlled ? String(value ?? '') : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled && !supportsFieldSizing) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const effectiveMinRows = autosize && minRows != null ? minRows : rows;
    const effectiveMaxRows = autosize ? maxRows : undefined;

    const textareaClasses = [
      'form-control',
      autosize ? 'textarea-autosize' : '',
      resize != null ? `resize-${resize === false ? 'none' : resize}` : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const customStyle: React.CSSProperties = {
      ...style,
      ...(autosize && {
        '--min-rows': effectiveMinRows,
        ...(effectiveMaxRows != null && {
          '--max-rows': effectiveMaxRows,
        }),
      }),
    } as React.CSSProperties;

    const textareaNode = (
      <textarea
        ref={textareaRef}
        rows={effectiveMinRows}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        className={textareaClasses}
        style={autosize ? customStyle : style}
        onChange={handleChange}
        {...restProps}
      />
    );

    // 1. Native field-sizing path OR autosize={false}
    if (!autosize || supportsFieldSizing) {
      return textareaNode;
    }

    // 2. Legacy browser fallback path (CSS grid wrapper + replicate attribute)
    return (
      <div
        // className={`textarea-autosize-wrapper ${disabled ? 'disabled' : ''}`}
        className="textarea-autosize-wrapper"
        data-val={currentText} // `${currentText} `
        style={customStyle}
      >
        {textareaNode}
      </div>
    );
  }
);

// Textarea.displayName = 'Textarea';
