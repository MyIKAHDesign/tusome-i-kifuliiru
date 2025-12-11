'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { VocabularyContent } from '../../lib/content-schema';
import { BookOpen, Globe } from 'lucide-react';
import Search from '../Search';

// Parse markdown formatting (bold, italic, links) and convert to React elements
const parseMarkdown = (text: string): React.ReactNode[] => {
  if (typeof text !== 'string') return [text];
  
  let key = 0;
  
  // Helper function to parse a text segment recursively
  const parseSegment = (segment: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    
    // Parse bold+italic: ***text*** or _**text**_
    const boldItalicRegex = /(\*\*\*|_\*\*)([^*_]+?)(\*\*\*|\*\*_)/g;
    let match: RegExpExecArray | null;
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
        match!.index >= m.start && match!.index + match![0].length <= m.end
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
        match!.index >= m.start && match!.index + match![0].length <= m.end
      ) || boldMatches.some(m => 
        match!.index >= m.start && match!.index + match![0].length <= m.end
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
              className="text-gray-700 dark:text-gray-300 font-medium no-underline transition-colors border-b border-gray-300 dark:border-white/20 pb-0.5 hover:text-gray-900 dark:hover:text-gray-50 hover:border-gray-500 dark:hover:border-white/40"
            >
              {parseSegment(linkMatch.text)}
            </a>
          );
        } else {
          parts.push(
            <Link
              key={key++}
              href={normalizedUrl}
              className="text-gray-700 dark:text-gray-300 font-medium no-underline transition-colors border-b border-gray-300 dark:border-white/20 pb-0.5 hover:text-gray-900 dark:hover:text-gray-50 hover:border-gray-500 dark:hover:border-white/40"
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

interface VocabularyProps {
  content: VocabularyContent;
}

export default function Vocabulary({ content }: VocabularyProps) {
  const headerIconRef = React.useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = Array.from(
    new Set(content.words.map(w => w.category).filter(Boolean))
  ) as string[];

  const filteredWords = content.words.filter(word => {
    const matchesSearch = 
      word.kifuliiru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.english?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.french?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.swahili?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || word.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header - Sticky when scrolled */}
      <div className={`transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'sticky top-20 z-40 bg-gradient-to-r from-white via-white to-gray-50/50 dark:from-white/10 dark:via-white/10 dark:to-white/5 dark:backdrop-blur-xl py-3 -mx-6 px-6 mb-4 rounded-2xl shadow-lg border border-gray-200/50 dark:border-white/20' 
          : 'pb-8 mb-10 border-b border-gray-200 dark:border-white/10'
      }`}>
        <div className={`flex items-center gap-4 transition-all duration-300 ease-in-out ${isScrolled ? 'mb-0' : 'mb-4'}`}>
          {/* Title Column */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={`rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 transition-all duration-300 ease-in-out ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'}`}>
              <BookOpen className={`text-primary-600 dark:text-primary-400 transition-all duration-300 ease-in-out ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </div>
            <h1 className={`font-bold text-gray-900 dark:text-gray-100 transition-all duration-300 ease-in-out truncate ${isScrolled ? 'text-2xl' : 'text-4xl'}`}>
              {content.title}
            </h1>
          </div>
          {/* Search Column - rendered by Search component when scrolled down */}
          <div className={`flex-shrink-0 transition-all duration-300 ease-in-out ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} ref={headerIconRef} />
        </div>
        {content.description && (
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            {parseMarkdown(content.description)}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Search
            variant="inline"
            placeholder="Looza amagambo..."
            value={searchTerm}
            onSearch={(query) => setSearchTerm(query)}
            showResults={false}
            className="w-full"
            iconPosition="header"
            headerIconSlot={headerIconRef}
          />
        </div>
        {categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 dark:backdrop-blur-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 shadow-sm dark:shadow-white/5 transition-all"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((word, index) => (
          <div
            key={index}
            className="group p-5 rounded-lg border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 dark:backdrop-blur-md hover:border-primary-300 dark:hover:border-primary-400/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {word.kifuliiru}
              </h3>
              {word.category && (
                <span className="text-xs px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400">
                  {word.category}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              {word.english && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>EN:</strong> {word.english}
                  </span>
                </div>
              )}
              {word.french && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>FR:</strong> {word.french}
                  </span>
                </div>
              )}
              {word.swahili && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>SW:</strong> {word.swahili}
                  </span>
                </div>
              )}
              {word.pronunciation && (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  [{word.pronunciation}]
                </p>
              )}
              {word.example && (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-2 border-l-2 border-gray-300 dark:border-white/20 pl-3">
                  "{parseMarkdown(word.example)}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Ndabyo twaloonga</p>
        </div>
      )}
    </div>
  );
}

