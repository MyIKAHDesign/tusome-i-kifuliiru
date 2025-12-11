'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Search as SearchIcon, 
  FileText, 
  Calculator,
  Sparkles,
  ChevronRight,
  Loader2,
  Home,
  Folder
} from 'lucide-react';

interface MetaItem {
  title?: string;
  type?: 'page' | 'menu';
  href?: string;
  newWindow?: boolean;
  items?: Record<string, MetaItem | string>;
}

interface LearningItem {
  key: string;
  title: string;
  href: string;
  type: 'page' | 'menu';
  items?: LearningItem[];
  icon?: React.ReactNode;
}

export default function TusomePage() {
  const router = useRouter();
  const [meta, setMeta] = useState<Record<string, MetaItem | string>>({});
  const [learningItems, setLearningItems] = useState<LearningItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LearningItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const response = await fetch('/api/meta');
        if (response.ok) {
          const parsed = await response.json();
          setMeta(parsed);
          const items = buildLearningItems(parsed);
          setLearningItems(items);
          // Auto-expand all groups by default
          setExpandedGroups(new Set(items.map(item => item.key)));
        }
      } catch (error) {
        console.error('Error loading meta:', error);
      }
    };
    loadMeta();
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const results = searchLearningItems(learningItems, searchQuery.toLowerCase());
    setSearchResults(results);
    setIsSearching(false);
  }, [searchQuery, learningItems]);

  const isHeaderNavItem = (key: string): boolean => {
    return ['kifuliiru', 'imigani', 'imigeeza', 'imwitu', 'bingi-ku-kifuliiru', 'twehe', 'contact', 'eng-frn-swa'].includes(key);
  };

  const getIcon = (key: string) => {
    switch (key) {
      case 'ukuharura':
      case 'kuharura-ibiindu':
        return <Calculator className="w-5 h-5" />;
      case 'amagambo':
        return <Sparkles className="w-5 h-5" />;
      case 'ndondeero_tusome':
        return <BookOpen className="w-5 h-5" />;
      case 'muyegerere':
        return <Home className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const buildLearningItems = (metaData: Record<string, MetaItem | string>): LearningItem[] => {
    const items: LearningItem[] = [];

    Object.entries(metaData).forEach(([key, item]) => {
      // Skip header navigation items
      if (isHeaderNavItem(key)) {
        return;
      }

      if (typeof item === 'string') {
        const href = key === 'index' || key === 'muyegerere' ? '/' : `/${key}`;
        items.push({
          key,
          title: item,
          href,
          type: 'page',
          icon: getIcon(key),
        });
      } else {
        const { title, type, href, items: subItems } = item;
        const displayTitle = title || key;
        const itemHref = href || (key === 'index' || key === 'muyegerere' ? '/' : `/${key}`);

        if (type === 'menu' && subItems) {
          const children: LearningItem[] = [];
          Object.entries(subItems).forEach(([subKey, subItem]) => {
            if (typeof subItem === 'string') {
              const subHref = `/${key}/${subKey}`;
              children.push({
                key: `${key}-${subKey}`,
                title: subItem,
                href: subHref,
                type: 'page',
              });
            } else {
              const subTitle = subItem.title || subKey;
              const subHref = subItem.href || `/${key}/${subKey}`;
              children.push({
                key: `${key}-${subKey}`,
                title: subTitle,
                href: subHref,
                type: subItem.type || 'page',
                items: subItem.items ? Object.entries(subItem.items).map(([nestedKey, nestedItem]) => ({
                  key: `${key}-${subKey}-${nestedKey}`,
                  title: typeof nestedItem === 'string' ? nestedItem : (nestedItem.title || nestedKey),
                  href: typeof nestedItem === 'object' && nestedItem.href ? nestedItem.href : `/${key}/${subKey}/${nestedKey}`,
                  type: typeof nestedItem === 'object' && nestedItem.type ? nestedItem.type : 'page',
                })) : undefined,
              });
            }
          });

          items.push({
            key,
            title: displayTitle,
            href: itemHref,
            type: 'menu',
            items: children,
            icon: getIcon(key),
          });
        } else {
          items.push({
            key,
            title: displayTitle,
            href: itemHref,
            type: type || 'page',
            icon: getIcon(key),
          });
        }
      }
    });

    return items;
  };

  const searchLearningItems = (items: LearningItem[], query: string): LearningItem[] => {
    const results: LearningItem[] = [];

    const searchInItem = (item: LearningItem) => {
      const titleMatch = item.title.toLowerCase().includes(query);
      
      if (titleMatch && item.type === 'page') {
        results.push(item);
      }

      if (item.items) {
        item.items.forEach(searchInItem);
      }
    };

    items.forEach(searchInItem);
    return results;
  };

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const renderLearningItem = (item: LearningItem, level: number = 0) => {
    const isExpanded = expandedGroups.has(item.key);
    const hasChildren = item.items && item.items.length > 0;

    if (item.type === 'menu' && hasChildren) {
      return (
        <div key={item.key} className="mb-2">
          <button
            onClick={() => toggleGroup(item.key)}
            className={`
              w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all
              hover:bg-gray-100 dark:hover:bg-gray-900
              ${level === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className={`font-medium text-gray-900 dark:text-gray-100 ${level === 0 ? 'text-base' : 'text-sm'}`}>
                {item.title}
              </span>
            </div>
            <ChevronRight 
              className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
            />
          </button>
          {isExpanded && (
            <div className={`mt-2 ${level === 0 ? 'ml-0' : 'ml-4'} border-l-2 border-gray-200 dark:border-gray-800 pl-4`}>
              {item.items?.map(child => renderLearningItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <a
        key={item.key}
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          router.push(item.href);
        }}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg transition-all
          hover:bg-gray-100 dark:hover:bg-gray-900
          ${level === 0 ? 'bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800' : ''}
        `}
      >
        {item.icon || <FileText className="w-4 h-4 text-gray-400" />}
        <span className={`text-gray-700 dark:text-gray-300 ${level === 0 ? 'font-medium' : ''}`}>
          {item.title}
        </span>
      </a>
    );
  };

  const displayItems = searchQuery.length >= 2 ? searchResults : learningItems;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              Tusome
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Bona ibintu byose byo kwiga
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Looza hano..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-3">
        {displayItems.length > 0 ? (
          displayItems.map(item => renderLearningItem(item))
        ) : searchQuery.length >= 2 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Ndabyo twaloonga</p>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin opacity-50" />
            <p>Tugweeti tugalooza...</p>
          </div>
        )}
      </div>
    </div>
  );
}

