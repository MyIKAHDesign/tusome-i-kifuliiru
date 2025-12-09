import React, { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { getAllContentSlugs, getContentBySlug } from '../../lib/content-loader';
import { getContentData } from '../../lib/json-content-loader';
import { mdxComponents } from '../../mdx-components';
import ContentRenderer from '../../components/content/ContentRenderer';
import PageNavigation from '../../components/PageNavigation';
import TableOfContents from '../../components/TableOfContents';

interface UkuharuraPageProps {
  mdxSource?: MDXRemoteSerializeResult;
  jsonContent?: any;
  slug: string;
  contentType: 'mdx' | 'json';
}

// Component for MDX pages with TOC
function MDXPage({ mdxSource, slug, maxWidthClass }: { mdxSource: MDXRemoteSerializeResult; slug: string; maxWidthClass: string }) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);

  useEffect(() => {
    // Extract headings from MDX content after render
    const headingElements = document.querySelectorAll('.mdx-content h2, .mdx-content h3, .mdx-content h4');
    const extractedHeadings = Array.from(headingElements).map((el) => {
      const id = el.id || el.textContent?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim() || '';
      if (!el.id && id) {
        el.id = id;
      }
      return {
        id: el.id,
        text: el.textContent || '',
        level: parseInt(el.tagName.charAt(1)) || 2,
      };
    });
    setHeadings(extractedHeadings);
  }, [mdxSource]);

  return (
    <div className={`${maxWidthClass} mx-auto w-full`}>
      <div className="flex gap-8">
        <article className={`mdx-content flex-1 min-w-0`}>
          <MDXRemote {...mdxSource} components={mdxComponents} />
          <PageNavigation currentSlug={slug} />
        </article>
        <TableOfContents headings={headings} />
      </div>
    </div>
  );
}

export default function UkuharuraPage({ mdxSource, jsonContent, contentType, slug }: UkuharuraPageProps) {
  // Use wider display for all pages (same as ukuharura pages)
  const maxWidthClass = 'max-w-[1400px]';
  
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
    return <MDXPage mdxSource={mdxSource} slug={slug} maxWidthClass={maxWidthClass} />;
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

