import React from 'react';
import { GetStaticProps } from 'next';
import { getContentData } from '../lib/json-content-loader';
import { getContentBySlug } from '../lib/content-loader';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { mdxComponents } from '../mdx-components';
import ContentRenderer from '../components/content/ContentRenderer';
import PageNavigation from '../components/PageNavigation';
import { ContentData } from '../lib/content-schema';

interface NdondeeroTusomePageProps {
  jsonContent?: ContentData;
  mdxSource?: MDXRemoteSerializeResult;
  contentType: 'json' | 'mdx';
}

export default function NdondeeroTusomePage({ jsonContent, mdxSource, contentType }: NdondeeroTusomePageProps) {
  return (
    <div className="w-full">
      {contentType === 'json' && jsonContent ? (
        <ContentRenderer content={jsonContent} />
      ) : mdxSource ? (
        <article className="mdx-content">
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </article>
      ) : (
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Menya Bino</h1>
          <p className="text-gray-600 dark:text-gray-400">Content coming soon...</p>
        </div>
      )}
      <div className="mt-12">
        <PageNavigation currentSlug="ndondeero_tusome" />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const slug = 'ndondeero_tusome';
  
  // Try JSON first (new format - prioritized)
  const jsonContent = getContentData(slug);
  if (jsonContent) {
    return {
      props: {
        jsonContent,
        contentType: 'json' as const,
      },
    };
  }

  // Fall back to MDX (legacy format)
  const mdxContent = getContentBySlug(slug);
  if (mdxContent) {
    const mdxSource = await serialize(mdxContent.content, {
      parseFrontmatter: true,
    });
    return {
      props: {
        mdxSource,
        contentType: 'mdx' as const,
      },
    };
  }

  return {
    props: {
      contentType: 'json' as const,
    },
  };
}

