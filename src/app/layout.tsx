import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Providers } from './providers';
import { ThemeInitializer } from '@/components/ThemeInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MovieFlix - Netflix Style Movie Search',
  description: 'Search and discover movies with a Netflix-inspired interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen transition-colors duration-300`}>
        <Providers>
          <ThemeInitializer />
          <Header />
          <main className="pt-15">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}