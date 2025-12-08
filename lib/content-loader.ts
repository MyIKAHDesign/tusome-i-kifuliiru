import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const dataDirectory = path.join(process.cwd(), 'data');

export interface ContentItem {
  slug: string;
  content: string;
  data: {
    title?: string;
    [key: string]: any;
  };
}

export function getAllContentSlugs(): string[] {
  const slugs: string[] = [];
  
  function scanDirectory(dir: string, basePath: string = '') {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      // Skip _meta.json and other non-MDX files
      if (file === '_meta.json' || file.startsWith('.')) {
        continue;
      }
      
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath, path.join(basePath, file));
      } else if (file.endsWith('.mdx')) {
        const slug = path.join(basePath, file.replace(/\.mdx$/, ''));
        // Convert to URL-friendly slug
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
      // Try direct file first
      filePath = path.join(dataDirectory, `${slug}.mdx`);
      
      // If not found, try with directory structure
      if (!fs.existsSync(filePath)) {
        filePath = path.join(dataDirectory, slug.split('/').join(path.sep) + '.mdx');
      }
    }
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      content,
      data: data as any,
    };
  } catch (error) {
    console.error(`Error loading content for slug: ${slug}`, error);
    return null;
  }
}

export function getMetaData() {
  try {
    const metaPath = path.join(dataDirectory, '_meta.json');
    if (fs.existsSync(metaPath)) {
      const metaContents = fs.readFileSync(metaPath, 'utf8');
      return JSON.parse(metaContents);
    }
  } catch (error) {
    console.error('Error loading meta.json', error);
  }
  return {};
}
