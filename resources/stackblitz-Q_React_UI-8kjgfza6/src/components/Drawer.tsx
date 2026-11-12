import './Drawer.css';

import React, { useRef, useEffect, useImperativeHandle } from 'react';

export type DrawerPosition = 'start' | 'end' | 'top' | 'bottom';

export interface DrawerProps {
  /** Controls visibility of the drawer */
  open: boolean;
  /** Callback fired when the drawer requests to close (ESC key, backdrop click, or close button) */
  onClose: () => void;
  /** Drawer position edge (Default: 'end') */
  position?: DrawerPosition;
  /** Title rendered in the drawer header */
  title?: React.ReactNode;
  /** Custom header element (Overrides default title/close button header) */
  header?: React.ReactNode;
  /** Content inside the drawer body */
  children: React.ReactNode;
  /** Footer content rendered at the bottom of the drawer */
  footer?: React.ReactNode;
  /** Closes the drawer when clicking on the backdrop overlay (Default: true) */
  closeOnBackdropClick?: boolean;
  /** Locks body scrolling when open (Default: true) */
  lockScroll?: boolean;
  /** Forces the dialog element to render in the DOM when closed (Default: false) */
  forceRender?: boolean;
  /** Additional custom CSS class names for the dialog container */
  className?: string;
}

export const Drawer = React.forwardRef<HTMLDialogElement, DrawerProps>(
  (
    {
      open,
      onClose,
      position = 'start',
      title,
      header,
      children,
      footer,
      closeOnBackdropClick = true,
      lockScroll = true,
      forceRender, //  = false
      className = '',
    },
    ref
  ) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement);

    // Track whether the drawer has ever opened for lazy-mounting
    const hasOpenedRef = useRef(open || forceRender);
    if (open && !hasOpenedRef.current) {
      hasOpenedRef.current = true;
    }

    // 1. Manage native <dialog> modal state
    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (open) {
        if (!dialog.open) {
          dialog.showModal();
        }
      } else {
        if (dialog.open) {
          dialog.close();
        }
      }
    }, [open]);

    // Detect if the browser supports both CSS :has() and scrollbar-gutter
    const supportsCssScrollLock =
      // typeof window !== 'undefined' &&
      typeof CSS !== 'undefined' &&
      CSS.supports?.('scrollbar-gutter', 'stable') &&
      CSS.supports?.('selector(:has(*))');

    // 2. Lock Document Scroll when Drawer is Open
    useEffect(() => {
      if (!open || !lockScroll || supportsCssScrollLock) return;

      const body = document.body;
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      const originalOverflow = body.style.overflow;
      const originalPaddingRight = body.style.paddingRight;

      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        body.style.overflow = originalOverflow;
        body.style.paddingRight = originalPaddingRight;
      };
    }, [open, lockScroll]);

    // 3. Intercept native cancel event (triggered when user presses ESC)
    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      const handleCancel = (e: Event) => {
        e.preventDefault();
        onClose();
      };

      dialog.addEventListener('cancel', handleCancel);
      return () => dialog.removeEventListener('cancel', handleCancel);
    }, [onClose]);

    // 4. Handle click on backdrop overlay
    const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
      if (!closeOnBackdropClick) return;

      if (e.target === dialogRef.current) {
        onClose();
      }
    };

    if (!hasOpenedRef.current && !forceRender) {
      return null;
    }

    const drawerClasses = [
      'drawer',
      `drawer-${position}`,
      lockScroll ? 'lockScroll' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <dialog
        ref={dialogRef}
        className={drawerClasses}
        onClick={handleDialogClick}
      >
        <div className="drawer-content">
          {header !== undefined ? (
            header
          ) : (
            <div className="drawer-header">
              {title && <h5 className="drawer-title">{title}</h5>}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
          )}

          <div className="drawer-body">{children}</div>

          {footer && <div className="drawer-footer">{footer}</div>}
        </div>
      </dialog>
    );
  }
);

// Drawer.displayName = 'Drawer';
