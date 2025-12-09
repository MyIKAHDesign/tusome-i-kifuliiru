import React, { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getContentData } from '../../lib/json-content-loader';
import { getContentBySlug } from '../../lib/content-loader';
import ContentRenderer from '../../components/content/ContentRenderer';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { mdxComponents } from '../../mdx-components';
import SEO from '../../components/SEO';
import { getAllContentSlugs } from '../../lib/content-loader';
import { ContentData, TextBlock, LessonContent } from '../../lib/content-schema';
import TableOfContents from '../../components/TableOfContents';
import PageNavigation from '../../components/PageNavigation';

interface ImwituPageProps {
  jsonContent?: ContentData;
  mdxSource?: MDXRemoteSerializeResult;
  slug: string;
  contentType: 'json' | 'mdx';
}

export default function ImwituPage({ jsonContent, mdxSource, slug, contentType }: ImwituPageProps) {
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

  const getTitle = (): string => {
    if (jsonContent && 'title' in jsonContent && typeof jsonContent.title === 'string') {
      return jsonContent.title;
    }
    if (mdxSource?.frontmatter && typeof mdxSource.frontmatter === 'object' && 'title' in mdxSource.frontmatter) {
      const frontmatterTitle = mdxSource.frontmatter.title;
      if (typeof frontmatterTitle === 'string') return frontmatterTitle;
    }
    return slug.split('/').pop() || 'Imwitu';
  };
  const title = getTitle();
  
  return (
    <>
      <SEO
        title={`${title} - Imwitu`}
        description={`Learn about ${title} in Kifuliiru`}
      />
      <div className="w-full">
        {/* Page TOC - Inline at top */}
        {headings.length > 0 && (
          <div className="mb-8">
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
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400">Content coming soon...</p>
          </div>
        )}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allSlugs = getAllContentSlugs();
  // Include both nested (imwitu/...) and root-level imwitu-related pages
  const imwituRelatedSlugs = ['ibufuliiru', 'imigazi', 'inyiji', 'utwaya'];
  const imwituSlugs = allSlugs.filter(slug => 
    slug.startsWith('imwitu/') || 
    slug === 'imwitu' ||
    imwituRelatedSlugs.includes(slug)
  );
  
  return {
    paths: imwituSlugs.map((slug) => {
      if (slug === 'imwitu') {
        return { params: { slug: [] } };
      }
      if (slug.startsWith('imwitu/')) {
        return { params: { slug: slug.replace('imwitu/', '').split('/') } };
      }
      // Root-level imwitu pages
      return { params: { slug: [slug] } };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugArray = params?.slug as string[] || [];
  const nestedSlug = slugArray.length > 0 ? `imwitu/${slugArray.join('/')}` : 'imwitu';
  const rootSlug = slugArray.length > 0 ? slugArray.join('/') : 'imwitu';
  
  // Try nested path first (imwitu/imigazi)
  let jsonContent = getContentData(nestedSlug);
  let mdxContent = getContentBySlug(nestedSlug);
  
  // If not found, try root-level slug (imigazi)
  if (!jsonContent && !mdxContent) {
    jsonContent = getContentData(rootSlug);
    mdxContent = getContentBySlug(rootSlug);
  }
  
  // Use the slug that worked (prefer nested for consistency)
  const finalSlug = jsonContent || mdxContent ? nestedSlug : rootSlug;
  
  if (jsonContent) {
    return {
      props: {
        jsonContent,
        slug: finalSlug,
        contentType: 'json' as const,
      },
    };
  }

  if (mdxContent) {
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
    props: {
      slug: finalSlug,
      contentType: 'json' as const,
    },
  };
};

