import React from 'react';
import { DefaultSeo } from 'next-seo';

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

  return (
    <DefaultSeo
      title={fullTitle}
      description={description || defaultDescription}
      openGraph={{
        type: 'website',
        url: `${siteUrl}${path || ''}`,
        title: fullTitle,
        description: description || defaultDescription,
        images: [
          {
            url: image || defaultImage,
            width: 1200,
            height: 630,
            alt: title || 'Tusome i Kifuliiru',
          },
        ],
        siteName: 'Tusome i Kifuliiru',
      }}
      twitter={{
        cardType: 'summary_large_image',
        site: '@tusome_kifuliiru',
      }}
      additionalMetaTags={[
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0',
        },
      ]}
    />
  );
}

