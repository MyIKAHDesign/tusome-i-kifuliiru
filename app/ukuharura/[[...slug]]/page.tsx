import React from 'react';
import { getContentData } from '../../../lib/json-content-loader';
import { getContentBySlug, getAllContentSlugs } from '../../../lib/content-loader';
import { serialize } from 'next-mdx-remote/serialize';
import PageContent from '../../../components/PageContent';

interface PageProps {
  params: {
    slug?: string[];
  };
}

export async function generateStaticParams() {
  const allSlugs = getAllContentSlugs();
  const ukuharuraSlugs = allSlugs.filter(slug => 
    slug.startsWith('ukuharura/') || 
    slug === 'ukuharura' ||
    slug === 'harura' ||
    slug === 'ndondeero' ||
    slug === 'zero-ku-ikumi' ||
    slug === 'ikumi-ku-igana' ||
    slug === 'igana-ku-kihumbi' ||
    slug === 'igana' ||
    slug.startsWith('magana-') ||
    slug.startsWith('kihumbi') ||
    slug.startsWith('bihumbi-') ||
    slug === 'umulyoni' ||
    slug === 'umulyari' ||
    slug.startsWith('umulyari-')
  );
  
  return ukuharuraSlugs.map((slug) => {
    if (slug === 'ukuharura') {
      return { slug: [] };
    }
    if (slug.startsWith('ukuharura/')) {
      return { slug: slug.replace('ukuharura/', '').split('/') };
    }
    return { slug: [slug] };
  });
}

async function getPageData(slugArray: string[]) {
  const slug = slugArray.length === 0 ? 'ukuharura' : `ukuharura/${slugArray.join('/')}`;
  
  const jsonContent = getContentData(slug);
  if (jsonContent) {
    return {
      jsonContent,
      slug,
      contentType: 'json' as const,
    };
  }
  
  const mdxContent = getContentBySlug(slug);
  if (!mdxContent) {
    return {
      notFound: true,
    };
  }

  const mdxSource = await serialize(mdxContent.content, {
    parseFrontmatter: true,
  });

  return {
    mdxSource,
    slug,
    contentType: 'mdx' as const,
  };
}

export default async function UkuharuraPage({ params }: PageProps) {
  const slugArray = params.slug || [];
  const pageData = await getPageData(slugArray);
  
  if ('notFound' in pageData) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>Content not found</p>
      </div>
    );
  }

  return (
    <PageContent
      jsonContent={'jsonContent' in pageData ? pageData.jsonContent : undefined}
      mdxSource={'mdxSource' in pageData ? pageData.mdxSource : undefined}
      contentType={pageData.contentType}
    />
  );
}

