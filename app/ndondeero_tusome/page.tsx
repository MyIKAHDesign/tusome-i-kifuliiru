import React from 'react';
import { getContentData } from '../../lib/json-content-loader';
import { getContentBySlug } from '../../lib/content-loader';
import { serialize } from 'next-mdx-remote/serialize';
import PageContent from '../../components/PageContent';

async function getPageData() {
  const slug = 'ndondeero_tusome';
  
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
    contentType: 'json' as const,
  };
}

export default async function NdondeeroTusomePage() {
  const pageData = await getPageData();

  return (
    <PageContent
      jsonContent={'jsonContent' in pageData ? pageData.jsonContent : undefined}
      mdxSource={'mdxSource' in pageData ? pageData.mdxSource : undefined}
      contentType={pageData.contentType}
    />
  );
}

