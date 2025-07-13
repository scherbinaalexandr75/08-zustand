import { fetchNotes } from '../../../../lib/api';
import NotesClient from './Notes.client';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const {slug} = await params;
  const filter = slug?.[0] === "All" ? undefined : slug?.[0];
  const tag = filter || "All notes";

const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
 const path = filter ? `/notes/filter/${encodeURIComponent(filter)}` : '/notes/filter/All';

  return {
    title: tag,
    description: `Note filtered by: ${tag}`,
    openGraph: {
      title: tag,
      description: `Note filtered by: ${tag}`,
      url: `${BASE_URL}${path}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'Note Hub Filter View',
        },
      ],
    },
  };
}

const App = async ({ params }: Props) => {
 const { slug } = await params;
  const tag = slug?.[0] === 'All' ? undefined : slug?.[0];
  const data = await fetchNotes('', 1, tag);

  return (
    <>
      <NotesClient items={data} initialTag={tag} />
    </>
  );
};

export default App;
