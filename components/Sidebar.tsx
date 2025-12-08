import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Home, Book, Folder, ChevronRight, ExternalLink, FileText, Menu } from 'lucide-react';

interface MetaItem {
  title?: string;
  type?: 'page' | 'menu';
  href?: string;
  newWindow?: boolean;
  items?: Record<string, MetaItem>;
}

interface SidebarProps {
  meta?: Record<string, MetaItem | string>;
}

const defaultMeta: Record<string, MetaItem | string> = {};

export default function Sidebar({ meta }: SidebarProps) {
  const router = useRouter();
  const [sidebarMeta, setSidebarMeta] = useState<Record<string, MetaItem | string>>(defaultMeta);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const response = await fetch('/api/meta');
        if (response.ok) {
          const parsed = await response.json();
          setSidebarMeta(parsed);
          const currentPath = router.asPath.split('?')[0];
          const groups = Object.keys(parsed).filter(key => {
            const item = parsed[key];
            return typeof item === 'object' && item.type === 'menu' && item.items;
          });
          const activeGroups = groups.filter(key => {
            const item = parsed[key] as MetaItem;
            return currentPath.startsWith(`/${key}`);
          });
          setExpandedGroups(new Set(activeGroups));
        } else if (meta) {
          setSidebarMeta(meta);
        }
      } catch (error) {
        console.error('Error loading meta.json:', error);
        if (meta) {
          setSidebarMeta(meta);
        }
      }
    };

    loadMeta();
  }, [meta, router.asPath]);

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

  const getIcon = (key: string, level: number) => {
    if (level === 0 && key === 'index') {
      return <Home className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const renderMenuItem = (key: string, item: MetaItem | string, level: number = 0): React.ReactNode => {
    if (typeof item === 'string') {
      const href = key === 'index' ? '/' : `/${key}`;
      const currentPath = router.asPath.split('?')[0];
      const isActive = currentPath === href || currentPath === `/${key}`;
      return (
        <li key={key}>
          <a
            href={href}
            className={`
              flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all
              ${isActive
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold border-l-3 border-primary-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
              }
            `}
            style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
          >
            {getIcon(key, level)}
            <span>{item}</span>
          </a>
        </li>
      );
    }

    const { title, type, href, newWindow, items } = item;
    const displayTitle = title || key;

    if (type === 'menu' && items) {
      const currentPath = router.asPath.split('?')[0];
      const isMenuActive = currentPath.startsWith(`/${key}`);
      const isExpanded = expandedGroups.has(key);
      
      return (
        <li key={key} className="mb-2">
          <button
            onClick={() => toggleGroup(key)}
            className={`
              w-full flex items-center justify-between gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all
              ${isMenuActive
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              <span>{displayTitle}</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
          {isExpanded && (
            <ul className="mt-1 ml-6 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
              {Object.entries(items).map(([subKey, subItem]) =>
                renderMenuItem(subKey, subItem, level + 1)
              )}
            </ul>
          )}
        </li>
      );
    }

    const linkHref = href || `/${key === 'index' ? '' : key}`;
    const currentPath = router.asPath.split('?')[0];
    const isActive = currentPath === linkHref || currentPath === `/${key}`;

    return (
      <li key={key}>
        <a
          href={linkHref}
          target={newWindow ? '_blank' : undefined}
          rel={newWindow ? 'noopener noreferrer' : undefined}
          className={`
            flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all
            ${isActive
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold border-l-3 border-primary-600'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
            }
          `}
        >
          <Book className="w-4 h-4" />
          <span>{displayTitle}</span>
          {newWindow && <ExternalLink className="w-3 h-3 ml-auto opacity-40" />}
        </a>
      </li>
    );
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-72 min-h-[calc(100vh-5rem)] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800
          border-r border-gray-200 dark:border-gray-800
          sticky top-20 self-start overflow-y-auto
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:static z-40
          shadow-xl lg:shadow-none
        `}
      >
        <div className="p-6">
          <nav>
            <ul className="space-y-1">
              {Object.entries(sidebarMeta).map(([key, item]) =>
                renderMenuItem(key, item)
              )}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
