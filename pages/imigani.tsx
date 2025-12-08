import React from 'react';
import { getContentData } from '../lib/json-content-loader';
import { getContentBySlug } from '../lib/content-loader';
import ContentRenderer from '../components/content/ContentRenderer';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { mdxComponents } from '../mdx-components';
import SEO from '../components/SEO';

interface ImiganiPageProps {
  jsonContent?: any;
  mdxSource?: any;
  contentType: 'json' | 'mdx';
}

export default function ImiganiPage({ jsonContent, mdxSource, contentType }: ImiganiPageProps) {
  return (
    <>
      <SEO
        title="Imigani - Tusome i Kifuliiru"
        description="Learn Kifuliiru proverbs and sayings"
      />
      <div className="max-w-3xl mx-auto w-full">
        {contentType === 'json' && jsonContent ? (
          <ContentRenderer content={jsonContent} />
        ) : mdxSource ? (
          <article className="mdx-content">
            <MDXRemote {...mdxSource} components={mdxComponents} />
          </article>
        ) : (
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Imigani</h1>
            <p className="text-gray-600 dark:text-gray-400">Content coming soon...</p>
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const jsonContent = getContentData('imigani');
  if (jsonContent) {
    return {
      props: {
        jsonContent,
        contentType: 'json' as const,
      },
    };
  }

  const mdxContent = getContentBySlug('imigani');
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

