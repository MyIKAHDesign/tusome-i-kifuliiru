import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { NumberLessonContent } from '../../lib/content-schema';
import { Calculator, Hash, Search as SearchIcon } from 'lucide-react';

// Parse markdown formatting (bold, italic, links) and convert to React elements
const parseMarkdown = (text: string): React.ReactNode[] => {
  if (typeof text !== 'string') return [text];
  
  let key = 0;
  
  // Helper function to parse a text segment recursively
  const parseSegment = (segment: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    
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
    // Use a simpler approach: match single * or _ that aren't part of ** or __
    const italicRegex = /(?:^|[^*])\*([^*]+?)\*(?![*])|(?:^|[^_])_([^_]+?)_(?![_])/g;
    const italicMatches: Array<{start: number, end: number, text: string}> = [];
    
    while ((match = italicRegex.exec(segment)) !== null) {
      const matchText = match[1] || match[2];
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
      if (match.start > currentIndex) {
        const beforeText = segment.substring(currentIndex, match.start);
        if (beforeText) parts.push(beforeText);
      }
      
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
    
    if (currentIndex < segment.length) {
      parts.push(segment.substring(currentIndex));
    }
    
    return parts;
  };
  
  return parseSegment(text);
};

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

// Parse number translation list (e.g., "17.980 = Bihumbi ikumi...")
const parseNumberTranslationList = (text: string): Array<{ number: string; translation: string }> | null => {
  const lines = text.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length === 0) return null;
  
  // Check if it looks like number translations (contains "=" pattern)
  const pattern = /^(\d+(?:\.\d+)?)\s*=\s*(.+)$/;
  const translations: Array<{ number: string; translation: string }> = [];
  
  for (const line of lines) {
    const match = line.match(pattern);
    if (match) {
      translations.push({
        number: match[1],
        translation: match[2].trim(),
      });
    } else {
      // If we find a line that doesn't match, it's not a number translation list
      if (translations.length > 0 && translations.length < lines.length * 0.8) {
        return null; // Not enough matches to be a translation list
      }
    }
  }
  
  return translations.length > 0 ? translations : null;
};

// Render content that may contain tables or number translation lists
const renderContentWithTables = (text: string): React.ReactNode => {
  // Try to parse as table first
  const tableData = parseMarkdownTable(text);
  if (tableData) {
    return (
      <div className="my-8 overflow-x-auto">
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
  
  // Try to parse as number translation list
  const translationList = parseNumberTranslationList(text);
  if (translationList && translationList.length > 0) {
    return (
      <div className="my-8">
        <div className="space-y-3">
          {translationList.map((item, index) => (
            <div
              key={index}
              className="flex items-baseline gap-4 py-2"
            >
              <span className="font-mono text-base font-semibold text-gray-900 dark:text-gray-100 min-w-[90px] flex-shrink-0">
                {item.number}
              </span>
              <span className="text-gray-700 dark:text-gray-300 flex-1 leading-relaxed">
                {parseMarkdown(item.translation)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Otherwise render as regular markdown
  return <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{parseMarkdown(text)}</p>;
};

interface NumberLessonProps {
  content: NumberLessonContent;
}

export default function NumberLesson({ content }: NumberLessonProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter numbers based on search term
  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) {
      return content.sections;
    }

    const lowerSearch = searchTerm.toLowerCase();
    return content.sections.map(section => ({
      ...section,
      numbers: section.numbers.filter(number => {
        const valueStr = number.value.toString();
        const kifuliiruLower = number.kifuliiru.toLowerCase();
        return valueStr.includes(lowerSearch) || kifuliiruLower.includes(lowerSearch);
      }),
    })).filter(section => section.numbers.length > 0);
  }, [content.sections, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {content.title}
            </h1>
            {content.range && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                {content.range}
              </p>
            )}
          </div>
        </div>
        {content.description && (
          <div>
            {renderContentWithTables(content.description)}
          </div>
        )}
      </div>

      {/* Search Bar - Only show if there are sections to search */}
      {content.sections.length > 0 && (
        <div className="sticky top-20 z-40 pb-6 -mx-6 px-6 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Looza hano... (Search by number or Kifuliiru text)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 text-base bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-500/20 transition-all shadow-sm hover:shadow-md"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {searchTerm && (
            <div className="mt-3 text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {filteredSections.reduce((total, section) => total + section.numbers.length, 0)} result{filteredSections.reduce((total, section) => total + section.numbers.length, 0) !== 1 ? 's' : ''} found
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sections */}
      {filteredSections.length > 0 ? (
        filteredSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          {section.title && section.title.toLowerCase() !== 'numbers' && (
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {section.title}
              </h2>
              {section.range && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({section.range})
                </span>
              )}
            </div>
          )}

          {/* Numbers Grid - Wider display with more cards per row for ukuharura pages */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {section.numbers.map((number, index) => (
              <div
                key={index}
                className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {number.value.toLocaleString()}
                  </span>
                  {number.pronunciation && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                      {number.pronunciation}
                    </span>
                  )}
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {number.kifuliiru}
                </div>
                {number.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                    {parseMarkdown(number.notes)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))
      ) : content.sections.length > 0 && searchTerm ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No results found for "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 text-primary-600 dark:text-primary-400 hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : null}

      {/* Table section - displayed after numbers */}
      {content.table && (
        <div className="mt-12">
          {renderContentWithTables(content.table)}
        </div>
      )}
    </div>
  );
}

