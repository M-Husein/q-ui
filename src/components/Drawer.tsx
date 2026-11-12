import React, { useRef, useEffect } from 'react';

export type DrawerPosition = 'start' | 'end' | 'top' | 'bottom';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  position?: DrawerPosition;
  title?: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdropClick?: boolean;
  lockScroll?: boolean;
  forceRender?: boolean;
  className?: string;
}

export const Drawer = ({
  open,
  onClose,
  position = 'start',
  title,
  header,
  children,
  footer,
  closeOnBackdropClick = true,
  lockScroll = true,
  forceRender,
  className = '',
  ref,
}: DrawerProps & { ref?: React.Ref<HTMLDialogElement> }) => {
  const innerRef = useRef<HTMLDialogElement>(null);
  const setRefs = (node: HTMLDialogElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') (ref as (n: HTMLDialogElement | null) => void)(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDialogElement | null>).current = node;
  };
  const dialogRef = innerRef;

  const hasOpened = useRef(open || forceRender);
  if (open && !hasOpened.current) hasOpened.current = true;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

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

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!closeOnBackdropClick) return;
    if (e.target === dialogRef.current) onClose();
  };

  if (!hasOpened.current && !forceRender) return null;

  const classes = [
    'q-drawer',
    `q-drawer-${position}`,
    lockScroll ? 'q-lock-scroll' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <dialog ref={setRefs} className={classes} onClick={handleClick}>
      <div className="q-drawer-content">
        {header !== undefined ? (
          header
        ) : (
          <div className="q-drawer-header">
            {title && <h5 className="q-drawer-title">{title}</h5>}
            <button
              type="button"
              className="q-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
        )}
        <div className="q-drawer-body">{children}</div>
        {footer && <div className="q-drawer-footer">{footer}</div>}
      </div>
    </dialog>
  );
};
