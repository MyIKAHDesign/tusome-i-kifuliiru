import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { getAllContentSlugs, getContentBySlug } from '../../lib/content-loader';
import { getContentData } from '../../lib/json-content-loader';
import { mdxComponents } from '../../mdx-components';
import ContentRenderer from '../../components/content/ContentRenderer';
import PageNavigation from '../../components/PageNavigation';
import { ContentData } from '../../lib/content-schema';

interface UkuharuraPageProps {
  mdxSource?: MDXRemoteSerializeResult;
  jsonContent?: ContentData;
  slug: string;
  contentType: 'mdx' | 'json';
}

// Component for MDX pages
function MDXPage({ mdxSource, slug }: { mdxSource: MDXRemoteSerializeResult; slug: string }) {
  return (
    <div className="w-full">
      <article className="mdx-content">
        <MDXRemote {...mdxSource} components={mdxComponents} />
      </article>
      <div className="mt-12">
        <PageNavigation currentSlug={slug} />
      </div>
    </div>
  );
}

export default function UkuharuraPage({ mdxSource, jsonContent, contentType, slug }: UkuharuraPageProps) {
  // If JSON content, use the new component system
  if (contentType === 'json' && jsonContent) {
    return (
      <div className="w-full">
        <ContentRenderer content={jsonContent} />
        <div className="mt-12">
          <PageNavigation currentSlug={slug} />
        </div>
      </div>
    );
  }

  // Otherwise, fall back to MDX
  if (mdxSource) {
    return <MDXPage mdxSource={mdxSource} slug={slug} />;
  }

  return (
    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
      <p>Content not found</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allSlugs = getAllContentSlugs();
  // Filter for ukuharura content
  const ukuharuraSlugs = allSlugs.filter(slug => 
    slug.startsWith('ukuharura/') || 
    slug === 'ukuharura' ||
    // Also include standalone pages that are part of ukuharura
    slug === 'harura' ||
    slug === 'ndondeero' ||
    slug === 'zero-ku-ikumi' ||
    slug === 'ikumi-ku-igana' ||
    slug === 'igana-ku-kihumbi' ||
    slug === 'igana' ||
    slug.startsWith('magana-') ||
    slug.startsWith('kihumbi') ||
    slug.startsWith('bihumbi-') ||
    slug === 'umulyoni' ||
    slug === 'umulyari' ||
    slug.startsWith('umulyari-')
  );
  
  return {
    paths: ukuharuraSlugs.map((slug) => {
      if (slug === 'ukuharura') {
        return { params: { slug: [] } };
      }
      if (slug.startsWith('ukuharura/')) {
        return { params: { slug: slug.replace('ukuharura/', '').split('/') } };
      }
      // For standalone ukuharura pages, use the slug directly
      return { params: { slug: [slug] } };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugArray = params?.slug as string[] || [];
  const slug = slugArray.length === 0 ? 'ukuharura' : `ukuharura/${slugArray.join('/')}`;
  
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

