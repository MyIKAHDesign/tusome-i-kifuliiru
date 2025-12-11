import React from 'react';
import { getContentData } from '../../../lib/json-content-loader';
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
  const allSlugs = getAllContentSlugs();
  const tweheSlugs = allSlugs.filter(slug => slug.startsWith('twehe/') || slug === 'twehe');
  
  return tweheSlugs.map((slug) => ({
    slug: slug === 'twehe' ? [] : slug.replace('twehe/', '').split('/'),
  }));
}

async function getPageData(slugArray: string[]) {
  const slug = slugArray.length > 0 ? `twehe/${slugArray.join('/')}` : 'twehe';
  
  const jsonContent = getContentData(slug);
  if (jsonContent) {
    return {
      jsonContent,
      slug,
      contentType: 'json' as const,
    };
  }

  const mdxContent = getContentBySlug(slug);
  if (mdxContent) {
    const mdxSource = await serialize(mdxContent.content, {
      parseFrontmatter: true,
    });
    return {
      mdxSource,
      slug,
      contentType: 'mdx' as const,
    };
  }

  return {
    slug,
    contentType: 'json' as const,
  };
}

export default async function TwehePage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug || [];
  const pageData = await getPageData(slugArray);
  
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

