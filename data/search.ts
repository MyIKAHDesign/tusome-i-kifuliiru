import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

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
    const pagesDir = path.join(process.cwd(), 'pages');

    // Simple search through _meta.json files
    const searchInMeta = (dir: string, meta: any, basePath: string = '') => {
      for (const [key, value] of Object.entries(meta)) {
        if (typeof value === 'string') {
          if (value.toLowerCase().includes(query)) {
            results.push({
              title: value,
              path: basePath ? `${basePath}/${key}` : `/${key === 'index' ? '' : key}`,
            });
          }
        } else if (value && typeof value === 'object') {
          const item = value as any;
          const title = item.title || key;
          if (title.toLowerCase().includes(query)) {
            results.push({
              title,
              path: item.href || (basePath ? `${basePath}/${key}` : `/${key === 'index' ? '' : key}`),
            });
          }
          if (item.items) {
            searchInMeta(dir, item.items, basePath ? `${basePath}/${key}` : `/${key}`);
          }
        }
      }
    };

    // Search in main _meta.json
    const mainMetaPath = path.join(pagesDir, '_meta.json');
    if (fs.existsSync(mainMetaPath)) {
      const mainMeta = JSON.parse(fs.readFileSync(mainMetaPath, 'utf8'));
      searchInMeta(pagesDir, mainMeta);
    }

    // Search in subdirectory _meta.json files
    const subdirs = fs.readdirSync(pagesDir, { withFileTypes: true });
    for (const dirent of subdirs) {
      if (dirent.isDirectory()) {
        const subMetaPath = path.join(pagesDir, dirent.name, '_meta.json');
        if (fs.existsSync(subMetaPath)) {
          const subMeta = JSON.parse(fs.readFileSync(subMetaPath, 'utf8'));
          searchInMeta(path.join(pagesDir, dirent.name), subMeta, `/${dirent.name}`);
        }
      }
    }

    res.status(200).json({ results: results.slice(0, 10) }); // Limit to 10 results
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
}

