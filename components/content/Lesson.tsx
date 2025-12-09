import React from 'react';
import Link from 'next/link';
import { LessonContent } from '../../lib/content-schema';
import Image from 'next/image';
import { FileText, Quote } from 'lucide-react';

interface LessonProps {
  content: LessonContent;
}

// Parse markdown table and return table structure
const parseMarkdownTable = (text: string): { headers: string[], rows: string[][] } | null => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return null;
  
  // Check if it looks like a markdown table (starts with |)
  const firstLine = lines[0].trim();
  if (!firstLine.startsWith('|') || !firstLine.endsWith('|')) return null;
  
  // Check for separator line (contains ---)
  const secondLine = lines[1].trim();
  if (!secondLine.includes('---')) return null;
  
  // Parse headers
  const headers = firstLine.split('|')
    .map(cell => cell.trim())
    .filter(cell => cell.length > 0);
  
  // Parse rows
  const rows: string[][] = [];
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) continue;
    
    const row = line.split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0);
    
    if (row.length > 0) {
      rows.push(row);
    }
  }
  
  if (headers.length === 0 || rows.length === 0) return null;
  
  return { headers, rows };
};

// Parse markdown formatting (bold, italic, links) and convert to React elements
const parseMarkdown = (text: string): React.ReactNode[] => {
  if (typeof text !== 'string') return [text];
  
  let key = 0;
  
  // Helper function to parse a text segment recursively
  const parseSegment = (segment: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = segment;
    let lastIndex = 0;
    
    // Parse bold+italic: ***text*** or _**text**_
    const boldItalicRegex = /(\*\*\*|_\*\*)([^*_]+?)(\*\*\*|\*\*_)/g;
    let match;
    const boldItalicMatches: Array<{start: number, end: number, text: string}> = [];
    
    while ((match = boldItalicRegex.exec(segment)) !== null) {
      boldItalicMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[2]
      });
    }
    
    // Parse bold: **text**
    const boldRegex = /\*\*([^*]+?)\*\*/g;
    const boldMatches: Array<{start: number, end: number, text: string}> = [];
    
    while ((match = boldRegex.exec(segment)) !== null) {
      // Check if this match is already covered by a bold+italic match
      const isCovered = boldItalicMatches.some(m => 
        match.index >= m.start && match.index + match[0].length <= m.end
      );
      if (!isCovered) {
        boldMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[1]
        });
      }
    }
    
    // Parse italic: *text* or _text_ (but not if part of bold)
    const italicRegex = /(?<!\*)\*([^*]+?)\*(?!\*)|(?<!_)_([^_]+?)_(?!_)/g;
    const italicMatches: Array<{start: number, end: number, text: string}> = [];
    
    while ((match = italicRegex.exec(segment)) !== null) {
      const matchText = match[1] || match[2];
      // Check if this match is already covered by bold or bold+italic
      const isCovered = boldItalicMatches.some(m => 
        match.index >= m.start && match.index + match[0].length <= m.end
      ) || boldMatches.some(m => 
        match.index >= m.start && match.index + match[0].length <= m.end
      );
      if (!isCovered) {
        italicMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: matchText
        });
      }
    }
    
    // Parse links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const linkMatches: Array<{start: number, end: number, text: string, url: string}> = [];
    
    while ((match = linkRegex.exec(segment)) !== null) {
      linkMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[1],
        url: match[2]
      });
    }
    
    // Combine all matches and sort by position
    const allMatches = [
      ...boldItalicMatches.map(m => ({...m, type: 'boldItalic' as const})),
      ...boldMatches.map(m => ({...m, type: 'bold' as const})),
      ...italicMatches.map(m => ({...m, type: 'italic' as const})),
      ...linkMatches.map(m => ({...m, type: 'link' as const}))
    ].sort((a, b) => a.start - b.start);
    
    // Process matches in order
    let currentIndex = 0;
    for (const match of allMatches) {
      // Add text before match
      if (match.start > currentIndex) {
        const beforeText = segment.substring(currentIndex, match.start);
        if (beforeText) parts.push(beforeText);
      }
      
      // Process the match
      if (match.type === 'boldItalic') {
        parts.push(
          <strong key={key++}>
            <em>{parseSegment(match.text)}</em>
          </strong>
        );
      } else if (match.type === 'bold') {
        parts.push(
          <strong key={key++}>{parseSegment(match.text)}</strong>
        );
      } else if (match.type === 'italic') {
        parts.push(
          <em key={key++}>{parseSegment(match.text)}</em>
        );
      } else if (match.type === 'link') {
        const linkMatch = match as typeof match & {url: string};
        let linkUrl = linkMatch.url;
        const isExternal = 
          linkUrl.startsWith('http://') || 
          linkUrl.startsWith('https://') || 
          linkUrl.startsWith('//') ||
          (linkUrl.includes('.') && !linkUrl.startsWith('/') && !linkUrl.startsWith('./'));
        
        let normalizedUrl = linkUrl;
        if (isExternal) {
          if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://') && !normalizedUrl.startsWith('//')) {
            normalizedUrl = 'https://' + normalizedUrl;
          }
        } else {
          if (!normalizedUrl.startsWith('/')) {
            normalizedUrl = '/' + normalizedUrl;
          }
        }
        
        if (isExternal) {
          parts.push(
            <a
              key={key++}
              href={normalizedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 font-medium no-underline transition-colors border-b border-gray-300 dark:border-gray-700 pb-0.5 hover:text-gray-900 dark:hover:text-gray-50 hover:border-gray-500 dark:hover:border-gray-500"
            >
              {parseSegment(linkMatch.text)}
            </a>
          );
        } else {
          parts.push(
            <Link
              key={key++}
              href={normalizedUrl}
              className="text-gray-700 dark:text-gray-300 font-medium no-underline transition-colors border-b border-gray-300 dark:border-gray-700 pb-0.5 hover:text-gray-900 dark:hover:text-gray-50 hover:border-gray-500 dark:hover:border-gray-500"
            >
              {parseSegment(linkMatch.text)}
            </Link>
          );
        }
      }
      
      currentIndex = match.end;
    }
    
    // Add remaining text
    if (currentIndex < segment.length) {
      parts.push(segment.substring(currentIndex));
    }
    
    return parts;
  };
  
  return parseSegment(text);
};

