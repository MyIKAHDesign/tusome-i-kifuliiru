import React from 'react';
import { getContentData } from '../../lib/json-content-loader';
import { getContentBySlug } from '../../lib/content-loader';
import { serialize } from 'next-mdx-remote/serialize';
import PageContent from '../../components/PageContent';
import SEO from '../../components/SEO';

async function getPageData() {
  const jsonContent = getContentData('kifuliiru');
  if (jsonContent) {
    return {
      jsonContent,
      contentType: 'json' as const,
    };
  }

  const mdxContent = getContentBySlug('kifuliiru');
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
    contentType: 'json' as const,
  };
}

export default async function KifuliiruPage() {
  const pageData = await getPageData();

  return (
    <>
      <SEO
        title="Kifuliiru - Tusome i Kifuliiru"
        description="Learn about the Kifuliiru language"
      />
      <PageContent
        jsonContent={'jsonContent' in pageData ? pageData.jsonContent : undefined}
        mdxSource={'mdxSource' in pageData ? pageData.mdxSource : undefined}
        contentType={pageData.contentType}
      />
    </>
  );
}

