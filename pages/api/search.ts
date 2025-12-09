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

    // Header navigation items to exclude from sidebar search
    const headerNavItems = ['kifuliiru', 'imigani', 'imigeeza', 'imwitu', 'bingi-ku-kifuliiru', 'twehe', 'contact', 'eng-frn-swa'];
    
    interface MetaItem {
      title?: string;
      type?: 'page' | 'menu' | 'link';
      href?: string;
      newWindow?: boolean;
      items?: Record<string, MetaItem | string>;
    }

    // Search through meta.json (sidebar content)
    const searchInMeta = (metaObj: Record<string, MetaItem | string>, basePath: string = '', isHeaderNav: boolean = false) => {
      for (const [key, value] of Object.entries(metaObj)) {
        // Skip header navigation items when searching sidebar
        if (headerNavItems.includes(key) && !isHeaderNav) {
          continue;
        }
        
        if (typeof value === 'string') {
          if (value.toLowerCase().includes(query)) {
            const path = basePath ? `${basePath}/${key}` : (key === 'index' ? '' : key);
            results.push({
              title: value,
              path: `/${path}`,
            });
          }
        } else if (value && typeof value === 'object') {
          const item = value as MetaItem;
          const title = item.title || key;
          if (title.toLowerCase().includes(query)) {
            // Handle different path types
            let path: string;
            if (item.href) {
              path = item.href;
            } else if (basePath) {
              path = `/${basePath}/${key}`;
            } else {
              path = key === 'index' ? '/' : `/${key}`;
            }
            
            // Don't add if already exists
            if (!results.find(r => r.path === path)) {
              results.push({
                title,
                path,
              });
            }
          }
          if (item.items) {
            searchInMeta(item.items, basePath ? `${basePath}/${key}` : key, isHeaderNav || headerNavItems.includes(key));
          }
        }
      }
    };

    // Search sidebar content (excludes header nav items)
    searchInMeta(meta);

    // Also search in actual content files (sidebar content)
    const slugs = getAllContentSlugs();
    for (const slug of slugs) {
      // Skip header navigation slugs
      const isHeaderSlug = headerNavItems.some(navItem => 
        slug === navItem || slug.startsWith(`${navItem}/`)
      );
      
      if (isHeaderSlug) {
        continue;
      }
      
      const content = getContentBySlug(slug);
      if (content) {
        const contentLower = content.content.toLowerCase();
        const title = content.data.title || slug.split('/').pop() || 'Untitled';
        const titleLower = title.toLowerCase();
        
        // Search in title or content
        if (titleLower.includes(query) || contentLower.includes(query)) {
          const path = `/${slug}`;
          if (!results.find(r => r.path === path)) {
            results.push({
              title,
              path,
            });
          }
        }
      }
    }

    // Sort results: title matches first, then content matches
    results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(query);
      const bTitleMatch = b.title.toLowerCase().includes(query);
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return 0;
    });

    res.status(200).json({ results: results.slice(0, 20) });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
}

