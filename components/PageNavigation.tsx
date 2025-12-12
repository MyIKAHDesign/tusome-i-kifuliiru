'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PageNavigationProps {
  currentSlug?: string;
}

interface MetaItem {
  title?: string;
  type?: 'page' | 'menu';
  href?: string;
  newWindow?: boolean;
  items?: Record<string, MetaItem | string>;
}

// Build navigation order dynamically from meta data structure
const buildNavigationOrder = (meta: Record<string, MetaItem | string>): string[] => {
  const order: string[] = [];
  const seenSlugs = new Set<string>();
  
  // Helper to extract slug from href or key
  const getSlugFromHref = (href: string | undefined, key: string, parentKey: string = ''): string => {
    if (href) {
      // Remove leading slash and trailing slash
      const slug = href.replace(/^\//, '').replace(/\/$/, '');
      return slug;
    }
    
    // Construct slug based on parent and key
    if (key === 'index' || key === 'muyegerere') {
      return '';
    }
    
    if (parentKey) {
      // Handle nested paths
      if (parentKey === 'ukuharura') {
        return `ukuharura/${key}`;
      } else if (parentKey === 'amagambo') {
        return `amagambo/${key}`;
      } else if (parentKey === 'imwitu') {
        return `imwitu/${key}`;
      } else if (parentKey === 'bingi-ku-kifuliiru') {
        return `bingi-ku-kifuliiru/${key}`;
      } else if (parentKey === 'twehe') {
        return `twehe/${key}`;
      } else if (parentKey === 'eng-frn-swa') {
        return `eng-frn-swa/${key}`;
      } else if (parentKey === 'kuharura-ibiindu') {
        // Special handling for kuharura-ibiindu section
        if (key === 'harura') {
          return 'harura';
        }
        return `ukuharura/${key}`;
      }
      return `${parentKey}/${key}`;
    }
    
    return key;
  };
  
  // Helper to recursively flatten meta structure
  const flattenMeta = (items: Record<string, MetaItem | string>, parentKey: string = ''): void => {
    Object.entries(items).forEach(([key, item]) => {
      // Skip external links
      if (typeof item === 'object' && item.newWindow) {
        return;
      }
      
      if (typeof item === 'string') {
        // Simple string entry - construct slug
        const slug = getSlugFromHref(undefined, key, parentKey);
        if (slug !== undefined && !seenSlugs.has(slug)) {
          seenSlugs.add(slug);
          order.push(slug);
        }
      } else {
        // Object entry
        const { type, href, items: subItems } = item;
        
        // Get slug for this item
        const itemSlug = getSlugFromHref(href, key, parentKey);
        
        // Add page to order if it's a page type and not already added
        if (type === 'page' && itemSlug !== undefined && !seenSlugs.has(itemSlug)) {
          seenSlugs.add(itemSlug);
          order.push(itemSlug);
        }
        
        // Recursively process sub-items
        if (subItems) {
          // Determine parent key for nested items
          let nextParentKey = parentKey;
          if (type === 'menu') {
            nextParentKey = key;
          }
          flattenMeta(subItems, nextParentKey);
        } else if (type === 'page' && !href && !seenSlugs.has(key)) {
          // Top-level page without href - use key as slug
          const slug = key === 'muyegerere' ? '' : key;
          if (!seenSlugs.has(slug)) {
            seenSlugs.add(slug);
            order.push(slug);
          }
        }
      }
    });
  };
  
  // Process all meta items
  flattenMeta(meta);
  
  // Ensure homepage is first
  if (order[0] !== '') {
    const homeIndex = order.indexOf('');
    if (homeIndex > 0) {
      order.splice(homeIndex, 1);
      order.unshift('');
    } else if (homeIndex === -1) {
      order.unshift('');
    }
  }
  
  // Ensure ndondeero_tusome comes right after homepage (if it exists)
  const ndondeeroIndex = order.indexOf('ndondeero_tusome');
  if (ndondeeroIndex > 0 && order[0] === '') {
    // Remove it from current position
    order.splice(ndondeeroIndex, 1);
    // Insert it right after homepage (at index 1)
    order.splice(1, 0, 'ndondeero_tusome');
  }
  
  // Add standalone pages that might not be in meta but exist
  const standalonePages = ['tusome', 'ibufuliiru', 'ibufuliiru.com'];
  standalonePages.forEach(page => {
    if (!seenSlugs.has(page)) {
      seenSlugs.add(page);
      order.push(page);
    }
  });
  
  return order;
};

// Get page title from meta data or fallback to slug
const getPageTitle = (slug: string, meta: Record<string, MetaItem | string>): string => {
  if (slug === '') return 'Muyegerere';
  
  // Helper to extract slug from href or key (same logic as buildNavigationOrder)
  const getSlugFromItem = (href: string | undefined, key: string, parentKey: string = ''): string => {
    if (href) {
      return href.replace(/^\//, '').replace(/\/$/, '');
    }
    if (key === 'index' || key === 'muyegerere') {
      return '';
    }
    if (parentKey) {
      if (parentKey === 'ukuharura' || parentKey === 'amagambo' || parentKey === 'imwitu' || 
          parentKey === 'bingi-ku-kifuliiru' || parentKey === 'twehe' || parentKey === 'eng-frn-swa') {
        return `${parentKey}/${key}`;
      } else if (parentKey === 'kuharura-ibiindu') {
        if (key === 'harura') {
          return 'harura';
        }
        return `ukuharura/${key}`;
      }
      return `${parentKey}/${key}`;
    }
    return key;
  };
  
  // Helper to find title in meta structure
  const findTitleInMeta = (items: Record<string, MetaItem | string>, targetSlug: string, parentKey: string = ''): string | null => {
    for (const [key, item] of Object.entries(items)) {
      if (typeof item === 'string') {
        const itemSlug = getSlugFromItem(undefined, key, parentKey);
        if (itemSlug === targetSlug) {
          return item;
        }
      } else {
        const { title, href, items: subItems } = item;
        const itemSlug = getSlugFromItem(href, key, parentKey);
        
        if (itemSlug === targetSlug) {
          return title || key;
        }
        
        if (subItems) {
          const nextParentKey = item.type === 'menu' ? key : parentKey;
          const found = findTitleInMeta(subItems, targetSlug, nextParentKey);
          if (found) return found;
        } else if (item.type === 'page' && !href) {
          // Top-level page
          const itemSlug = key === 'muyegerere' ? '' : key;
          if (itemSlug === targetSlug) {
            return title || key;
          }
        }
      }
    }
    return null;
  };
  
  const title = findTitleInMeta(meta, slug);
  if (title) return title;
  
  // Fallback: format slug as title
  if (slug.includes('/')) {
    const lastPart = slug.split('/').pop() || slug;
    return lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function PageNavigation({ currentSlug }: PageNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [meta, setMeta] = useState<Record<string, MetaItem | string>>({});
  const [navigationOrder, setNavigationOrder] = useState<string[]>([]);
  
  useEffect(() => {
    setMounted(true);
    
    // Fetch meta data to build navigation order
    const loadMeta = async () => {
      try {
        const response = await fetch('/api/meta');
        if (response.ok) {
          const metaData = await response.json();
          setMeta(metaData);
          const order = buildNavigationOrder(metaData);
          setNavigationOrder(order);
        }
      } catch (error) {
        console.error('Error loading meta for navigation:', error);
      }
    };
    
    loadMeta();
  }, []);
  
  // Get current slug from pathname if not provided
  const routerSlug = pathname?.replace(/^\//, '').replace(/\/$/, '') || '';
  const slug = currentSlug !== undefined ? currentSlug : routerSlug;
  
  // Normalize current slug (handle both 'index' and '' for homepage)
  const normalizedSlug = slug === 'index' ? '' : slug;
  
  const currentIndex = navigationOrder.findIndex(s => s === normalizedSlug);
  
  const prevSlug = currentIndex > 0 ? navigationOrder[currentIndex - 1] : null;
  const nextSlug = currentIndex < navigationOrder.length - 1 ? navigationOrder[currentIndex + 1] : null;
  
  // Don't render until mounted and meta is loaded
  if (!mounted || navigationOrder.length === 0) {
    return null;
  }
  
  // Don't render if current page is not in navigation order (e.g., 404 pages)
  if (currentIndex === -1) {
    return null;
  }
  
  const getHref = (slug: string): string => {
    if (slug === '') return '/';
    return `/${slug}`;
  };
  
  if (!prevSlug && !nextSlug) {
    return null;
  }
  
  return (
    <>
      {/* Previous Button - Left Side */}
      {prevSlug && (
        <div className="hidden xl:fixed xl:left-4 xl:top-1/2 xl:-translate-y-1/2 xl:z-40">
          <a
            href={getHref(prevSlug)}
            onClick={(e) => {
              e.preventDefault();
              router.push(getHref(prevSlug));
            }}
            className="group flex items-center gap-2 px-4 py-3 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 rounded-lg bg-white dark:bg-white/10 dark:backdrop-blur-xl shadow-lg border border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/30 transition-all hover:shadow-xl"
            title={getPageTitle(prevSlug, meta)}
          >
            <ChevronLeft className="w-4 h-4 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform text-gray-500 dark:text-gray-400" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Previous</span>
              <span className="truncate max-w-[100px] text-sm font-medium">{getPageTitle(prevSlug, meta)}</span>
            </div>
          </a>
        </div>
      )}
      
      {/* Next Button - Right Side */}
      {nextSlug && (
        <div className="hidden xl:fixed xl:right-4 xl:top-1/2 xl:-translate-y-1/2 xl:z-40">
          <a
            href={getHref(nextSlug)}
            onClick={(e) => {
              e.preventDefault();
              router.push(getHref(nextSlug));
            }}
            className="group flex items-center gap-2 px-4 py-3 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 rounded-lg bg-white dark:bg-white/10 dark:backdrop-blur-xl shadow-lg border border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/30 transition-all hover:shadow-xl"
            title={getPageTitle(nextSlug, meta)}
          >
            <div className="flex flex-col min-w-0 text-right">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Next</span>
              <span className="truncate max-w-[100px] text-sm font-medium">{getPageTitle(nextSlug, meta)}</span>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform text-gray-500 dark:text-gray-400" />
          </a>
        </div>
      )}
    </>
  );
}

