import React, { useId, useRef, useState, useEffect } from 'react';

export interface PopoverProps {
  trigger: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
  forceRender?: boolean;
  children: React.ReactNode;
  className?: string;
  onToggle?: (isOpen: boolean, e: React.ToggleEvent<HTMLDivElement>) => void;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  forceRender,
  children,
  className,
  onToggle,
}) => {
  const id = useId().replace(/:/g, '');
  const anchor = `--q-anchor-${id}`;
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  // The popover div is not mounted by default; it is rendered on the first
  // trigger click (handleTriggerClick), unless forceRender is set.
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const handleToggle = (e: React.ToggleEvent<HTMLDivElement>) => {
    const open = e.newState === 'open';
    setIsOpen(open);
    if (open && !hasBeenOpened) setHasBeenOpened(true);
    onToggle?.(open, e);
  };

  // The popover element isn't in the DOM until the trigger is first clicked, so
  // mount it here before the native popovertarget can open it.
  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasBeenOpened && !forceRender) setHasBeenOpened(true);
    trigger.props.onClick?.(e);
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
    onClick: handleTriggerClick,
    style: { ...(trigger.props.style || {}), anchorName: anchor },
  } as any);

  return (
    <>
      {triggerEl}
      {(!!forceRender || hasBeenOpened) && (
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
      )}
    </>
  );
};
