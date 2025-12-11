'use client';

import React, { useEffect, useState } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import ContentRenderer from './content/ContentRenderer';
import TableOfContents from './TableOfContents';
import CategoryNavigation from './CategoryNavigation';
import { ContentData, TextBlock, LessonContent } from '../lib/content-schema';
import { mdxComponents } from '../mdx-components';

interface PageContentProps {
  jsonContent?: ContentData;
  mdxSource?: MDXRemoteSerializeResult;
  contentType: 'json' | 'mdx';
}

export default function PageContent({ jsonContent, mdxSource, contentType }: PageContentProps) {
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
    <div className="w-full flex flex-col xl:flex-row gap-12">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Mobile TOC - At top on small screens */}
        {headings.length > 0 && (
          <div className="xl:hidden mb-8">
            <TableOfContents headings={headings} />
          </div>
        )}
        
        {contentType === 'json' && jsonContent ? (
          <ContentRenderer content={jsonContent} />
        ) : mdxSource ? (
          <article className="mdx-content">
            <MDXRemote {...mdxSource} components={mdxComponents} />
          </article>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Content not found</p>
          </div>
        )}
        
        {/* Category Navigation - Next/Previous buttons */}
        <CategoryNavigation />
      </div>
      
      {/* Page TOC - Sticky on the right for desktop */}
      {headings.length > 0 && (
        <aside className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      )}
    </div>
  );
}