export default function Lesson({ content }: LessonProps) {
  const renderBlock = (block: any, index: number) => {
    switch (block.type) {
      case 'heading':
        const level = block.level || 2;
        const headingProps = {
          key: index,
          className: `font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8 ${
            level === 1 ? 'text-4xl' :
            level === 2 ? 'text-3xl border-b border-gray-200 dark:border-gray-700 pb-2' :
            level === 3 ? 'text-2xl' :
            'text-xl'
          }`,
          children: block.content,
        };
        
        if (level === 1) return <h1 {...headingProps} />;
        if (level === 2) return <h2 {...headingProps} />;
        if (level === 3) return <h3 {...headingProps} />;
        if (level === 4) return <h4 {...headingProps} />;
        return <h2 {...headingProps} />;

      case 'paragraph':
        // Check if content contains a markdown table
        const content = block.content as string;
        const tableData = parseMarkdownTable(content);
        if (tableData) {
          return (
            <div key={index} className="my-8 overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                <thead>
                  <tr>
                    {tableData.headers.map((header, i) => (
                      <th
                        key={i}
                        className="p-4 text-left bg-white dark:bg-gray-900 font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800"
                      >
                        {parseMarkdown(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="p-4 text-left border-b border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {parseMarkdown(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <p
            key={index}
            className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6"
          >
            {parseMarkdown(content)}
          </p>
        );

      case 'list':
        return (
          <ul
            key={index}
            className="list-disc list-inside space-y-2 mb-6 text-gray-700 dark:text-gray-300"
          >
            {block.items?.map((item: string, i: number) => (
              <li key={i} className="leading-relaxed">{parseMarkdown(item)}</li>
            ))}
          </ul>
        );

      case 'quote':
        return (
          <blockquote
            key={index}
            className="border-l-4 border-gray-300 dark:border-gray-700 pl-6 py-4 my-6 bg-white dark:bg-gray-900 rounded-r-lg italic text-gray-700 dark:text-gray-300"
          >
            <Quote className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-2" />
            {parseMarkdown(block.content as string)}
          </blockquote>
        );

      case 'image':
        return (
          <div key={index} className="my-8">
            <Image
              src={block.src || ''}
              alt={block.alt || ''}
              width={800}
              height={600}
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        );

      case 'table':
        const headers = block.headers || [];
        const rows = block.rows || [];
        return (
          <div key={index} className="my-8 overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
              {headers.length > 0 && (
                <thead>
                  <tr>
                    {headers.map((header, i) => (
                      <th
                        key={i}
                        className="p-4 text-left bg-white dark:bg-gray-900 font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800"
                      >
                        {parseMarkdown(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="p-4 text-left border-b border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        {parseMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {content.title}
          </h1>
        </div>
        {content.description && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {content.description}
          </p>
        )}
      </div>

      {/* Content Blocks */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {content.blocks.map((block, index) => renderBlock(block, index))}
      </div>
    </div>
  );
}

