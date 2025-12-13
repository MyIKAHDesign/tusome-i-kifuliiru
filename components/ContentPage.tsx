'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ContentRenderer from './content/ContentRenderer';
import TableOfContents from './TableOfContents';
import CategoryNavigation from './CategoryNavigation';
import SEO from './SEO';
import { ContentData, LessonContent, TextBlock } from '../lib/content-schema';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { mdxComponents } from '../mdx-components';

// Dynamically import MDXRemote to avoid SSR issues
const MDXRemote = dynamic(() => import('next-mdx-remote').then(mod => mod.MDXRemote), {
  ssr: false,
});

interface ContentPageProps {
  slug?: string;
  title?: string;
  description?: string;
}

export default function ContentPage({ slug, title, description }: ContentPageProps) {
  const pathname = usePathname();
  const [content, setContent] = useState<ContentData | null>(null);
  const [mdxData, setMdxData] = useState<{ rawContent: string; frontmatter: any } | null>(null);
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [contentType, setContentType] = useState<'json' | 'mdx' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);

  // Determine slug from pathname if not provided
  const pageSlug = slug || pathname?.replace(/^\//, '').replace(/\/$/, '') || '';

  useEffect(() => {
    const loadContent = async () => {
      if (!pageSlug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/content?slug=${encodeURIComponent(pageSlug)}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Content not found');
          } else {
            setError('Failed to load content');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        
        if (data.contentType === 'json') {
          setContent(data.content);
          setContentType('json');
        } else if (data.contentType === 'mdx') {
          // Store MDX data - we'll serialize it client-side
          setMdxData(data.content);
          setContentType('mdx');
          
          // Dynamically import and serialize MDX
          import('next-mdx-remote/serialize').then(({ serialize }) => {
            serialize(data.content.rawContent, {
              parseFrontmatter: true,
            }).then((serialized) => {
              setMdxSource(serialized);
            });
          });
        }
      } catch (err) {
        console.error('Error loading content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [pageSlug]);

  // Extract headings for TOC
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
    } else if (contentType === 'json' && content && (content.type === 'lesson' || content.type === 'article')) {
      // Extract headings from JSON content
      const lessonContent = content as LessonContent;
      const extractedHeadings: Array<{ id: string; text: string; level: number }> = [];
      lessonContent.blocks?.forEach((block: TextBlock, index: number) => {
        if (block.type === 'heading' && block.level && block.level >= 2 && block.level <= 4) {
          const contentText = typeof block.content === 'string' ? block.content : '';
          const id = contentText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim() || `heading-${index}`;
          extractedHeadings.push({
            id,
            text: contentText,
            level: block.level,
          });
        }
      });
      setHeadings(extractedHeadings);
    }
  }, [mdxSource, content, contentType]);

  // Get page title and description from content
  const pageTitle = title || 
    (content?.type === 'lesson' || content?.type === 'article' ? content.title : '') || 
    (mdxData?.frontmatter?.title as string) || 
    (mdxSource?.frontmatter?.title as string) || '';
  const pageDescription = description || 
    content?.description || 
    (mdxData?.frontmatter?.description as string) || 
    (mdxSource?.frontmatter?.description as string) || '';

  if (loading) {
    return (
      <>
        <SEO title={pageTitle || 'Loading...'} description={pageDescription} />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary-600 dark:text-primary-400" />
            <p className="text-gray-600 dark:text-gray-400">Loading content...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || (!content && !mdxData && !mdxSource)) {
    return (
      <>
        <SEO title="Content Not Found" description="" />
        <div className="text-center py-24 text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">{error || 'Content not found'}</p>
          <p className="text-sm">The page you're looking for doesn't exist.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title={pageTitle} description={pageDescription} />
      <div className="w-full flex flex-col xl:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile TOC - At top on small screens */}
          {headings.length > 0 && (
            <div className="xl:hidden mb-8">
              <TableOfContents headings={headings} />
            </div>
          )}
          
          {contentType === 'json' && content ? (
            <ContentRenderer content={content} />
          ) : contentType === 'mdx' && mdxSource ? (
            <article className="mdx-content">
              <MDXRemote {...mdxSource} components={mdxComponents} />
            </article>
          ) : contentType === 'mdx' && mdxData ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600 dark:text-primary-400" />
            </div>
          ) : null}
          
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
    </>
  );
}

