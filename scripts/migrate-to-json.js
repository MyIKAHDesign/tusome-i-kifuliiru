#!/usr/bin/env node
/**
 * Migration script to convert MDX files to JSON format
 * Run with: node scripts/migrate-to-json.js
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const dataDir = path.join(process.cwd(), 'data');

function convertNumberLessonMDXToJSON(mdxContent, slug) {
  const { content, data } = matter(mdxContent);
  
  const titleMatch = content.match(/^#\s+(.+?)(?:\s*\(([^)]+)\))?$/m);
  const title = data.title || titleMatch?.[1]?.trim() || slug;
  const range = titleMatch?.[2] || data.range || '';
  
  const descMatch = content.match(/^#.+\n\n(.+?)(?=\n##)/s);
  const description = descMatch?.[1]?.trim() || '';
  
  const sections = [];
  const sectionParts = content.split(/^###\s+/gm).slice(1);
  
  for (const sectionPart of sectionParts) {
    const lines = sectionPart.split('\n');
    const sectionTitleLine = lines[0]?.trim() || '';
    
    const sectionTitleMatch = sectionTitleLine.match(/^(.+?)(?:\s*\(([^)]+)\))?$/);
    const sectionTitle = sectionTitleMatch?.[1]?.trim() || sectionTitleLine;
    const sectionRange = sectionTitleMatch?.[2] || '';
    
    const numbers = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) break;
      
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
      }).filter(Boolean);
      
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

function convertLessonMDXToJSON(mdxContent, slug) {
  const { content, data } = matter(mdxContent);
  
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = data.title || titleMatch?.[1]?.trim() || slug;
  
  const blocks = [];
  const lines = content.split('\n');
  
  let currentParagraph = [];
  let inList = false;
  let listItems = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed.startsWith('# ')) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: 'paragraph', content: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      if (inList) {
        blocks.push({ type: 'list', items: listItems });
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
        blocks.push({ type: 'list', items: listItems });
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
        blocks.push({ type: 'list', items: listItems });
        listItems = [];
        inList = false;
      }
      blocks.push({ type: 'heading', level: 3, content: trimmed.replace(/^###\s+/, '') });
    } else if (trimmed.startsWith('![')) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: 'paragraph', content: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      if (inList) {
        blocks.push({ type: 'list', items: listItems });
        listItems = [];
        inList = false;
      }
      const imgMatch = trimmed.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch) {
        blocks.push({ type: 'image', src: imgMatch[2], alt: imgMatch[1] || '' });
      }
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: 'paragraph', content: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      inList = true;
      listItems.push(trimmed.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''));
    } else if (!trimmed) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: 'paragraph', content: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      if (inList) {
        blocks.push({ type: 'list', items: listItems });
        listItems = [];
        inList = false;
      }
    } else if (!trimmed.startsWith('|') && !trimmed.startsWith('```')) {
      currentParagraph.push(trimmed);
    }
  }
  
  if (currentParagraph.length > 0) {
    blocks.push({ type: 'paragraph', content: currentParagraph.join(' ').trim() });
  }
  if (inList && listItems.length > 0) {
    blocks.push({ type: 'list', items: listItems });
  }
  
  return {
    type: 'article',
    title,
    blocks: blocks.filter(b => b.content || (b.items && b.items.length > 0)),
  };
}

function migrateMDXToJSON(mdxPath, outputPath) {
  try {
    const mdxContent = fs.readFileSync(mdxPath, 'utf8');
    const slug = path.basename(mdxPath, '.mdx');
    const dir = path.dirname(mdxPath);
    const relativeDir = path.relative(dataDir, dir);
    const fullSlug = relativeDir === '.' || relativeDir === '' ? slug : `${relativeDir}/${slug}`;
    
    let contentData = null;
    let contentType = 'article';
    
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
    
    if (!contentData) {
      contentData = convertLessonMDXToJSON(mdxContent, slug);
      contentType = 'article';
    }
    
    const jsonContent = {
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
    
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(jsonContent, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error migrating ${mdxPath}:`, error.message);
    return false;
  }
}

let migratedCount = 0;
let failedCount = 0;

function migrateDirectory(dir, baseOutput = dataDir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    if (file === '_meta.json' || file.startsWith('.') || file.endsWith('.json')) {
      continue;
    }
    
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      migrateDirectory(fullPath, baseOutput);
    } else if (file.endsWith('.mdx')) {
      const relativePath = path.relative(dataDir, fullPath);
      const outputPath = path.join(baseOutput, relativePath.replace('.mdx', '.json'));
      
      process.stdout.write(`Migrating: ${relativePath}... `);
      const success = migrateMDXToJSON(fullPath, outputPath);
      
      if (success) {
        migratedCount++;
        console.log('✓');
      } else {
        failedCount++;
        console.log('✗');
      }
    }
  }
}

console.log('Starting migration from MDX to JSON...\n');
migrateDirectory(dataDir);
console.log(`\nMigration complete!`);
console.log(`✓ Successfully migrated: ${migratedCount} files`);
if (failedCount > 0) {
  console.log(`✗ Failed: ${failedCount} files`);
}

