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
    const el = ref.current;
    if (!el) return;
    if (typeof el.showPopover === 'function') el.showPopover();
    else {
      document.documentElement.classList.add('q-no-popover-api');
      el.setAttribute('popover', 'manual');
      el.setAttribute('data-popover-open', '');
    }
  };
  const hide = () => {
    const el = ref.current;
    if (!el) return;
    if (typeof el.hidePopover === 'function') el.hidePopover();
    else el.removeAttribute('data-popover-open');
  };

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
