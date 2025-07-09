'use client';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';
import useEscapeClose from '@/hooks/useEscapeClose';

interface NoteModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: NoteModalProps) {
  const handleBackDropClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onClose) onClose();
  };

  useEscapeClose(onClose);

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackDropClose}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.body
  );
}
