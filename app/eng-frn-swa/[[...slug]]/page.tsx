import React from 'react';
import { getContentData } from '../../../lib/json-content-loader';
import { getContentBySlug, getAllContentSlugs } from '../../../lib/content-loader';
import { serialize } from 'next-mdx-remote/serialize';
import PageContent from '../../../components/PageContent';
import SEO from '../../../components/SEO';

interface PageProps {
  params: {
    slug?: string[];
  };
}

export async function generateStaticParams() {
  const allSlugs = getAllContentSlugs();
  const engFrnSwaSlugs = allSlugs.filter(slug => 
    slug.startsWith('eng-frn-swa/') || 
    slug === 'eng-frn-swa' ||
    slug === 'kiswahili' ||
    slug === 'english' ||
    slug === 'francais' ||
    slug === 'tukole'
  );
  
  return engFrnSwaSlugs.map((slug) => {
    if (slug === 'eng-frn-swa') {
      return { slug: [] };
    }
    if (slug.startsWith('eng-frn-swa/')) {
      return { slug: slug.replace('eng-frn-swa/', '').split('/') };
    }
    return { slug: [slug] };
  });
}

async function getPageData(slugArray: string[]) {
  let slug: string;
  
  if (slugArray.length === 0) {
    slug = 'eng-frn-swa';
  } else if (['kiswahili', 'english', 'francais', 'tukole'].includes(slugArray[0])) {
    slug = slugArray[0];
  } else {
    slug = `eng-frn-swa/${slugArray.join('/')}`;
  }
  
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
    notFound: true,
  };
}

export default async function EngFrnSwaPage({ params }: PageProps) {
  const slugArray = params.slug || [];
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
    return slugArray.length > 0 ? slugArray[slugArray.length - 1] : 'ENG/SWA/FRN';
  };
  
  const title = getTitle();

  return (
    <>
      <SEO
        title={`${title} - ENG/SWA/FRN`}
        description={`Learn ${title} in Kifuliiru`}
      />
      <PageContent
        jsonContent={'jsonContent' in pageData ? pageData.jsonContent : undefined}
        mdxSource={'mdxSource' in pageData ? pageData.mdxSource : undefined}
        contentType={pageData.contentType}
      />
    </>
  );
}

