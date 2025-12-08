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

interface BingiKuKifuliiruPageProps {
  jsonContent?: any;
  mdxSource?: any;
  slug: string;
  contentType: 'json' | 'mdx';
}

export default function BingiKuKifuliiruPage({ jsonContent, mdxSource, slug, contentType }: BingiKuKifuliiruPageProps) {
  const title = jsonContent?.title || mdxSource?.frontmatter?.title || slug.split('/').pop() || 'Bingi ku Kifuliiru';
  
  return (
    <>
      <SEO
        title={`${title} - Bingi ku Kifuliiru`}
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
  const bingiSlugs = allSlugs.filter(slug => slug.startsWith('bingi-ku-kifuliiru/') || slug === 'bingi-ku-kifuliiru');
  
  return {
    paths: bingiSlugs.map((slug) => ({
      params: { slug: slug === 'bingi-ku-kifuliiru' ? [] : slug.replace('bingi-ku-kifuliiru/', '').split('/') },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugArray = params?.slug as string[] || [];
  const slug = slugArray.length > 0 ? `bingi-ku-kifuliiru/${slugArray.join('/')}` : 'bingi-ku-kifuliiru';
  
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

