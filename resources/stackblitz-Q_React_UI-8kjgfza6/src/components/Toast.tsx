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
  duration?: number; // Auto-hide duration in ms (default: 4000)
  /**
   * Position of the toast notification on the screen:
   * - "top": slides top to bottom
   * - "bottom": slides bottom to top
   * - "bottomLeft": slides left to right
   * - "topLeft": slides left to right
   * - "bottomRight": slides right to left
   * - "topRight": slides right to left
   * Default: "bottomLeft"
   */
  position?: ToastPosition;
  children: React.ReactNode;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  open,
  onClose,
  duration = 3e3,
  position = 'bottomLeft',
  children,
  className = '',
}) => {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toastNode = toastRef.current;
    if (!toastNode) return;

    if (open) {
      toastNode.showPopover();

      if (duration > 0) {
        const timer = setTimeout(() => {
          onClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      toastNode.hidePopover();
    }
  }, [open, duration, onClose]);

  const positionClass = `toast-pos-${position}`;

  return (
    <div
      ref={toastRef}
      popover="manual"
      role="status" // alert
      aria-live="polite" // assertive
      // aria-atomic="true"
      className={`custom-toast ${positionClass} ${className}`.trim()}
    >
      {/* <div className="toast-header"></div> */}
      <div className="toast-body">{children}</div>
      <button
        type="button"
        onClick={onClose}
        className="toast-close-btn"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};
