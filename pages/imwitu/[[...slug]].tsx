import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getContentData } from '../../lib/json-content-loader';
import { getContentBySlug } from '../../lib/content-loader';
import ContentRenderer from '../../components/content/ContentRenderer';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { mdxComponents } from '../../mdx-components';
import SEO from '../../components/SEO';
import { getAllContentSlugs } from '../../lib/content-loader';
import { ContentData } from '../../lib/content-schema';

interface ImwituPageProps {
  jsonContent?: ContentData;
  mdxSource?: MDXRemoteSerializeResult;
  slug: string;
  contentType: 'json' | 'mdx';
}

export default function ImwituPage({ jsonContent, mdxSource, slug, contentType }: ImwituPageProps) {
  const getTitle = (): string => {
    if (jsonContent && 'title' in jsonContent && typeof jsonContent.title === 'string') {
      return jsonContent.title;
    }
    if (mdxSource?.frontmatter && typeof mdxSource.frontmatter === 'object' && 'title' in mdxSource.frontmatter) {
      const frontmatterTitle = mdxSource.frontmatter.title;
      if (typeof frontmatterTitle === 'string') return frontmatterTitle;
    }
    return slug.split('/').pop() || 'Imwitu';
  };
  const title = getTitle();
  
  return (
    <>
      <SEO
        title={`${title} - Imwitu`}
        description={`Learn about ${title} in Kifuliiru`}
      />
      <div className="max-w-[1400px] mx-auto w-full">
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
  const imwituSlugs = allSlugs.filter(slug => slug.startsWith('imwitu/') || slug === 'imwitu');
  
  return {
    paths: imwituSlugs.map((slug) => ({
      params: { slug: slug === 'imwitu' ? [] : slug.replace('imwitu/', '').split('/') },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugArray = params?.slug as string[] || [];
  const slug = slugArray.length > 0 ? `imwitu/${slugArray.join('/')}` : 'imwitu';
  
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

