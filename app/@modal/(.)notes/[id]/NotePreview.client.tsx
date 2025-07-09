'use client';
import { useParams, useRouter } from 'next/navigation';
import css from '../../../../components/NotePreview/NotePreview.module.css';
import useEscapeClose from '@/hooks/useEscapeClose';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';

const NotePreview = () => {
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };
  useEscapeClose(handleClose);
  const { id } = useParams<{ id: string }>();
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(Number(id)),
    enabled: !!id,
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }
  if (error || !note) {
    return <p>Something went wrong.</p>;
  }

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <button className={css.backBtn} onClick={handleClose}>
            ← Back
          </button>
          <div className={css.header}>
            <h2>{note.title}</h2>
            <span className={css.tag}>{note.tag}</span>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.createdAt}</p>
        </div>
      </div>
    </Modal>
  );
};

export default NotePreview;
