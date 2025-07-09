import { fetchNotes } from '../../../../lib/api';
import NotesClient from './Notes.client';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const filterSlug = params.slug?.[0] || 'All';
  const isAll = filterSlug === 'All';

  const readableTag = isAll
    ? 'Ecs yjnfnrb'
    : decodeURIComponent(filterSlug.replace(/-/g, ' '));
  const title = `Фільтр: ${readableTag} - Note Hub`;
  const description = isAll ? '' : `dgfgdfg: ${readableTag}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://dfsdfd.com/notes/filter/${filterSlug}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'Note Hub Filter View',
        },
      ],
      type: 'website',
    },
  };
}

const App = async ({ params }: Props) => {
 const { slug } = params;
  const tag = slug?.[0] === 'All' ? undefined : slug?.[0];
  const data = await fetchNotes('', 1, tag);

  return (
    <>
      <NotesClient items={data} initialTag={tag} />
    </>
  );
};

export default App;
