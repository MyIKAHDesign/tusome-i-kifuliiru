import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NumberLessonContent, ContentItem, ContentType } from './content-schema';

/**
 * Converts a number lesson MDX file to JSON format
 * This is a helper function to migrate existing MDX content to JSON
 */
export function convertNumberLessonMDXToJSON(mdxContent: string, slug: string): NumberLessonContent | null {
  const { content, data } = matter(mdxContent);
  
  // Extract title from frontmatter or first heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = data.title || titleMatch?.[1] || slug;
  
  // Extract range from content
  const rangeMatch = content.match(/\(([0-9.,\s-]+)\)/);
  const range = rangeMatch?.[1] || '';
  
  // Extract sections
  const sections: any[] = [];
  const sectionMatches = content.matchAll(/###\s+(.+?)\n\n([\s\S]*?)(?=###|$)/g);
  
  for (const match of sectionMatches) {
    const sectionTitle = match[1].trim();
    const sectionContent = match[2].trim();
    
    // Extract range from section title
    const sectionRangeMatch = sectionTitle.match(/\(([0-9.,\s-]+)\)/);
    const sectionRange = sectionRangeMatch?.[1] || '';
    
    // Extract numbers from section content
    const numbers: any[] = [];
    const numberLines = sectionContent.split('\n').filter(line => line.includes('='));
    
    for (const line of numberLines) {
      const numberMatch = line.match(/([0-9.,]+)\s*=\s*(.+)/);
      if (numberMatch) {
        const value = parseFloat(numberMatch[1].replace(/,/g, ''));
        const kifuliiru = numberMatch[2].trim();
        numbers.push({ value, kifuliiru });
      }
    }
    
    if (numbers.length > 0) {
      sections.push({
        title: sectionTitle.replace(/\s*\([^)]+\)\s*$/, '').trim(),
        range: sectionRange,
        numbers,
      });
    }
  }
  
  if (sections.length === 0) {
    // Try to extract simple number list
    const numberLines = content.split('\n').filter(line => /^\d+\s*=/.test(line.trim()));
    if (numberLines.length > 0) {
      const numbers = numberLines.map(line => {
        const match = line.match(/(\d+)\s*=\s*(.+)/);
        if (match) {
          return {
            value: parseInt(match[1]),
            kifuliiru: match[2].trim(),
          };
        }
        return null;
      }).filter(Boolean) as any[];
      
      if (numbers.length > 0) {
        sections.push({
          title: 'Numbers',
          range: '',
          numbers,
        });
      }
    }
  }
  
  if (sections.length === 0) {
    return null;
  }
  
  return {
    type: 'number-lesson',
    title,
    range,
    sections,
  };
}

/**
 * Migrate a single MDX file to JSON
 */
export function migrateMDXToJSON(mdxPath: string, outputPath: string): boolean {
  try {
    const mdxContent = fs.readFileSync(mdxPath, 'utf8');
    const slug = path.basename(mdxPath, '.mdx');
    const dir = path.dirname(mdxPath).replace(/^.*\/data/, 'data');
    const fullSlug = dir === 'data' ? slug : `${dir.replace(/^data\//, '')}/${slug}`;
    
    // Try to detect content type and convert
    let contentData: any = null;
    let contentType: ContentType = 'lesson';
    
    // Check if it's a number lesson
    if (mdxPath.includes('ukuharura') || mdxPath.includes('bihumbi') || mdxPath.includes('magana') || mdxPath.includes('ikumi')) {
      const numberLesson = convertNumberLessonMDXToJSON(mdxContent, slug);
      if (numberLesson) {
        contentData = numberLesson;
        contentType = 'number-lesson';
      }
    }
    
    // If not a number lesson, convert to article/lesson format
    if (!contentData) {
      const { content, data } = matter(mdxContent);
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = data.title || titleMatch?.[1] || slug;
      
      // Simple conversion - split by headings and paragraphs
      const blocks: any[] = [];
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.startsWith('# ')) {
          blocks.push({ type: 'heading', level: 1, content: line.replace(/^#\s+/, '') });
        } else if (line.startsWith('## ')) {
          blocks.push({ type: 'heading', level: 2, content: line.replace(/^##\s+/, '') });
        } else if (line.startsWith('### ')) {
          blocks.push({ type: 'heading', level: 3, content: line.replace(/^###\s+/, '') });
        } else if (line.trim() && !line.startsWith('![') && !line.startsWith('|')) {
          blocks.push({ type: 'paragraph', content: line });
        }
      }
      
      contentData = {
        type: 'article',
        title,
        blocks,
      };
      contentType = 'article';
    }
    
    const jsonContent: ContentItem = {
      id: fullSlug,
      slug: fullSlug,
      title: contentData.title,
      contentType,
      data: contentData,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(jsonContent, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error migrating ${mdxPath}:`, error);
    return false;
  }
}

