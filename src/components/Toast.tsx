import React, { useEffect, useRef } from 'react';

export type ToastPosition =
  | 'top'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

export interface ToastProps {
  open: boolean;
  onClose: () => void;
  duration?: number;
  position?: ToastPosition;
  children: React.ReactNode;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  open,
  onClose,
  duration = 3000,
  position = 'bottomLeft',
  children,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open) {
      if (typeof node.showPopover === 'function') node.showPopover();
      else {
        document.documentElement.classList.add('q-no-popover-api');
        node.setAttribute('popover', 'manual');
        node.setAttribute('data-popover-open', '');
      }
      if (duration > 0) {
        const t = setTimeout(() => onClose(), duration);
        return () => clearTimeout(t);
      }
    } else {
      if (typeof node.hidePopover === 'function') node.hidePopover();
      else node.removeAttribute('data-popover-open');
    }
  }, [open, duration, onClose]);

  const posClass = `pos-${position}`;

  return (
    <div
      ref={ref}
      popover="manual"
      role="status"
      aria-live="polite"
      className={`q-toast ${posClass} ${className}`.trim()}
    >
      <div>{children}</div>
      <button
        type="button"
        className="q-toast-close"
        aria-label="Close"
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  );
};
