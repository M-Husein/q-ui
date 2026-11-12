import React, { useId, useRef, useState } from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className,
}) => {
  const id = useId().replace(/:/g, '');
  const anchor = `--q-anchor-${id}`;
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const show = () => {
    if (!mounted) setMounted(true);
    requestAnimationFrame(() => ref.current?.showPopover());
  };
  const hide = () => ref.current?.hidePopover();

  const child = React.cloneElement(children as React.ReactElement<any>, {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    'aria-describedby': id,
    style: { ...((children as React.ReactElement<any>).props.style || {}), anchorName: anchor },
  });

  return (
    <>
      {child}
      {mounted && (
        <div
          id={id}
          ref={ref}
          popover="hint"
          role="tooltip"
          className={`q-tooltip ${className ?? ''}`.trim()}
          style={{ positionAnchor: anchor } as React.CSSProperties}
        >
          {content}
        </div>
      )}
    </>
  );
};
