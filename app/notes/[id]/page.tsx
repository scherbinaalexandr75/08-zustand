import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteById } from '@/lib/api';
import type { Metadata } from 'next';

type Props = { 
  params: Promise<{id: string }>;
};



export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const {id} = await params;
  const note = await fetchNoteById(Number(id));

  if (!note) {
    return {
      title: 'Нотатку не знайдено — Note Hub',
      description: 'На жаль, нотатку з таким ідентифікатором не знайдено.',
    };
  }

  const title = `${note.title} — Note Hub`;
  const description = note.content || 'Перегляд детальної інформації про нотатку.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.example.com/notes/${id}`, // замініть на ваш домен
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'Note Hub Note View',
        },
      ],
      type: 'article',
    },
  };
}

const NoteItem = async ({ params }: Props) => {
    const {id} = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(Number(id)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default NoteItem;
