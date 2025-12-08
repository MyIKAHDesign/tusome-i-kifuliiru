import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { getAllContentSlugs, getContentBySlug } from '../../lib/content-loader';
import { getContentData } from '../../lib/json-content-loader';
import { mdxComponents } from '../../mdx-components';
import ContentRenderer from '../../components/content/ContentRenderer';
import PageNavigation from '../../components/PageNavigation';

interface DocPageProps {
  mdxSource?: MDXRemoteSerializeResult;
  jsonContent?: any;
  slug: string;
  contentType: 'mdx' | 'json';
}

export default function DocPage({ mdxSource, jsonContent, contentType, slug }: DocPageProps) {
  // Check if this is a ukuharura page for wider display
  const isUkuharuraPage = slug.startsWith('ukuharura/') || slug === 'ukuharura';
  const maxWidthClass = isUkuharuraPage ? 'max-w-[1800px]' : 'max-w-4xl';
  
  // If JSON content, use the new component system
  if (contentType === 'json' && jsonContent) {
    return (
      <div className={maxWidthClass + ' mx-auto w-full'}>
        <ContentRenderer content={jsonContent} />
        <PageNavigation currentSlug={slug} />
      </div>
    );
  }

  // Otherwise, fall back to MDX
  if (mdxSource) {
    return (
      <article className={`mdx-content ${maxWidthClass} mx-auto w-full`}>
        <MDXRemote {...mdxSource} components={mdxComponents} />
        <PageNavigation currentSlug={slug} />
      </article>
    );
  }

  return (
    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
      <p>Content not found</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Get slugs from both MDX and JSON
  const mdxSlugs = getAllContentSlugs();
  const jsonSlugs = getAllContentSlugs(); // JSON files are in same directory, just different extension
  
  // Combine and deduplicate (JSON takes priority, so if both exist, JSON will be used)
  const allSlugs = [...new Set([...jsonSlugs, ...mdxSlugs])];
  
  return {
    paths: allSlugs.map((slug) => ({
      params: { slug: slug === '' ? [] : slug.split('/') },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugArray = params?.slug as string[] || [];
  const slug = slugArray.join('/') || 'index';
  
  // Try JSON first (new format - prioritized)
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
  
  // Fall back to MDX (legacy format - for files not yet migrated)
  const mdxContent = getContentBySlug(slug);
  
  if (!mdxContent) {
    return {
      notFound: true,
    };
  }

  // Serialize the MDX content
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
};
