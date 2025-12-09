import React, { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import { getContentData } from '../lib/json-content-loader';
import { getContentBySlug } from '../lib/content-loader';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { mdxComponents } from '../mdx-components';
import ContentRenderer from '../components/content/ContentRenderer';
import PageNavigation from '../components/PageNavigation';
import TableOfContents from '../components/TableOfContents';
import { ContentData, TextBlock, LessonContent } from '../lib/content-schema';

interface NdondeeroTusomePageProps {
  jsonContent?: ContentData;
  mdxSource?: MDXRemoteSerializeResult;
  contentType: 'json' | 'mdx';
}

export default function NdondeeroTusomePage({ jsonContent, mdxSource, contentType }: NdondeeroTusomePageProps) {
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

  return (
    <div className="w-full">
      {/* Page TOC - Inline at top */}
      {headings.length > 0 && (
        <div className="mb-8">
          <TableOfContents headings={headings} />
        </div>
      )}
      
      {/* Content */}
      {contentType === 'json' && jsonContent ? (
        <ContentRenderer content={jsonContent} />
      ) : mdxSource ? (
        <article className="mdx-content">
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </article>
      ) : (
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Menya Bino</h1>
          <p className="text-gray-600 dark:text-gray-400">Content coming soon...</p>
        </div>
      )}
      
      <div className="mt-12">
        <PageNavigation currentSlug="ndondeero_tusome" />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const slug = 'ndondeero_tusome';
  
  // Try JSON first (new format - prioritized)
  const jsonContent = getContentData(slug);
  if (jsonContent) {
    return {
      props: {
        jsonContent,
        contentType: 'json' as const,
      },
    };
  }

  // Fall back to MDX (legacy format)
  const mdxContent = getContentBySlug(slug);
  if (mdxContent) {
    const mdxSource = await serialize(mdxContent.content, {
      parseFrontmatter: true,
    });
    return {
      props: {
        mdxSource,
        contentType: 'mdx' as const,
      },
    };
  }

  return {
    props: {
      contentType: 'json' as const,
    },
  };
}

