import fs from 'fs';
import path from 'path';
import { ContentItem, ContentData } from './content-schema';

const dataDirectory = path.join(process.cwd(), 'data');

export function getAllContentSlugs(): string[] {
  const slugs: string[] = [];
  
  function scanDirectory(dir: string, basePath: string = '') {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      if (file === '_meta.json' || file.startsWith('.')) {
        continue;
      }
      
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath, path.join(basePath, file));
      } else if (file.endsWith('.json')) {
        const slug = path.join(basePath, file.replace(/\.json$/, ''));
        const urlSlug = slug === 'index' ? '' : slug.replace(/\\/g, '/');
        slugs.push(urlSlug);
      }
    }
  }
  
  scanDirectory(dataDirectory);
  return slugs;
}

export function getContentBySlug(slug: string): ContentItem | null {
  try {
    let filePath: string;
    
    if (slug === '' || slug === 'index') {
      filePath = path.join(dataDirectory, 'index.json');
    } else {
      const slugParts = slug.split('/');
      filePath = path.join(dataDirectory, ...slugParts) + '.json';
    }
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const content: ContentItem = JSON.parse(fileContents);
    
    return content;
  } catch (error) {
    console.error(`Error loading content for slug: ${slug}`, error);
    return null;
  }
}

export function getContentData(slug: string): ContentData | null {
  const content = getContentBySlug(slug);
  return content?.data || null;
}

