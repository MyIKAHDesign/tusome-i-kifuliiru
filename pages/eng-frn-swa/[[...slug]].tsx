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

interface EngFrnSwaPageProps {
  jsonContent?: ContentData;
  mdxSource?: MDXRemoteSerializeResult;
  slug: string;
  contentType: 'json' | 'mdx';
}

export default function EngFrnSwaPage({ jsonContent, mdxSource, slug, contentType }: EngFrnSwaPageProps) {
  const title = jsonContent?.title || mdxSource?.frontmatter?.title || slug.split('/').pop() || 'ENG/SWA/FRN';
  
  return (
    <>
      <SEO
        title={`${title} - ENG/SWA/FRN`}
        description={`Learn ${title} in Kifuliiru`}
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
  const engFrnSwaSlugs = allSlugs.filter(slug => 
    slug.startsWith('eng-frn-swa/') || 
    slug === 'eng-frn-swa' ||
    slug === 'kiswahili' ||
    slug === 'english' ||
    slug === 'francais' ||
    slug === 'tukole'
  );
  
  return {
    paths: engFrnSwaSlugs.map((slug) => {
      if (slug === 'eng-frn-swa') {
        return { params: { slug: [] } };
      }
      if (slug.startsWith('eng-frn-swa/')) {
        return { params: { slug: slug.replace('eng-frn-swa/', '').split('/') } };
      }
      return { params: { slug: [slug] } };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugArray = params?.slug as string[] || [];
  let slug: string;
  
  if (slugArray.length === 0) {
    slug = 'eng-frn-swa';
  } else if (['kiswahili', 'english', 'francais', 'tukole'].includes(slugArray[0])) {
    slug = slugArray[0];
  } else {
    slug = `eng-frn-swa/${slugArray.join('/')}`;
  }
  
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

  const mdxContent = getContentBySlug(slug);
  if (mdxContent) {
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
  }

  return {
    props: {
      slug,
      contentType: 'json' as const,
    },
  };
};

