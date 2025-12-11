import React from 'react';
import Script from 'next/script';
import { Metadata } from 'next';
import Layout from '../components/Layout';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Tusome i Kifuliiru',
  description: 'Kifuliiru. Kifuliiru language. Kifuliiru language online documentation. Kifuliiru Academy. Tusome indeto yitu Kifuliiru mu Kifuliiru.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tusome-i-kifuliiru.vercel.app',
    siteName: 'Tusome i Kifuliiru',
    images: [
      {
        url: 'https://tusome-i-kifuliiru.vercel.app/.github/DRCongo.png',
        width: 1200,
        height: 630,
        alt: 'Tusome i Kifuliiru',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const theme = savedTheme || systemTheme;
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

