import React, { useRef, useImperativeHandle, useState } from 'react';

export type TextareaResize = 'vertical' | 'horizontal' | 'both' | false;

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autosize?: boolean;
  minRows?: number;
  maxRows?: number;
  resize?: TextareaResize;
  className?: string;
  style?: React.CSSProperties;
}

const supportsFieldSizing = (() => {
  if (typeof globalThis === 'undefined' || !(globalThis as any).CSS?.supports)
    return false;
  return !!(globalThis as any).CSS.supports('field-sizing', 'content');
})();

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
    const innerRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

    const [internal, setInternal] = useState<string>(
      '' + (value ?? defaultValue ?? '')
    );
    const isControlled = value != null;
    const current = isControlled ? String(value ?? '') : internal;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled && !supportsFieldSizing) setInternal(e.target.value);
      onChange?.(e);
    };

    const effectiveMinRows = autosize && minRows != null ? minRows : rows;
    const effectiveMaxRows = autosize ? maxRows : undefined;

    const classes = [
      'q-textarea',
      autosize ? 'q-autosize' : '',
      resize != null ? `q-resize-${resize === false ? 'none' : resize}` : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    const customStyle: React.CSSProperties = {
      ...style,
      ...(autosize
        ? {
            ['--min-rows' as any]: effectiveMinRows,
            ...(effectiveMaxRows != null
              ? { ['--max-rows' as any]: effectiveMaxRows }
              : {}),
          }
        : {}),
    };

    const node = (
      <textarea
        ref={innerRef}
        rows={effectiveMinRows}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        className={classes}
        style={autosize ? customStyle : style}
        onChange={handleChange}
        {...restProps}
      />
    );

    if (!autosize || supportsFieldSizing) return node;

    return (
      <div className="q-textarea-autosize-wrapper" data-val={current} style={customStyle}>
        {node}
      </div>
    );
  }
);
