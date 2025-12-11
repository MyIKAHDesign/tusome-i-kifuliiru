import React from 'react';
import { getContentData, getAllContentSlugs as getAllJsonContentSlugs } from '../../../lib/json-content-loader';
import { getContentBySlug, getAllContentSlugs } from '../../../lib/content-loader';
import { serialize } from 'next-mdx-remote/serialize';
import PageContent from '../../../components/PageContent';
import SEO from '../../../components/SEO';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  // Get slugs from both JSON and MDX content loaders
  const jsonSlugs = getAllJsonContentSlugs();
  const mdxSlugs = getAllContentSlugs();
  const allSlugs = [...new Set([...jsonSlugs, ...mdxSlugs])];
  
  const tweheSlugs = allSlugs.filter(slug => 
    slug.startsWith('twehe/') || 
    slug === 'twehe' ||
    slug === 'umwandisi'
  );
  
  return tweheSlugs.map((slug) => {
    if (slug === 'twehe') {
      return { slug: [] };
    }
    if (slug === 'umwandisi') {
      return { slug: ['umwandisi'] };
    }
    if (slug.startsWith('twehe/')) {
      return { slug: slug.replace('twehe/', '').split('/') };
    }
    return { slug: [slug] };
  });
}

async function getPageData(slugArray: string[]) {
  const nestedSlug = slugArray.length > 0 ? `twehe/${slugArray.join('/')}` : 'twehe';
  const rootSlug = slugArray.length === 0 ? 'twehe' : slugArray.join('/');
  
  // Try nested path first (e.g., twehe/umwandisi)
  let jsonContent = getContentData(nestedSlug);
  let mdxContent = getContentBySlug(nestedSlug);
  
  // If not found, try root-level slug (e.g., umwandisi, twehe)
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

export default async function TwehePage({ params }: PageProps) {
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
  
  const getTitle = (): string => {
    if ('jsonContent' in pageData && pageData.jsonContent && 'title' in pageData.jsonContent && typeof pageData.jsonContent.title === 'string') {
      return pageData.jsonContent.title;
    }
    if ('mdxSource' in pageData && pageData.mdxSource?.frontmatter && typeof pageData.mdxSource.frontmatter === 'object' && 'title' in pageData.mdxSource.frontmatter) {
      const frontmatterTitle = pageData.mdxSource.frontmatter.title;
      if (typeof frontmatterTitle === 'string') return frontmatterTitle;
    }
    return slugArray.length > 0 ? slugArray[slugArray.length - 1] : 'Twehe';
  };
  
  const title = getTitle();

  return (
    <>
      <SEO
        title={`${title} - Twehe`}
        description={`Learn about ${title}`}
      />
      <PageContent
        jsonContent={'jsonContent' in pageData ? pageData.jsonContent : undefined}
        mdxSource={'mdxSource' in pageData ? pageData.mdxSource : undefined}
        contentType={pageData.contentType}
      />
    </>
  );
}

