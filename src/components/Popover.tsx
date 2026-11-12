import React, { useId, useRef, useState, useEffect } from 'react';

export interface PopoverProps {
  trigger: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
  children: React.ReactNode;
  className?: string;
  onToggle?: (isOpen: boolean, e: React.ToggleEvent<HTMLDivElement>) => void;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  className,
  onToggle,
}) => {
  const id = useId().replace(/:/g, '');
  const anchor = `--q-anchor-${id}`;
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // The popover element must exist before the first click: the trigger's
  // popovertarget can only open an element that is already in the DOM.
  // (Previously it was mounted only after a toggle event, which never fired,
  // so the first click did nothing.)
  const handleToggle = (e: React.ToggleEvent<HTMLDivElement>) => {
    const open = e.newState === 'open';
    setIsOpen(open);
    onToggle?.(open, e);
  };

  // Fallback for browsers without the Popover API: toggle a data attribute and
  // let the CSS polyfill (html.q-no-popover-api [popover][data-popover-open]) show it.
  useEffect(() => {
    const supports =
      typeof HTMLElement !== 'undefined' &&
      typeof HTMLElement.prototype.showPopover === 'function';
    if (supports) return;
    document.documentElement.classList.add('q-no-popover-api');
    const el = ref.current;
    if (!el) return;
    el.setAttribute('popover', 'manual');
    const open = isOpen;
    if (open) el.setAttribute('data-popover-open', '');
    else el.removeAttribute('data-popover-open');
  }, [isOpen]);

  const triggerEl = React.cloneElement(trigger, {
    popoverTarget: id,
    popoverTargetAction: 'toggle',
    'aria-expanded': isOpen,
    'aria-controls': id,
    style: { ...(trigger.props.style || {}), anchorName: anchor },
  } as any);

  return (
    <>
      {triggerEl}
      <div
        id={id}
        ref={ref}
        popover="auto"
        className={`q-popover ${className ?? ''}`.trim()}
        style={{ positionAnchor: anchor } as React.CSSProperties}
        onToggle={handleToggle}
      >
        {children}
      </div>
    </>
  );
};
