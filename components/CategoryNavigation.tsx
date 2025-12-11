'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryNavigationProps {
  currentPath?: string;
}

interface NavItem {
  title?: string;
  type?: 'page' | 'menu';
  href?: string;
  items?: Record<string, NavItem | string>;
}

interface CategoryPage {
  href: string;
  title: string;
}

export default function CategoryNavigation({ currentPath }: CategoryNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [meta, setMeta] = useState<Record<string, NavItem | string>>({});
  const [prevPage, setPrevPage] = useState<CategoryPage | null>(null);
  const [nextPage, setNextPage] = useState<CategoryPage | null>(null);
  const [categoryTitle, setCategoryTitle] = useState<string>('');

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const response = await fetch('/api/meta');
        if (response.ok) {
          const parsed = await response.json();
          setMeta(parsed);
          calculateNavigation(parsed);
        }
      } catch (error) {
        console.error('Error loading meta:', error);
      }
    };
    loadMeta();
  }, [pathname]);

  const calculateNavigation = (metaData: Record<string, NavItem | string>) => {
    const current = currentPath || pathname || '';
    const currentPathClean = current.replace(/^\//, '').replace(/\/$/, '');

    // Find which category this page belongs to
    let categoryKey = '';
    let categoryPages: CategoryPage[] = [];
    let foundCategoryTitle = '';

    // Check each category in meta
    Object.entries(metaData).forEach(([key, item]) => {
      if (typeof item === 'object' && item.type === 'menu' && item.items) {
        const pages: CategoryPage[] = [];
        
        Object.entries(item.items).forEach(([subKey, subItem]) => {
          let href: string;
          let title: string;

          if (typeof subItem === 'string') {
            // String items - construct href based on category
            if (key === 'ukuharura') {
              href = `/ukuharura/${subKey}`;
            } else if (key === 'amagambo') {
              href = `/amagambo/${subKey}`;
            } else if (key === 'eng-frn-swa') {
              href = `/eng-frn-swa/${subKey}`;
            } else {
              href = `/${key}/${subKey}`;
            }
            title = subItem;
          } else {
            // Object items - use explicit href if provided
            if (subItem.href) {
              href = subItem.href;
            } else if (key === 'ukuharura') {
              href = `/ukuharura/${subKey}`;
            } else if (key === 'amagambo') {
              href = `/amagambo/${subKey}`;
            } else if (key === 'eng-frn-swa') {
              href = `/eng-frn-swa/${subKey}`;
            } else {
              href = `/${key}/${subKey}`;
            }
            title = subItem.title || subKey;
          }

          pages.push({ href, title });
        });

        // Check if current path matches any page in this category
        const matches = pages.some(page => {
          const pagePathClean = page.href.replace(/^\//, '').replace(/\/$/, '');
          return currentPathClean === pagePathClean || currentPathClean.startsWith(pagePathClean + '/');
        });

        if (matches && pages.length > 0) {
          categoryKey = key;
          categoryPages = pages;
          foundCategoryTitle = typeof item === 'object' ? (item.title || key) : key;
        }
      }
    });

    // Also check for nested categories (like kuharura-ibiindu)
    if (!categoryKey) {
      Object.entries(metaData).forEach(([key, item]) => {
        if (typeof item === 'object' && item.type === 'menu' && item.items) {
          Object.entries(item.items).forEach(([subKey, subItem]) => {
            if (typeof subItem === 'object' && subItem.type === 'menu' && subItem.items) {
              const pages: CategoryPage[] = [];
              
              Object.entries(subItem.items).forEach(([nestedKey, nestedItem]) => {
                let href: string;
                let title: string;

                if (typeof nestedItem === 'string') {
                  href = `/${key}/${subKey}/${nestedKey}`;
                  title = nestedItem;
                } else {
                  href = nestedItem.href || `/${key}/${subKey}/${nestedKey}`;
                  title = nestedItem.title || nestedKey;
                }

                pages.push({ href, title });
              });

              const matches = pages.some(page => {
                const pagePathClean = page.href.replace(/^\//, '').replace(/\/$/, '');
                return currentPathClean === pagePathClean || currentPathClean.startsWith(pagePathClean + '/');
              });

              if (matches && pages.length > 0) {
                categoryKey = `${key}-${subKey}`;
                categoryPages = pages;
                foundCategoryTitle = typeof subItem === 'object' ? (subItem.title || subKey) : subKey;
              }
            }
          });
        }
      });
    }

    // Handle special case: kuharura-ibiindu items (like /ukuharura/abandu)
    if (!categoryKey && currentPathClean.startsWith('ukuharura/')) {
      const kuharuraIbiindu = metaData['kuharura-ibiindu'];
      if (typeof kuharuraIbiindu === 'object' && kuharuraIbiindu.type === 'menu' && kuharuraIbiindu.items) {
        const pages: CategoryPage[] = [];
        
        Object.entries(kuharuraIbiindu.items).forEach(([subKey, subItem]) => {
          if (typeof subItem === 'object') {
            const href = subItem.href || `/ukuharura/${subKey}`;
            const title = subItem.title || subKey;
            pages.push({ href, title });
          }
        });

        const matches = pages.some(page => {
          const pagePathClean = page.href.replace(/^\//, '').replace(/\/$/, '');
          return currentPathClean === pagePathClean || currentPathClean.startsWith(pagePathClean + '/');
        });

        if (matches && pages.length > 0) {
          categoryKey = 'kuharura-ibiindu';
          categoryPages = pages;
          foundCategoryTitle = typeof kuharuraIbiindu === 'object' ? (kuharuraIbiindu.title || 'kuharura-ibiindu') : 'kuharura-ibiindu';
        }
      }
    }

    if (categoryPages.length > 0) {
      setCategoryTitle(foundCategoryTitle);
      
      // Find current page index
      const currentIndex = categoryPages.findIndex(page => {
        const pagePathClean = page.href.replace(/^\//, '').replace(/\/$/, '');
        return currentPathClean === pagePathClean || currentPathClean.startsWith(pagePathClean + '/');
      });

      if (currentIndex >= 0) {
        setPrevPage(currentIndex > 0 ? categoryPages[currentIndex - 1] : null);
        setNextPage(currentIndex < categoryPages.length - 1 ? categoryPages[currentIndex + 1] : null);
      } else {
        setPrevPage(null);
        setNextPage(null);
      }
    } else {
      setPrevPage(null);
      setNextPage(null);
      setCategoryTitle('');
    }
  };

  if (!prevPage && !nextPage) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
      <div className="flex items-center justify-between gap-4">
        {/* Previous Button */}
        {prevPage ? (
          <a
            href={prevPage.href}
            onClick={(e) => {
              e.preventDefault();
              router.push(prevPage.href);
            }}
            className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-white dark:bg-white/10 dark:backdrop-blur-md border border-gray-200 dark:border-white/20 hover:border-primary-300 dark:hover:border-primary-400/50 hover:shadow-lg transition-all flex-1 max-w-[48%]"
          >
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 dark:backdrop-blur-sm group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Previous
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {prevPage.title}
              </span>
            </div>
          </a>
        ) : (
          <div className="flex-1 max-w-[48%]" />
        )}

        {/* Category Title (centered) */}
        {categoryTitle && (
          <div className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/10 dark:backdrop-blur-sm border border-gray-200 dark:border-white/20">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {categoryTitle}
            </span>
          </div>
        )}

        {/* Next Button */}
        {nextPage ? (
          <a
            href={nextPage.href}
            onClick={(e) => {
              e.preventDefault();
              router.push(nextPage.href);
            }}
            className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-white dark:bg-white/10 dark:backdrop-blur-md border border-gray-200 dark:border-white/20 hover:border-primary-300 dark:hover:border-primary-400/50 hover:shadow-lg transition-all flex-1 max-w-[48%] text-right"
          >
            <div className="flex flex-col min-w-0 flex-1 items-end">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Next
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {nextPage.title}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 dark:backdrop-blur-sm group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
            </div>
          </a>
        ) : (
          <div className="flex-1 max-w-[48%]" />
        )}
      </div>
    </div>
  );
}

