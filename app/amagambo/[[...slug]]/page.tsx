import React from 'react';
import { getContentData } from '../../../lib/json-content-loader';
import { getContentBySlug, getAllContentSlugs } from '../../../lib/content-loader';
import { serialize } from 'next-mdx-remote/serialize';
import PageContent from '../../../components/PageContent';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const allSlugs = getAllContentSlugs();
  const amagamboSlugs = allSlugs.filter(slug => 
    slug.startsWith('amagambo/') || 
    slug === 'amagambo' ||
    slug === 'herufi' ||
    slug === 'ulufwabe' ||
    slug === 'menya-bino' ||
    slug === 'ndondeero-amagambo' ||
    slug === 'buniini-bwingi' ||
    slug === 'abaana'
  );
  
  return amagamboSlugs.map((slug) => {
    if (slug === 'amagambo') {
      return { slug: [] };
    }
    if (slug.startsWith('amagambo/')) {
      return { slug: slug.replace('amagambo/', '').split('/') };
    }
    return { slug: [slug] };
  });
}

async function getPageData(slugArray: string[]) {
  const nestedSlug = slugArray.length === 0 ? 'amagambo' : `amagambo/${slugArray.join('/')}`;
  const rootSlug = slugArray.length === 0 ? 'amagambo' : slugArray.join('/');
  
  let jsonContent = getContentData(nestedSlug);
  let mdxContent = getContentBySlug(nestedSlug);
  
  if (!jsonContent && !mdxContent) {
    jsonContent = getContentData(rootSlug);
    mdxContent = getContentBySlug(rootSlug);
  }
  
  const finalSlug = jsonContent || mdxContent ? nestedSlug : rootSlug;
  
  if (jsonContent) {
    return {
      jsonContent,
      slug: finalSlug,
      contentType: 'json' as const,
    };
  }
  
  if (mdxContent) {
    const mdxSource = await serialize(mdxContent.content, {
      parseFrontmatter: true,
    });
    return {
      mdxSource,
      slug: finalSlug,
      contentType: 'mdx' as const,
    };
  }
  
  return {
    notFound: true,
  };
}

export default async function AmagamboPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug || [];
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

