import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import TanStackQueryProvider from '@/components/TanStackProvider/TanStackProvider';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';


const roboto = Roboto({
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
  subsets: ['latin', 'cyrillic'],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Note Hub | Ваш центр організації нотаток',
  description: 'Note Hub – це інтуїтивно зрозумілий застосунок для створення, зберігання та керування вашими нотатками. Організуйте свої думки, завдання та ідеї в одному місці.',
  openGraph: {
    title: 'Note Hub | Зручні нотатки для кожного',
    description: 'Легко створюйте, упорядковуйте та переглядайте свої нотатки. Note Hub допоможе вам залишатися організованим та продуктивним у будь-який час.',
    url: BASE_URL,
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Note Hub | Інтуїтивний інтерфейс для ваших нотаток',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="uk"> 
      <body className={`${roboto.variable}`}>
        <TanStackQueryProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackQueryProvider>
      </body>
    </html>
  );
}