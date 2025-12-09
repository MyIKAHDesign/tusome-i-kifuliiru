import React from 'react';
import { getContentData, getAllContentSlugs as getAllJsonContentSlugs } from '../../../lib/json-content-loader';
import { getContentBySlug, getAllContentSlugs } from '../../../lib/content-loader';
import { serialize } from 'next-mdx-remote/serialize';
import PageContent from '../../../components/PageContent';

interface PageProps {
  params: {
    slug?: string[];
  };
}

export async function generateStaticParams() {
  // Get slugs from both JSON and MDX content loaders
  const jsonSlugs = getAllJsonContentSlugs();
  const mdxSlugs = getAllContentSlugs();
  const allSlugs = [...new Set([...jsonSlugs, ...mdxSlugs])];
  
  const ukuharuraSlugs = allSlugs.filter(slug => 
    slug.startsWith('ukuharura/') || 
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
  
  return ukuharuraSlugs.map((slug) => {
    if (slug.startsWith('ukuharura/')) {
      return { slug: slug.replace('ukuharura/', '').split('/') };
    }
    return { slug: [slug] };
  });
}

async function getPageData(slugArray: string[]) {
  // If empty slugArray, there's no root ukuharura.json file - return not found
  if (slugArray.length === 0) {
    return {
      notFound: true,
    };
  }
  
  const nestedSlug = `ukuharura/${slugArray.join('/')}`;
  const rootSlug = slugArray.join('/');
  
  // Try nested path first (e.g., ukuharura/abandu)
  let jsonContent = getContentData(nestedSlug);
  let mdxContent = getContentBySlug(nestedSlug);
  
  // If not found, try root-level slug (e.g., harura, abandu)
  if (!jsonContent && !mdxContent) {
    jsonContent = getContentData(rootSlug);
    mdxContent = getContentBySlug(rootSlug);
  }
  
  // Use the slug that worked (prefer nested for consistency)
  const finalSlug = jsonContent || mdxContent ? nestedSlug : rootSlug;
  
  if (jsonContent) {
    return {
      jsonContent,
      slug: finalSlug,
      contentType: 'json' as const,
    };
  }
  
  if (mdxContent) {
    const mdxSource = await serialize(mdxContent.content, {
      parseFrontmatter: true,
    });
    return {
      mdxSource,
      slug: finalSlug,
      contentType: 'mdx' as const,
    };
  }

  return {
    notFound: true,
  };
}

export default async function UkuharuraPage({ params }: PageProps) {
  const slugArray = params.slug || [];
  const pageData = await getPageData(slugArray);
  
  if ('notFound' in pageData) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>Content not found</p>
      </div>
    );
  }

  return (
    <PageContent
      jsonContent={'jsonContent' in pageData ? pageData.jsonContent : undefined}
      mdxSource={'mdxSource' in pageData ? pageData.mdxSource : undefined}
      contentType={pageData.contentType}
    />
  );
}

