import { NextApiRequest, NextApiResponse } from 'next';
import { getMetaData, getAllContentSlugs, getContentBySlug } from '../../lib/content-loader';

interface SearchResult {
  title: string;
  path: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = (req.query.q as string)?.toLowerCase() || '';
  if (query.length < 2) {
    return res.status(200).json({ results: [] });
  }

  try {
    const results: SearchResult[] = [];
    const meta = getMetaData();

    // Search through meta.json
    const searchInMeta = (metaObj: any, basePath: string = '') => {
      for (const [key, value] of Object.entries(metaObj)) {
        if (typeof value === 'string') {
          if (value.toLowerCase().includes(query)) {
            results.push({
              title: value,
              path: `/docs/${basePath ? `${basePath}/${key}` : (key === 'index' ? '' : key)}`,
            });
          }
        } else if (value && typeof value === 'object') {
          const item = value as any;
          const title = item.title || key;
          if (title.toLowerCase().includes(query)) {
            results.push({
              title,
              path: item.href || `/docs/${basePath ? `${basePath}/${key}` : (key === 'index' ? '' : key)}`,
            });
          }
          if (item.items) {
            searchInMeta(item.items, basePath ? `${basePath}/${key}` : key);
          }
        }
      }
    };

    searchInMeta(meta);

    // Also search in actual content
    const slugs = getAllContentSlugs();
    for (const slug of slugs.slice(0, 20)) { // Limit to avoid too many reads
      const content = getContentBySlug(slug);
      if (content && content.content.toLowerCase().includes(query)) {
        const title = content.data.title || slug.split('/').pop() || 'Untitled';
        if (!results.find(r => r.path === `/docs/${slug}`)) {
          results.push({
            title,
            path: `/docs/${slug}`,
          });
        }
      }
    }

    res.status(200).json({ results: results.slice(0, 10) });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
}

