import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronDown, ExternalLink, Globe, BookOpen, Heart, Info, Languages } from 'lucide-react';

interface NavItem {
  title?: string;
  type?: 'page' | 'menu' | 'link';
  href?: string;
  newWindow?: boolean;
  items?: Record<string, NavItem | string>;
}

interface HeaderNavigationProps {
  items: Record<string, NavItem | string>;
}

export default function HeaderNavigation({ items }: HeaderNavigationProps) {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      });
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  // Extract navigation items (excluding documentation items)
  const navItems: Record<string, NavItem | string> = {};
  
  Object.entries(items).forEach(([key, value]) => {
    if (['kifuliiru', 'imigani', 'imigeeza', 'imwitu', 'bingi-ku-kifuliiru', 'twehe', 'contact', 'eng-frn-swa'].includes(key)) {
      navItems[key] = value;
    }
  });

  const getIcon = (key: string) => {
    switch (key) {
      case 'kifuliiru':
        return <BookOpen className="w-4 h-4" />;
      case 'imigani':
        return <Heart className="w-4 h-4" />;
      case 'imigeeza':
        return <Heart className="w-4 h-4" />;
      case 'imwitu':
        return <BookOpen className="w-4 h-4" />;
      case 'bingi-ku-kifuliiru':
        return <Info className="w-4 h-4" />;
      case 'twehe':
        return <Info className="w-4 h-4" />;
      case 'eng-frn-swa':
        return <Languages className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // No need for handleItemClick - we handle it in the render functions

  const renderDropdown = (key: string, item: NavItem | string) => {
    if (typeof item === 'string' || !item.items) return null;

    const isOpen = openDropdown === key;
    const itemEntries = Object.entries(item.items);

    return (
      <div
        key={key}
        className="relative"
        ref={(el) => {
          dropdownRefs.current[key] = el;
        }}
      >
        <button
          onClick={() => setOpenDropdown(isOpen ? null : key)}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
            ${
              router.asPath.startsWith(`/${key}`)
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
        >
          {getIcon(key)}
          <span>{item.title}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {itemEntries.map(([subKey, subItem]) => {
              const subTitle = typeof subItem === 'string' ? subItem : subItem.title || subKey;
              const subHref = typeof subItem === 'object' && subItem.href
                ? subItem.href
                : `/${key}/${subKey}`;
              const isExternal = typeof subItem === 'object' && subItem.newWindow;

              return (
                <a
                  key={subKey}
                  href={subHref}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    if (!isExternal) {
                      e.preventDefault();
                      router.push(subHref).then(() => setOpenDropdown(null));
                    } else {
                      setOpenDropdown(null);
                    }
                  }}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm transition-colors
                    ${
                      router.asPath === subHref || router.asPath.startsWith(`/${key}/${subKey}`)
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400'
                    }
                  `}
                >
                  <span className="flex-1">{subTitle}</span>
                  {isExternal && <ExternalLink className="w-4 h-4 opacity-50" />}
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderNavItem = (key: string, item: NavItem | string) => {
    if (typeof item === 'string') {
      const href = `/${key}`;
      const isActive = router.asPath === href || router.asPath.startsWith(`/${key}/`);
      
      return (
        <a
          key={key}
          href={href}
          onClick={(e) => {
            e.preventDefault();
            router.push(href);
          }}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
            ${
              isActive
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
        >
          {getIcon(key)}
          <span>{item}</span>
        </a>
      );
    }

    if (item.type === 'menu' && item.items) {
      return renderDropdown(key, item);
    }

    const href = item.href || `/${key}`;
    const isActive = router.asPath === href || router.asPath.startsWith(`/${key}/`);
    const isExternal = item.newWindow || href.startsWith('http');

    return (
      <a
        key={key}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        onClick={(e) => {
          if (!isExternal) {
            e.preventDefault();
            router.push(href);
          }
        }}
        className={`
          flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
          ${
            isActive
              ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
              : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
      >
        {getIcon(key)}
        <span>{item.title}</span>
        {isExternal && <ExternalLink className="w-3 h-3 ml-1" />}
      </a>
    );
  };

  return (
    <nav className="flex items-center gap-2">
      {Object.entries(navItems).map(([key, item]) => renderNavItem(key, item))}
    </nav>
  );
}

