import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getContentData } from '../../lib/json-content-loader';
import { getContentBySlug } from '../../lib/content-loader';
import ContentRenderer from '../../components/content/ContentRenderer';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { mdxComponents } from '../../mdx-components';
import SEO from '../../components/SEO';
import { getAllContentSlugs } from '../../lib/content-loader';
import { ContentData } from '../../lib/content-schema';

interface BingiKuKifuliiruPageProps {
  jsonContent?: ContentData;
  mdxSource?: MDXRemoteSerializeResult;
  slug: string;
  contentType: 'json' | 'mdx';
}

export default function BingiKuKifuliiruPage({ jsonContent, mdxSource, slug, contentType }: BingiKuKifuliiruPageProps) {
  const title = jsonContent?.title || mdxSource?.frontmatter?.title || slug.split('/').pop() || 'Bingi ku Kifuliiru';
  
  return (
    <>
      <SEO
        title={`${title} - Bingi ku Kifuliiru`}
        description={`Learn about ${title} in Kifuliiru`}
      />
      <div className="max-w-[1400px] mx-auto w-full">
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
  // Filter for bingi-ku-kifuliiru content
  const bingiSlugs = allSlugs.filter(slug => 
    slug.startsWith('bingi-ku-kifuliiru/') || 
    slug === 'bingi-ku-kifuliiru' ||
    // Include bingi-ku-kifuliiru-related pages at root level
    slug === 'amagambo' ||
    slug === 'bitaabo-bya-bafuliiru' ||
    slug === 'imikolwa' ||
    slug === 'invumo' ||
    slug === 'ibinamishwa-mu-kifuliiru' ||
    slug === 'ibufuliiru.com' ||
    slug === 'tuganule_i_kifuliiru' ||
    slug === 'ibiyandike_mu_kifuliiru'
  );
  
  return {
    paths: bingiSlugs.map((slug) => {
      if (slug === 'bingi-ku-kifuliiru') {
        return { params: { slug: [] } };
      }
      if (slug.startsWith('bingi-ku-kifuliiru/')) {
        return { params: { slug: slug.replace('bingi-ku-kifuliiru/', '').split('/') } };
      }
      // For standalone bingi-ku-kifuliiru pages, use the slug directly
      return { params: { slug: [slug] } };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugArray = params?.slug as string[] || [];
  const nestedSlug = slugArray.length > 0 ? `bingi-ku-kifuliiru/${slugArray.join('/')}` : 'bingi-ku-kifuliiru';
  const rootSlug = slugArray.length === 0 ? 'bingi-ku-kifuliiru' : slugArray.join('/');
  
  // Try nested path first (e.g., bingi-ku-kifuliiru/amagambo)
  let jsonContent = getContentData(nestedSlug);
  let mdxContent = getContentBySlug(nestedSlug);
  
  // If not found, try root-level slug (e.g., amagambo, ibiyandike_mu_kifuliiru)
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
    notFound: true,
  };
};

