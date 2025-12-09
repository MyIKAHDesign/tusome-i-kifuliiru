import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const dataDirectory = path.join(process.cwd(), 'data');

export interface ContentItem {
  slug: string;
  content: string;
  data: {
    title?: string;
    [key: string]: unknown;
  };
}

export function getAllContentSlugs(): string[] {
  const slugs: string[] = [];
  
  function scanDirectory(dir: string, basePath: string = '') {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      // Skip _meta.json and other non-content files
      if (file === '_meta.json' || file.startsWith('.')) {
        continue;
      }
      
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively scan subdirectories
        scanDirectory(fullPath, path.join(basePath, file));
      } else if (file.endsWith('.mdx') || file.endsWith('.json')) {
        // Support both MDX and JSON files
        const slug = path.join(basePath, file.replace(/\.(mdx|json)$/, ''));
        // Convert to URL-friendly slug (handle both Windows and Unix paths)
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
    // Handle index page
    let filePath: string;
    
    if (slug === '' || slug === 'index') {
      filePath = path.join(dataDirectory, 'index.mdx');
    } else {
      // Handle nested paths like "ukuharura/abandu"
      const slugParts = slug.split('/');
      
      // Build the file path - join all parts with path.sep
      filePath = path.join(dataDirectory, ...slugParts) + '.mdx';
    }
    
    if (!fs.existsSync(filePath)) {
      // Try alternative path formats
      filePath = path.join(dataDirectory, slug.replace(/\//g, path.sep) + '.mdx');
      
      if (!fs.existsSync(filePath)) {
        return null;
      }
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      content,
      data: data,
    };
  } catch (error) {
    console.error(`Error loading content for slug: ${slug}`, error);
    return null;
  }
}

export function getMetaData(subPath?: string) {
  try {
    const metaPath = subPath 
      ? path.join(dataDirectory, subPath, '_meta.json')
      : path.join(dataDirectory, '_meta.json');
      
    if (fs.existsSync(metaPath)) {
      const metaContents = fs.readFileSync(metaPath, 'utf8');
      return JSON.parse(metaContents);
    }
  } catch (error) {
    console.error('Error loading meta.json', error);
  }
  return {};
}
