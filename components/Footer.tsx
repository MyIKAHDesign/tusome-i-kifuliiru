'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { BookOpen, Info, Mail, ExternalLink } from 'lucide-react';
import ThemeSwitch from './ThemeSwitch';

interface MetaItem {
  title?: string;
  type?: 'page' | 'menu';
  href?: string;
  newWindow?: boolean;
  items?: Record<string, MetaItem>;
}

interface FooterSection {
  title: string;
  links: Array<{ title: string; href: string; external?: boolean }>;
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

  const getItemHref = (item: MetaItem | string | undefined, defaultKey: string): string => {
    if (typeof item === 'object' && item?.href) return item.href;
    return `/${defaultKey}`;
  };

  const getItemTitle = (item: MetaItem | string | undefined, defaultTitle: string): string => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item?.title) return item.title;
    return defaultTitle;
  };

  // Build footer sections
  const buildFooterSections = (): FooterSection[] => {
    const sections: FooterSection[] = [
      {
        title: 'Learning',
        links: [
          { title: 'Ikaya', href: '/' },
          { title: getItemTitle(navMeta.ndondeero_tusome, 'Menya Bino'), href: '/ndondeero_tusome' },
          { title: getItemTitle(navMeta.amagambo, 'Tusome Amagambo'), href: '/amagambo' },
          { title: getItemTitle(navMeta.ukuharura, 'Ukuharura'), href: '/ukuharura' },
          { title: getItemTitle(navMeta.imigani, 'Imigani'), href: '/imigani' },
          { title: getItemTitle(navMeta.imigeeza, 'Imigeeza'), href: '/imigeeza' },
          { title: getItemTitle(navMeta.imwitu, 'Imwitu'), href: '/imwitu' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { title: getItemTitle(navMeta.kifuliiru, 'Kifuliiru'), href: '/kifuliiru' },
          { title: getItemTitle(navMeta['bingi-ku-kifuliiru'], 'Bingi ku Kifuliiru'), href: '/bingi-ku-kifuliiru' },
          { title: getItemTitle(navMeta['eng-frn-swa'], 'ENG/SWA/FRN'), href: '/eng-frn-swa' },
        ],
      },
      {
        title: 'About',
        links: [
          { title: getItemTitle(navMeta.twehe, 'Twehe'), href: '/twehe' },
          { 
            title: 'Contact Us', 
            href: 'https://www.kifuliiru.com/contact',
            external: true 
          },
        ],
      },
      {
        title: 'Links',
        links: [
          { 
            title: 'Our Other Platforms', 
            href: '/our-platforms',
            external: false 
          },
          { 
            title: 'Kifuliiru Lab', 
            href: 'https://kifuliiru.org',
            external: true 
          },
          { 
            title: 'Kifuliiru.com', 
            href: 'https://www.kifuliiru.com',
            external: true 
          },
          { 
            title: 'Kifuliiru Dictionary', 
            href: 'https://dictionary.kifuliiru.net/',
            external: true 
          },
          { 
            title: 'imyazi.com', 
            href: 'https://imyazi.com',
            external: true 
          },
          { 
            title: 'Kifuliiru Books', 
            href: 'https://www.kifuliiru.com/books',
            external: true 
          },
          { 
            title: 'Kifuliiru Bookstore', 
            href: 'https://www.kifuliiru.com/bookstore',
            external: true 
          },
          { 
            title: 'Kifuliiru Audio', 
            href: 'https://www.kifuliiru.com/audio',
            external: true 
          },
        ],
      },
    ];

    return sections;
  };

  const footerSections = buildFooterSections();

  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:backdrop-blur-xl mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Footer Menu Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  const isActive = !link.external && (
                    pathname === link.href || pathname?.startsWith(`${link.href}/`)
                  );

                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className={`flex items-center gap-1.5 text-sm transition-colors ${
                          isActive
                            ? 'text-gray-900 dark:text-gray-50 font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50'
                        }`}
                      >
                        <span>{link.title}</span>
                        {link.external && (
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-white/10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>
                {new Date().getFullYear()} ©{' '}
                <a
                  href="https://kifuliiru.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-gray-50 transition-colors"
                >
                  Kifuliiru Lab
                </a>
              </span>
            </div>

            {/* Theme Switch */}
            <div className="flex items-center gap-2">
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
