import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { getAllContentSlugs, getContentBySlug } from '../../lib/content-loader';
import { mdxComponents } from '../../mdx-components';

interface DocPageProps {
  mdxSource: MDXRemoteSerializeResult;
  slug: string;
}

export default function DocPage({ mdxSource }: DocPageProps) {
  return (
    <article className="mdx-content max-w-4xl mx-auto">
      <MDXRemote {...mdxSource} components={mdxComponents} />
    </article>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllContentSlugs();
  
  return {
    paths: slugs.map((slug) => ({
      params: { slug: slug === '' ? [] : slug.split('/') },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugArray = params?.slug as string[] || [];
  const slug = slugArray.join('/') || 'index';
  
  const content = getContentBySlug(slug);
  
  if (!content) {
    return {
      notFound: true,
    };
  }

  // Serialize the MDX content
  const mdxSource = await serialize(content.content, {
    parseFrontmatter: true,
  });

  return {
    props: {
      mdxSource,
      slug,
    },
  };
};

