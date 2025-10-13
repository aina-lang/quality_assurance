import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Session } from 'next-auth';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import Providers from '@/components/providers';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: Session | null;
}>) {
  return (
    <html lang="fr">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        {/* <SessionProvider session={session}>; */}

        <ThemeProvider>

          <Providers> <SidebarProvider>{children}</SidebarProvider></Providers>
        </ThemeProvider>
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
