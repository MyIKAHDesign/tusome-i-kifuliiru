import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NumberLessonContent, ContentItem, ContentType, LessonContent, NumberSection, NumberEntry, TextBlock } from './content-schema';

/**
 * Converts a number lesson MDX file to JSON format
 */
export function convertNumberLessonMDXToJSON(mdxContent: string, slug: string): NumberLessonContent | null {
  const { content, data } = matter(mdxContent);
  
  // Extract title and range from first heading
  const titleMatch = content.match(/^#\s+(.+?)(?:\s*\(([^)]+)\))?$/m);
  const title = data.title || titleMatch?.[1]?.trim() || slug;
  const range = titleMatch?.[2] || data.range || '';
  
  // Extract description (text after title, before first ##)
  const descMatch = content.match(/^#.+\n\n(.+?)(?=\n##)/s);
  const description = descMatch?.[1]?.trim() || '';
  
  // Extract sections - look for ### headings
  const sections: NumberSection[] = [];
  
  // Split by ### headings
  const sectionParts = content.split(/^###\s+/gm).slice(1); // Skip first part (before first ###)
  
  for (const sectionPart of sectionParts) {
    const lines = sectionPart.split('\n');
    const sectionTitleLine = lines[0]?.trim() || '';
    
    // Extract section title and range
    const sectionTitleMatch = sectionTitleLine.match(/^(.+?)(?:\s*\(([^)]+)\))?$/);
    const sectionTitle = sectionTitleMatch?.[1]?.trim() || sectionTitleLine;
    const sectionRange = sectionTitleMatch?.[2] || '';
    
    // Extract numbers from remaining lines
    const numbers: NumberEntry[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) break; // Stop at next heading or empty
      
      // Match patterns like "2.001 = Bihumbi bibiri na higuma" or "2001 = ..."
      const numberMatch = line.match(/^([0-9.,]+)\s*=\s*(.+?)(?:\s*$|$)/);
      if (numberMatch) {
        const valueStr = numberMatch[1].replace(/,/g, '');
        const value = valueStr.includes('.') ? parseFloat(valueStr) : parseInt(valueStr);
        const kifuliiru = numberMatch[2].trim();
        if (!isNaN(value) && kifuliiru) {
          numbers.push({ value, kifuliiru });
        }
      }
    }
    
    if (numbers.length > 0) {
      sections.push({
        title: sectionTitle,
        range: sectionRange,
        numbers,
      });
    }
  }
  
  // If no sections found with ###, try to extract from ## sections or flat list
  if (sections.length === 0) {
    // Try extracting from ## sections
    const mainSections = content.split(/^##\s+/gm).slice(1);
    
    for (const mainSection of mainSections) {
      const lines = mainSection.split('\n');
      const sectionTitle = lines[0]?.trim() || '';
      
      const numbers: NumberEntry[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('#')) continue;
        
        const numberMatch = line.match(/^([0-9.,]+)\s*=\s*(.+?)(?:\s*$|$)/);
        if (numberMatch) {
          const valueStr = numberMatch[1].replace(/,/g, '');
          const value = valueStr.includes('.') ? parseFloat(valueStr) : parseInt(valueStr);
          const kifuliiru = numberMatch[2].trim();
          if (!isNaN(value) && kifuliiru) {
            numbers.push({ value, kifuliiru });
          }
        }
      }
      
      if (numbers.length > 0) {
        sections.push({
          title: sectionTitle,
          range: '',
          numbers,
        });
      }
    }
  }
  
  // Last resort: extract all number lines from entire content
  if (sections.length === 0) {
    const numberLines = content.split('\n').filter(line => {
      const trimmed = line.trim();
      return /^[0-9.,]+\s*=/.test(trimmed);
    });
    
    if (numberLines.length > 0) {
      const numbers = numberLines.map(line => {
        const match = line.match(/^([0-9.,]+)\s*=\s*(.+?)(?:\s*$|$)/);
        if (match) {
          const valueStr = match[1].replace(/,/g, '');
          const value = valueStr.includes('.') ? parseFloat(valueStr) : parseInt(valueStr);
          return {
            value,
            kifuliiru: match[2].trim(),
          };
        }
        return null;
      }).filter((n): n is NumberEntry => n !== null);
      
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
    title: title.replace(/\s*\([^)]+\)\s*$/, '').trim(),
    description: description || undefined,
    range,
    sections,
  };
}

/**
 * Converts narrative/lesson MDX to JSON
 */
export function convertLessonMDXToJSON(mdxContent: string, slug: string): LessonContent {
  const { content, data } = matter(mdxContent);
  
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = data.title || titleMatch?.[1]?.trim() || slug;
  
  const blocks: TextBlock[] = [];
  const lines = content.split('\n');
  
  let currentParagraph: string[] = [];
  let inList = false;
  let listItems: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Headings
    if (trimmed.startsWith('# ')) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: 'paragraph', content: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      if (inList) {
        blocks.push({ type: 'list', content: '', items: listItems });
        listItems = [];
        inList = false;
      }
      blocks.push({ type: 'heading', level: 1, content: trimmed.replace(/^#\s+/, '') });
    } else if (trimmed.startsWith('## ')) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: 'paragraph', content: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      if (inList) {
        blocks.push({ type: 'list', content: '', items: listItems });
        listItems = [];
        inList = false;
      }
      blocks.push({ type: 'heading', level: 2, content: trimmed.replace(/^##\s+/, '') });
    } else if (trimmed.startsWith('### ')) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: 'paragraph', content: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      if (inList) {
        blocks.push({ type: 'list', content: '', items: listItems });
        listItems = [];
        inList = false;
      }
      blocks.push({ type: 'heading', level: 3, content: trimmed.replace(/^###\s+/, '') });
    } 
    // Images
    else if (trimmed.startsWith('![')) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: 'paragraph', content: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      if (inList) {
        blocks.push({ type: 'list', content: '', items: listItems });
        listItems = [];
        inList = false;
      }
      const imgMatch = trimmed.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch) {
        blocks.push({ type: 'image', content: '', src: imgMatch[2], alt: imgMatch[1] || '' });
      }
    }
    // Lists
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: 'paragraph', content: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      inList = true;
      listItems.push(trimmed.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''));
    }
    // Empty line
    else if (!trimmed) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: 'paragraph', content: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      if (inList) {
        blocks.push({ type: 'list', content: '', items: listItems });
        listItems = [];
        inList = false;
      }
    }
    // Regular paragraph text
    else if (!trimmed.startsWith('|') && !trimmed.startsWith('```')) {
      currentParagraph.push(trimmed);
    }
  }
  
  // Add remaining content
  if (currentParagraph.length > 0) {
    blocks.push({ type: 'paragraph', content: currentParagraph.join(' ').trim() });
  }
  if (inList && listItems.length > 0) {
    blocks.push({ type: 'list', content: '', items: listItems });
  }
  
  return {
    type: 'article',
    title,
    blocks: blocks.filter(b => {
      if (typeof b.content === 'string' && b.content.trim()) return true;
      if (Array.isArray(b.content) && b.content.length > 0) return true;
      if (b.items && b.items.length > 0) return true;
      return false;
    }),
  };
}

/**
 * Migrate a single MDX file to JSON
 */
export function migrateMDXToJSON(mdxPath: string, outputPath: string): boolean {
  try {
    const mdxContent = fs.readFileSync(mdxPath, 'utf8');
    const slug = path.basename(mdxPath, '.mdx');
    const dir = path.dirname(mdxPath);
    const relativeDir = path.relative(path.join(process.cwd(), 'data'), dir);
    const fullSlug = relativeDir === '.' || relativeDir === '' ? slug : `${relativeDir}/${slug}`;
    
    // Detect content type
    let contentData: NumberLessonContent | LessonContent | null = null;
    let contentType: ContentType = 'article';
    
    // Check if it's a number lesson (ukuharura folder or number-related files)
    const isNumberLesson = 
      mdxPath.includes('ukuharura') || 
      mdxPath.includes('bihumbi') || 
      mdxPath.includes('magana') || 
      mdxPath.includes('ikumi') ||
      mdxPath.includes('igana') ||
      mdxPath.includes('kihumbi') ||
      mdxPath.includes('zero') ||
      mdxPath.includes('umulyari') ||
      mdxPath.includes('umulyoni');
    
    if (isNumberLesson) {
      const numberLesson = convertNumberLessonMDXToJSON(mdxContent, slug);
      if (numberLesson && numberLesson.sections.length > 0) {
        contentData = numberLesson;
        contentType = 'number-lesson';
      }
    }
    
    // If not a number lesson or conversion failed, convert to article
    if (!contentData) {
      contentData = convertLessonMDXToJSON(mdxContent, slug);
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
        tags: isNumberLesson ? ['numbers', 'ukuharura'] : [],
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
