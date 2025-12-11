import React from 'react';
import { getContentData } from '../../lib/json-content-loader';
import { getContentBySlug } from '../../lib/content-loader';
import { serialize } from 'next-mdx-remote/serialize';
import PageContent from '../../components/PageContent';
import SEO from '../../components/SEO';

async function getPageData() {
  const slug = 'harura';
  
  const jsonContent = getContentData(slug);
  if (jsonContent) {
    return {
      jsonContent,
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
      contentType: 'mdx' as const,
    };
  }

  return {
    notFound: true,
  };
}

export default async function HaruraPage() {
  const pageData = await getPageData();

  if ('notFound' in pageData) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>Content not found</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Kuharura - Tusome i Kifuliiru"
        description="Learn about counting in Kifuliiru"
      />
      <PageContent
        jsonContent={'jsonContent' in pageData ? pageData.jsonContent : undefined}
        mdxSource={'mdxSource' in pageData ? pageData.mdxSource : undefined}
        contentType={pageData.contentType}
      />
    </>
  );
}

