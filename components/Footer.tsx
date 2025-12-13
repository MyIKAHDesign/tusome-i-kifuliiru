'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Info } from 'lucide-react';
import ThemeSwitch from './ThemeSwitch';

interface MetaItem {
  title?: string;
  type?: 'page' | 'menu';
  href?: string;
  newWindow?: boolean;
  items?: Record<string, MetaItem>;
}

export default function Footer() {
  const pathname = usePathname();
  const [navMeta, setNavMeta] = useState<Record<string, MetaItem | string>>({});

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const response = await fetch('/api/meta');
        if (response.ok) {
          const parsed = await response.json();
          setNavMeta(parsed);
        }
      } catch (error) {
        console.error('Error loading meta.json:', error);
      }
    };
    loadMeta();
  }, []);

  // Build navigation items for footer
  const buildFooterNav = (): Record<string, { title: string; href: string }> => {
    const getItemHref = (item: MetaItem | string | undefined, defaultKey: string): string => {
      if (typeof item === 'object' && item?.href) return item.href;
      return `/${defaultKey}`;
    };

    const getItemTitle = (item: MetaItem | string | undefined, defaultTitle: string): string => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item?.title) return item.title;
      return defaultTitle;
    };

    return {
      home: { title: 'Home', href: '/' },
      tusome: { title: 'Tusome', href: '/tusome' },
      kifuliiru: { 
        title: getItemTitle(navMeta.kifuliiru, 'Kifuliiru'), 
        href: getItemHref(navMeta.kifuliiru, 'kifuliiru') 
      },
      imwitu: { 
        title: getItemTitle(navMeta.imwitu, 'Imwitu'), 
        href: getItemHref(navMeta.imwitu, 'imwitu') 
      },
      twehe: { 
        title: getItemTitle(navMeta.twehe, 'Twehe'), 
        href: getItemHref(navMeta.twehe, 'twehe') 
      },
    };
  };

  const footerNavItems = buildFooterNav();

  const getIcon = (key: string) => {
    switch (key) {
      case 'home':
        return <Home className="w-4 h-4" />;
      case 'tusome':
        return <BookOpen className="w-4 h-4" />;
      case 'kifuliiru':
      case 'imwitu':
        return <BookOpen className="w-4 h-4" />;
      case 'twehe':
        return <Info className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:backdrop-blur-xl mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Navigation Menu - Bottom */}
        <nav className="mb-6">
          <ul className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-sm">
            {Object.entries(footerNavItems).map(([key, item]) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <li key={key}>
                  <a
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'text-gray-900 dark:text-gray-50 font-medium bg-gray-100 dark:bg-white/10'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {getIcon(key)}
                    <span>{item.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Copyright and Theme Switch - Same Row */}
        <div className="flex flex-row items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>{new Date().getFullYear()} ©</span>
          <a
            href="https://kifuliiru.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-gray-50 transition-colors"
          >
            Kifuliiru Lab
          </a>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <ThemeSwitch />
        </div>
      </div>
    </footer>
  );
}
