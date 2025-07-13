import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Створити нову замітку',
  description: 'Створіть нову замітку та збережіть її як чернетку або опублікуйте.',
  openGraph: {
    title: 'Створити нову замітку',
    description: 'Створіть нову замітку та збережіть її як чернетку або опублікуйте.',
    url: 'https://08-zustand-one-alpha.vercel.app/notes/action/create', 
    images: [
      {
        url: 'https://placehold.co/800x600/aabbcc/ffffff?text=Create+Note+OG',
        width: 800,
        height: 600,
        alt: 'Створити замітку',
      },
    ],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
