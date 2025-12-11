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
  const bingiSlugs = allSlugs.filter(slug => 
    slug.startsWith('bingi-ku-kifuliiru/') || 
    slug === 'bingi-ku-kifuliiru' ||
    slug === 'amagambo' ||
    slug === 'bitaabo-bya-bafuliiru' ||
    slug === 'imikolwa' ||
    slug === 'invumo' ||
    slug === 'ibinamishwa-mu-kifuliiru' ||
    slug === 'ibufuliiru.com' ||
    slug === 'tuganule_i_kifuliiru' ||
    slug === 'ibiyandike_mu_kifuliiru'
  );
  
  return bingiSlugs.map((slug) => {
    if (slug === 'bingi-ku-kifuliiru') {
      return { slug: [] };
    }
    if (slug.startsWith('bingi-ku-kifuliiru/')) {
      return { slug: slug.replace('bingi-ku-kifuliiru/', '').split('/') };
    }
    return { slug: [slug] };
  });
}

async function getPageData(slugArray: string[]) {
  const nestedSlug = slugArray.length > 0 ? `bingi-ku-kifuliiru/${slugArray.join('/')}` : 'bingi-ku-kifuliiru';
  const rootSlug = slugArray.length === 0 ? 'bingi-ku-kifuliiru' : slugArray.join('/');
  
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

export default async function BingiKuKifuliiruPage({ params }: PageProps) {
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
    return slugArray.length > 0 ? slugArray[slugArray.length - 1] : 'Bingi ku Kifuliiru';
  };
  
  const title = getTitle();

  return (
    <>
      <SEO
        title={`${title} - Bingi ku Kifuliiru`}
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

