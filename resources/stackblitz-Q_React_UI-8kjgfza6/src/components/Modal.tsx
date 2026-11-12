import './Modal.css';

import { useEffect, useRef } from 'react';

export interface ModalProps
  extends Omit<React.ComponentPropsWithoutRef<'dialog'>, 'open' | 'onClose'> {
  /** Controls open/close state of the modal. Default: false */
  open?: boolean;
  /** Optional callback fired when the Modal opens */
  onOpen?: () => void;
  /** Callback fired when the user requests closing the modal */
  onClose: () => void;
  /** Allow closing the modal when pressing the Escape key. Default: true */
  keyboard?: boolean;
  /**
   * Controls backdrop behavior:
   * - true: displays backdrop and closes modal on outside click
   * - false: hides backdrop and allows user interaction with background elements
   * - 'lock': displays backdrop but disables outside click to close
   * Default: true
   */
  backdrop?: boolean | 'lock';

  /** Locks body scrolling when open (Default: true) */
  lockScroll?: boolean;

  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  open = false,
  onOpen,
  onClose,
  keyboard = true,
  backdrop = true,
  lockScroll = true,
  className = '',
  children,
  onClick,
  ...restDialogProps
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Lazy load polyfill only if native <dialog> or showModal is unsupported
  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    const isNativeSupported =
      typeof HTMLDialogElement === 'function' &&
      typeof dialogElement.showModal === 'function';

    if (!isNativeSupported) {
      const loadPolyfill = async () => {
        const dialogPolyfill = (await import('dialog-polyfill')).default;
        await import('dialog-polyfill/dist/dialog-polyfill.css');

        if (dialogRef.current) {
          dialogPolyfill.registerDialog(dialogRef.current);
        }
      };

      loadPolyfill().catch((err) =>
        console.error('Failed to load dialog polyfill:', err)
      );
    }
  }, []);

  // Sync state: showModal() vs show(), and fire onOpen callback
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        if (backdrop === false) {
          // Open non-modal (allows background interaction)
          dialog.show();
        } else {
          // Open top-layer modal with backdrop
          dialog.showModal();
        }
        onOpen?.();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open, backdrop, onOpen]);

  // // Handle Escape key behavior (`keyboard` prop)
  // useEffect(() => {
  //   const dialog = dialogRef.current;
  //   if (!dialog) return;

  //   // Handle standard modal cancel event (Escape key in showModal mode)
  //   const handleCancel = (event: Event) => {
  //     if (!keyboard) {
  //       event.preventDefault();
  //     }
  //   };

  //   // Listener for Escape key when opened in non-modal mode (.show())
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.key === 'Escape' && dialog.open) {
  //       if (keyboard) {
  //         onClose();
  //       } else {
  //         event.preventDefault();
  //       }
  //     }
  //   };

  //   const handleClose = () => {
  //     onClose();
  //   };

  //   dialog.addEventListener('cancel', handleCancel);
  //   dialog.addEventListener('close', handleClose);
  //   window.addEventListener('keydown', handleKeyDown);

  //   return () => {
  //     dialog.removeEventListener('cancel', handleCancel);
  //     dialog.removeEventListener('close', handleClose);
  //     window.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, [keyboard, onClose]);

  // Handle Escape key behavior & Tab key focus trap for non-modal mode
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      if (!keyboard) {
        event.preventDefault();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!dialog.open) return;

      // Escape key handler for non-modal mode (.show())
      if (event.key === 'Escape') {
        if (keyboard) {
          onClose();
        } else {
          event.preventDefault();
        }
      }

      // Manual Tab Key Focus Trap for non-modal mode (backdrop={false})
      if (event.key === 'Tab' && backdrop === false) {
        const focusableElements = dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    const handleClose = () => {
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('close', handleClose);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('close', handleClose);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyboard, backdrop, onClose]);

  // Handle backdrop click behavior
  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    // Preserve custom onClick passed via extended standard props
    onClick?.(event);

    if (backdrop === false || backdrop === 'lock') {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const isClickOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (isClickOutside) {
      onClose();
    }
  };

  const classes = [
    'modal',
    // `drawer-${position}`,
    lockScroll ? 'lockScroll' : '',
    backdrop === false ? 'no-backdrop' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className={classes}
      {...restDialogProps}
    >
      {children}
    </dialog>
  );
};
