import React, { useEffect, useRef } from 'react';

export interface ModalProps
  extends Omit<React.ComponentPropsWithoutRef<'dialog'>, 'open' | 'onClose'> {
  open?: boolean;
  onOpen?: () => void;
  onClose: () => void;
  keyboard?: boolean;
  backdrop?: boolean | 'lock';
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
  ...rest
}) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) {
        if (backdrop === false) dialog.show();
        else dialog.showModal();
      }
      onOpen?.();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open, backdrop, onOpen]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleCancel = (e: Event) => {
      if (!keyboard) e.preventDefault();
    };
    const handleClose = () => onClose();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dialog.open) {
        if (keyboard) onClose();
        else e.preventDefault();
      }
    };
    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('close', handleClose);
    window.addEventListener('keydown', handleKey);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('close', handleClose);
      window.removeEventListener('keydown', handleKey);
    };
  }, [keyboard, onClose]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDialogElement>) => {
    onClick?.(e);
    if (backdrop === false || backdrop === 'lock') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isOutside) onClose();
  };

  const classes = [
    'modal',
    lockScroll ? 'q-lock-scroll' : '',
    backdrop === false ? 'q-no-backdrop' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <dialog ref={ref} onClick={handleBackdrop} className={classes} {...rest}>
      <div className="modal-box">
        {children}
      </div>
    </dialog>
  );
};
