import React, { useId, useRef, useState } from 'react';

// Extend HTMLAttributes to include native HTML Popover API attributes
interface PopoverTriggerAttributes
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  popoverTarget?: string;
  popoverTargetAction?: 'toggle' | 'show' | 'hide';
}

export interface PopoverProps {
  // Specify that the trigger element accepts our extended popover attributes
  trigger: React.ReactElement<PopoverTriggerAttributes>;
  forceRender?: boolean;
  children: React.ReactNode;
  className?: string;
  onToggle?: (
    isOpen: boolean,
    event: React.ToggleEvent<HTMLDivElement>
  ) => void;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  forceRender,
  children,
  className,
  onToggle,
}) => {
  const popoverId = useId();
  const anchorName = '--anchor-' + popoverId; // `--anchor-${popoverId.replace(/:/g, '')}`;
  const popoverRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const handleToggle = (evt: React.ToggleEvent<HTMLDivElement>) => {
    const open = evt.newState === 'open';
    setIsOpen(open);

    if (open && !hasBeenOpened) {
      setHasBeenOpened(true);
    }

    onToggle?.(open, evt);
  };

  // Handle initial trigger interaction when popover isn't mounted in DOM yet
  const handleTriggerClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasBeenOpened && !forceRender) {
      setHasBeenOpened(true);
    }
    trigger.props.onClick?.(evt);
  };

  const triggerWithAnchor = React.cloneElement(trigger, {
    popoverTarget: popoverId,
    popoverTargetAction: 'toggle',
    'aria-expanded': isOpen,
    'aria-controls': popoverId,
    onClick: handleTriggerClick,
    style: {
      ...(trigger.props.style || {}),
      anchorName,
    } as React.CSSProperties,
  } as PopoverTriggerAttributes);

  return (
    <>
      {triggerWithAnchor}

      {(!!forceRender || hasBeenOpened) && (
        <div
          id={popoverId}
          ref={popoverRef}
          popover="auto"
          className={'popover' + (className ? ' ' + className : '')}
          style={
            {
              positionAnchor: anchorName,
              // minWidth: `anchor-size(${anchorName} width)`, // Explicit target or anchor-size(width)
            } as React.CSSProperties
          }
          onToggle={handleToggle}
        >
          {children}
        </div>
      )}
    </>
  );
};
