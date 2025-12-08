import React from 'react';
import { getContentData } from '../lib/json-content-loader';
import { getContentBySlug } from '../lib/content-loader';
import ContentRenderer from '../components/content/ContentRenderer';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { mdxComponents } from '../mdx-components';
import SEO from '../components/SEO';
import PageNavigation from '../components/PageNavigation';

interface GwajiikaPageProps {
  jsonContent?: any;
  mdxSource?: any;
  contentType: 'json' | 'mdx';
}

export default function GwajiikaPage({ jsonContent, mdxSource, contentType }: GwajiikaPageProps) {
  return (
    <>
      <SEO
        title="Gwajiika - Tusome i Kifuliiru"
        description="Start learning Kifuliiru language"
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {contentType === 'json' && jsonContent ? (
          <>
            <ContentRenderer content={jsonContent} />
            <PageNavigation currentSlug="gwajiika" />
          </>
        ) : mdxSource ? (
          <>
            <article className="mdx-content">
              <MDXRemote {...mdxSource} components={mdxComponents} />
            </article>
            <PageNavigation currentSlug="gwajiika" />
          </>
        ) : (
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Gwajiika</h1>
            <p className="text-gray-600 dark:text-gray-400">Content coming soon...</p>
            <PageNavigation currentSlug="gwajiika" />
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  // Try JSON first
  const jsonContent = getContentData('gwajiika');
  if (jsonContent) {
    return {
      props: {
        jsonContent,
        contentType: 'json' as const,
      },
    };
  }

  // Fall back to MDX
  const mdxContent = getContentBySlug('gwajiika');
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

