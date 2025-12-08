import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getContentData } from '../../lib/json-content-loader';
import { getContentBySlug } from '../../lib/content-loader';
import ContentRenderer from '../../components/content/ContentRenderer';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { mdxComponents } from '../../mdx-components';
import SEO from '../../components/SEO';
import { getAllContentSlugs } from '../../lib/content-loader';

interface TwehePageProps {
  jsonContent?: any;
  mdxSource?: any;
  slug: string;
  contentType: 'json' | 'mdx';
}

export default function TwehePage({ jsonContent, mdxSource, slug, contentType }: TwehePageProps) {
  const title = jsonContent?.title || mdxSource?.frontmatter?.title || slug.split('/').pop() || 'Twehe';
  
  return (
    <>
      <SEO
        title={`${title} - Twehe`}
        description={`Learn about ${title}`}
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
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400">Content coming soon...</p>
          </div>
        )}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allSlugs = getAllContentSlugs();
  const tweheSlugs = allSlugs.filter(slug => slug.startsWith('twehe/') || slug === 'twehe');
  
  return {
    paths: tweheSlugs.map((slug) => ({
      params: { slug: slug === 'twehe' ? [] : slug.replace('twehe/', '').split('/') },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugArray = params?.slug as string[] || [];
  const slug = slugArray.length > 0 ? `twehe/${slugArray.join('/')}` : 'twehe';
  
  const jsonContent = getContentData(slug);
  if (jsonContent) {
    return {
      props: {
        jsonContent,
        slug,
        contentType: 'json' as const,
      },
    };
  }

  const mdxContent = getContentBySlug(slug);
  if (mdxContent) {
    const mdxSource = await serialize(mdxContent.content, {
      parseFrontmatter: true,
    });
    return {
      props: {
        mdxSource,
        slug,
        contentType: 'mdx' as const,
      },
    };
  }

  return {
    props: {
      slug,
      contentType: 'json' as const,
    },
  };
};

