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

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const response = await fetch('/api/meta');
        if (response.ok) {
          const parsed = await response.json();
          setMeta(parsed);
          const items = buildLearningItems(parsed);
          setLearningItems(items);
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
      
      // Include both pages and menus in search results
      if (titleMatch) {
        results.push(item);
      }

      if (item.items) {
        item.items.forEach(searchInItem);
      }
    };

    items.forEach(searchInItem);
    return results;
  };

  // Flatten items for grid display - extract all pages from menus
  const flattenItems = (items: LearningItem[]): LearningItem[] => {
    const flattened: LearningItem[] = [];
    
    items.forEach(item => {
      if (item.type === 'menu' && item.items && item.items.length > 0) {
        // Add menu item itself as a card
        flattened.push(item);
        // Add all children
        flattened.push(...flattenItems(item.items));
      } else {
        flattened.push(item);
      }
    });
    
    return flattened;
  };

  const getAllPages = (items: LearningItem[]): LearningItem[] => {
    const pages: LearningItem[] = [];
    
    const extractPages = (itemList: LearningItem[]) => {
      itemList.forEach(item => {
        if (item.type === 'page') {
          pages.push(item);
        }
        if (item.items) {
          extractPages(item.items);
        }
      });
    };
    
    extractPages(items);
    return pages;
  };

  const renderCard = (item: LearningItem) => {
    const isMenu = item.type === 'menu' && item.items && item.items.length > 0;
    const itemCount = item.items?.length || 0;

    if (isMenu) {
      // Menu items as section headers with their children as cards
      return (
        <div key={item.key} className="col-span-full mb-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              {item.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {itemCount} {itemCount === 1 ? 'ikintu' : 'ibintu'}
              </p>
            </div>
          </div>
          
          {/* Children Cards Grid */}
          {item.items && item.items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {item.items.map(child => renderCard(child))}
            </div>
          )}
        </div>
      );
    }

    // Regular page card
    return (
      <a
        key={item.key}
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          router.push(item.href);
        }}
        className="group relative bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all duration-200 flex flex-col"
      >
        {/* Icon */}
        <div className="mb-3 p-2.5 rounded-lg bg-gray-100 dark:bg-gray-900 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors w-fit">
          {item.icon || <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />}
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {item.title}
        </h3>
        
        {/* Hover indicator */}
        <div className="mt-auto pt-3 flex items-center text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          <span>Bona</span>
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </a>
    );
  };

  const displayItems = searchQuery.length >= 2 
    ? getAllPages(searchResults) 
    : learningItems;

  return (
    <div className="max-w-7xl mx-auto">
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

      {/* Content Grid */}
      {displayItems.length > 0 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${searchQuery.length >= 2 ? '' : 'auto-rows-max'}`}>
          {displayItems.map(item => renderCard(item))}
        </div>
      ) : searchQuery.length >= 2 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Ndabyo twaloonga</p>
          <p className="text-sm mt-2">Gerageza kwandika ikindi</p>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin opacity-50" />
          <p className="text-lg">Tugweeti tugalooza...</p>
        </div>
      )}
    </div>
  );
}

