import React from 'react';
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

export default function SEO({ title, description, image, path }: SEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tusome-i-kifuliiru.vercel.app';
  const fullTitle = title ? `${title} – Tusome i Kifuliiru` : 'Tusome i Kifuliiru';
  const defaultDescription = 'Kifuliiru. Kifuliiru language. Kifuliiru language online documentation. Kifuliiru Academy. Tusome indeto yitu Kifuliiru mu Kifuliiru.';
  const defaultImage = `${siteUrl}/.github/DRCongo.png`;
  const url = `${siteUrl}${path || ''}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Tusome i Kifuliiru" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tusome_kifuliiru" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Head>
  );
}

