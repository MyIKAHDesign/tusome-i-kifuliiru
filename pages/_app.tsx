import React from 'react';
import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import Layout from '../components/Layout';
import '../styles/globals.css';
import '../styles/design-tokens.css';

const defaultSEO = {
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
    cardType: 'summary_large_image',
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...defaultSEO} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

