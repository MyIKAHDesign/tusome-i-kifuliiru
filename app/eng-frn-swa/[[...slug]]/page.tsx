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
  
  // Always include language pages explicitly
  const languagePages = [
    { slug: [] }, // eng-frn-swa root
    { slug: ['kiswahili'] },
    { slug: ['english'] },
    { slug: ['francais'] },
    { slug: ['tukole'] },
  ];
  
  const engFrnSwaSlugs = allSlugs.filter(slug => 
    slug.startsWith('eng-frn-swa/') || 
    slug === 'eng-frn-swa'
  );
  
  const otherPages = engFrnSwaSlugs.map((slug) => {
    if (slug === 'eng-frn-swa') {
      return { slug: [] };
    }
    if (slug.startsWith('eng-frn-swa/')) {
      return { slug: slug.replace('eng-frn-swa/', '').split('/') };
    }
    return { slug: [slug] };
  });
  
  // Combine language pages with other pages, avoiding duplicates
  const allPages = [...languagePages];
  otherPages.forEach(page => {
    if (!allPages.some(p => JSON.stringify(p.slug) === JSON.stringify(page.slug))) {
      allPages.push(page);
    }
  });
  
  return allPages;
}

async function getPageData(slugArray: string[]) {
  let slug: string;
  
  if (slugArray.length === 0) {
    slug = 'eng-frn-swa';
  } else if (['kiswahili', 'english', 'francais', 'tukole'].includes(slugArray[0])) {
    // For language pages, use the language name directly as slug
    slug = slugArray[0];
  } else {
    slug = `eng-frn-swa/${slugArray.join('/')}`;
  }
  
  // Try JSON content first
  const jsonContent = getContentData(slug);
  if (jsonContent) {
    return {
      jsonContent,
      slug,
      contentType: 'json' as const,
    };
  }

  // Try MDX content
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

  // If neither found, return not found
  return {
    notFound: true,
  };
}

export default async function EngFrnSwaPage({ params }: PageProps) {
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

