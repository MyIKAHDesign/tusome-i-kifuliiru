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
import { ContentData, TextBlock, LessonContent } from '../../lib/content-schema';

interface AmagamboPageProps {
  mdxSource?: MDXRemoteSerializeResult;
  jsonContent?: ContentData;
  slug: string;
  contentType: 'mdx' | 'json';
}

export default function AmagamboPage({ mdxSource, jsonContent, contentType, slug }: AmagamboPageProps) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);

  useEffect(() => {
    if (contentType === 'mdx' && mdxSource) {
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
    } else if (contentType === 'json' && jsonContent && (jsonContent.type === 'lesson' || jsonContent.type === 'article')) {
      // Extract headings from JSON content
      const lessonContent = jsonContent as LessonContent;
      const extractedHeadings: Array<{ id: string; text: string; level: number }> = [];
      lessonContent.blocks?.forEach((block: TextBlock, index: number) => {
        if (block.type === 'heading' && block.level && block.level >= 2 && block.level <= 4) {
          const content = typeof block.content === 'string' ? block.content : '';
          const id = content.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim() || `heading-${index}`;
          extractedHeadings.push({
            id,
            text: content,
            level: block.level,
          });
        }
      });
      setHeadings(extractedHeadings);
    }
  }, [mdxSource, jsonContent, contentType]);

  // If JSON content, use the new component system
  if (contentType === 'json' && jsonContent) {
    return (
      <div className="w-full">
        {/* Page TOC - Inline at top */}
        {headings.length > 0 && (
          <div className="mb-8">
            <TableOfContents headings={headings} />
          </div>
        )}
        <ContentRenderer content={jsonContent} />
      </div>
    );
  }

  // Otherwise, fall back to MDX
  if (mdxSource) {
    return (
      <div className="w-full">
        {/* Page TOC - Inline at top */}
        {headings.length > 0 && (
          <div className="mb-8">
            <TableOfContents headings={headings} />
          </div>
        )}
        <article className="mdx-content">
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </article>
      </div>
    );
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

