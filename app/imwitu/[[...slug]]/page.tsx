import React from 'react';
import { Metadata } from 'next';
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
  const imwituRelatedSlugs = ['ibufuliiru', 'imigazi', 'inyiji', 'utwaya'];
  const imwituSlugs = allSlugs.filter(slug => 
    slug.startsWith('imwitu/') || 
    slug === 'imwitu' ||
    imwituRelatedSlugs.includes(slug)
  );
  
  return imwituSlugs.map((slug) => {
    if (slug === 'imwitu') {
      return { slug: [] };
    }
    if (slug.startsWith('imwitu/')) {
      return { slug: slug.replace('imwitu/', '').split('/') };
    }
    return { slug: [slug] };
  });
}

async function getPageData(slugArray: string[]) {
  const nestedSlug = slugArray.length > 0 ? `imwitu/${slugArray.join('/')}` : 'imwitu';
  const rootSlug = slugArray.length > 0 ? slugArray.join('/') : 'imwitu';
  
  // Try nested path first (imwitu/imigazi)
  let jsonContent = getContentData(nestedSlug);
  let mdxContent = getContentBySlug(nestedSlug);
  
  // If not found, try root-level slug (imigazi)
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
    slug: finalSlug,
    contentType: 'json' as const,
  };
}

export default async function ImwituPage({ params }: PageProps) {
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
    return slugArray.length > 0 ? slugArray[slugArray.length - 1] : 'Imwitu';
  };
  
  const title = getTitle();

  return (
    <>
      <SEO
        title={`${title} - Imwitu`}
        description={`Learn about ${title} in Kifuliiru`}
      />
      <PageContent
        jsonContent={'jsonContent' in pageData ? pageData.jsonContent : undefined}
        mdxSource={'mdxSource' in pageData ? pageData.mdxSource : undefined}
        contentType={pageData.contentType}
      />
    </>
  );
}

