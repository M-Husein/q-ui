import React, { useRef, useImperativeHandle } from 'react';

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

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      autosize,
      minRows,
      maxRows,
      resize,
      rows = 3,
      className = '',
      style,
      disabled,
      ...restProps
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    // Resolve effective row constraints when autosize is enabled
    const effectiveMinRows = autosize && minRows !== undefined ? minRows : rows;
    const effectiveMaxRows = autosize ? maxRows : undefined;

    // Build conditional modifier classes
    const textareaClasses = [
      'form-control',
      autosize ? 'textarea-autosize' : '',
      resize !== undefined
        ? `resize-${resize === false ? 'none' : resize}`
        : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Calculate dynamic style variables for min/max row clamping fallback
    const customStyle: React.CSSProperties = {
      ...style,
      ...(autosize && {
        '--min-rows': effectiveMinRows,
        ...(effectiveMaxRows !== undefined && {
          '--max-rows': effectiveMaxRows,
        }),
      }),
    } as React.CSSProperties;

    return (
      <textarea
        ref={textareaRef}
        rows={effectiveMinRows}
        disabled={disabled}
        className={textareaClasses}
        style={customStyle}
        {...restProps}
      />
    );
  }
);

// Textarea.displayName = 'Textarea';
