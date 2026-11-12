import React, { useId, useRef, useState } from 'react';

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
  const [mounted, setMounted] = useState(false);

  const handleToggle = (e: React.ToggleEvent<HTMLDivElement>) => {
    const open = e.newState === 'open';
    setIsOpen(open);
    if (open && !mounted) setMounted(true);
    onToggle?.(open, e);
  };

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
      {(forceRender || mounted) && (
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
