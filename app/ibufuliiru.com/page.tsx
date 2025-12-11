import React from 'react';
import { getContentData } from '../../lib/json-content-loader';
import { getContentBySlug } from '../../lib/content-loader';
import { serialize } from 'next-mdx-remote/serialize';
import PageContent from '../../components/PageContent';
import SEO from '../../components/SEO';

async function getPageData() {
  const slug = 'ibufuliiru.com';
  
  let jsonContent = getContentData(slug);
  let mdxContent = getContentBySlug(slug);
  
  if (jsonContent) {
    return {
      jsonContent,
      slug,
      contentType: 'json' as const,
    };
  }

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

export default async function IbufuliiruComPage() {
  const pageData = await getPageData();
  
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
    return 'Ibufuliiru.com';
  };
  
  const title = getTitle();

  return (
    <>
      <SEO
        title={`${title} - Website`}
        description={`Learn about the Ibufuliiru.com website - A platform dedicated to preserving and sharing the Kifuliiru language and culture`}
      />
      <PageContent
        jsonContent={'jsonContent' in pageData ? pageData.jsonContent : undefined}
        mdxSource={'mdxSource' in pageData ? pageData.mdxSource : undefined}
        contentType={pageData.contentType}
      />
    </>
  );
}

