import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllContentSlugs, getContentBySlug } from '../../lib/content-loader';
import Layout from '../../components/Layout';
import { mdxComponents } from '../../mdx-components';

interface DocPageProps {
  content: string;
  slug: string;
}

export default function DocPage({ content, slug }: DocPageProps) {
  return (
    <Layout>
      <article className="mdx-content max-w-4xl mx-auto">
        <MDXRemote source={content} components={mdxComponents} />
      </article>
    </Layout>
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

  return {
    props: {
      content: content.content,
      slug,
    },
  };
};

