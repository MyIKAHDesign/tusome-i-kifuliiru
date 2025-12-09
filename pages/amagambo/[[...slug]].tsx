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

interface AmagamboPageProps {
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

export default function AmagamboPage({ mdxSource, jsonContent, contentType, slug }: AmagamboPageProps) {
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
  // Filter for amagambo content
  const amagamboSlugs = allSlugs.filter(slug => 
    slug.startsWith('amagambo/') || 
    slug === 'amagambo' ||
    // Include amagambo-related pages
    slug === 'herufi' ||
    slug === 'ulufwabe' ||
    slug === 'menya-bino' ||
    slug === 'ndondeero-amagambo' ||
    slug === 'buniini-bwingi' ||
    slug === 'abaana'
  );
  
  return {
    paths: amagamboSlugs.map((slug) => {
      if (slug === 'amagambo') {
        return { params: { slug: [] } };
      }
      if (slug.startsWith('amagambo/')) {
        return { params: { slug: slug.replace('amagambo/', '').split('/') } };
      }
      // For standalone amagambo pages, use the slug directly
      return { params: { slug: [slug] } };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugArray = params?.slug as string[] || [];
  const nestedSlug = slugArray.length === 0 ? 'amagambo' : `amagambo/${slugArray.join('/')}`;
  const rootSlug = slugArray.length === 0 ? 'amagambo' : slugArray.join('/');
  
  // Try nested path first (e.g., amagambo/herufi)
  let jsonContent = getContentData(nestedSlug);
  let mdxContent = getContentBySlug(nestedSlug);
  
  // If not found, try root-level slug (e.g., herufi)
  if (!jsonContent && !mdxContent) {
    jsonContent = getContentData(rootSlug);
    mdxContent = getContentBySlug(rootSlug);
  }
  
  // Use the slug that worked (prefer nested for consistency)
  const finalSlug = jsonContent || mdxContent ? nestedSlug : rootSlug;
  
  // Try JSON first (new format - prioritized)
  if (jsonContent) {
    return {
      props: {
        jsonContent,
        slug: finalSlug,
        contentType: 'json' as const,
      },
    };
  }
  
  // Fall back to MDX (legacy format - for files not yet migrated)
  if (mdxContent) {
    // Serialize the MDX content
    const mdxSource = await serialize(mdxContent.content, {
      parseFrontmatter: true,
    });

    return {
      props: {
        mdxSource,
        slug: finalSlug,
        contentType: 'mdx' as const,
      },
    };
  }
  
  return {
    notFound: true,
  };
};

