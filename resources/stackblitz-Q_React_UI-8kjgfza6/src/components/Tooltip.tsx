import React, { useId, useRef, useState } from 'react';

export interface TooltipProps {
  forceRender?: boolean;
  content: React.ReactNode;
  children: React.ReactElement;
  className?: string;
  onToggle?: (
    isOpen: boolean,
    event: React.ToggleEvent<HTMLDivElement>
  ) => void;
}

export const Tooltip: React.FC<TooltipProps> = ({
  forceRender,
  content,
  children,
  className,
  onToggle,
}) => {
  const tooltipId = useId();
  const anchorName = '--anchor-' + tooltipId; // `--tooltip-anchor-${tooltipId.replace(/:/g, '')}`;
  const tooltipRef = useRef<HTMLDivElement>(null);

  // const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const handleToggle = (evt: React.ToggleEvent<HTMLDivElement>) => {
    const open = evt.newState === 'open';
    // setIsOpen(open);

    if (open && !hasBeenOpened) {
      setHasBeenOpened(true);
    }

    onToggle?.(open, evt);
  };

  // // Handle initial trigger interaction when popover isn't mounted in DOM yet
  // const handleTriggerClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
  //   if (!hasBeenOpened && !forceRender) {
  //     setHasBeenOpened(true);
  //   }
  //   children.props.onClick?.(evt);
  // };

  const showTooltip = () => {
    if (!hasBeenOpened && !forceRender) {
      setHasBeenOpened(true);

      // Handle initial trigger interaction when popover isn't mounted in DOM yet
      requestAnimationFrame(() => {
        tooltipRef.current?.showPopover();
      });
    } else {
      tooltipRef.current?.showPopover();
    }
  };

  const hideTooltip = () => {
    tooltipRef.current?.hidePopover();
  };

  const triggerWithAnchor = React.cloneElement(
    children as React.ReactElement<{
      onMouseEnter?: React.MouseEventHandler;
      onMouseLeave?: React.MouseEventHandler;
      onFocus?: React.FocusEventHandler;
      onBlur?: React.FocusEventHandler;
      'aria-describedby'?: string;
      style?: React.CSSProperties;
    }>,
    {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
      onFocus: showTooltip,
      onBlur: hideTooltip,
      'aria-describedby': tooltipId,
      style: {
        ...(children?.props?.style || {}),
        anchorName: anchorName,
      } as React.CSSProperties,
    }
  );

  return (
    <>
      {triggerWithAnchor}

      {(!!forceRender || hasBeenOpened) && (
        <div
          id={tooltipId}
          ref={tooltipRef}
          onToggle={handleToggle}
          popover="hint" // auto
          role="tooltip"
          className={'tip' + (className ? ' ' + className : '')}
          style={{ positionAnchor: anchorName } as React.CSSProperties}
        >
          {content}
        </div>
      )}
    </>
  );
};
