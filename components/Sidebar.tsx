'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Book, 
  Folder, 
  ChevronRight, 
  ExternalLink, 
  FileText, 
  Menu,
  Info,
  GraduationCap,
  Calculator,
  BookOpen,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useSidebar } from './SidebarContext';

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
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();
  const [sidebarMeta, setSidebarMeta] = React.useState<Record<string, MetaItem | string>>(defaultMeta);
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const response = await fetch('/api/meta');
        if (response.ok) {
          const parsed = await response.json();
          setSidebarMeta(parsed);
          const currentPath = pathname || '/';
          const groups = Object.keys(parsed).filter(key => {
            const item = parsed[key];
            return typeof item === 'object' && item.type === 'menu' && item.items;
          });
          const activeGroups = groups.filter(key => {
            const item = parsed[key] as MetaItem;
            // Check if any child path matches exactly
            if (item.items) {
              return Object.keys(item.items).some(subKey => {
                const subItem = item.items![subKey];
                if (typeof subItem === 'string') {
                  // For string items, check if path matches exactly
                  const fullPath = `${key}/${subKey}`;
                  return currentPath === `/${fullPath}` || currentPath === `/${subKey}`;
                } else if (subItem.href) {
                  // For items with href, check the href exactly (don't use startsWith to avoid false matches)
                  return currentPath === subItem.href;
                } else {
                  // Fallback: check standard paths exactly
                  const fullPath = `${key}/${subKey}`;
                  return currentPath === `/${fullPath}` || currentPath === `/${subKey}`;
                }
              });
            }
            return false;
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
  }, [meta, pathname]);

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
    // Uniform icon size for all icons
    const iconClass = "w-4 h-4 flex-shrink-0";
    
    // Main level items get specific icons
    if (level === 0) {
      switch (key) {
        case 'index':
        case 'muyegerere':
          return <Home className={iconClass} />;
        case 'gwajiika':
          return <Info className={iconClass} />;
        case 'ndondeero_tusome':
          return <BookOpen className={iconClass} />;
        case 'ukuharura':
          return <Calculator className={iconClass} />;
        case 'amagambo':
          return <Sparkles className={iconClass} />;
        default:
          return <FileText className={iconClass} />;
      }
    }
    // Nested items (ukuharura sub-items) use FileText with uniform size
    return <FileText className={iconClass} />;
  };

  // Exclude header navigation items from sidebar
  const isHeaderNavItem = (key: string): boolean => {
    return ['kifuliiru', 'imigani', 'imigeeza', 'imwitu', 'bingi-ku-kifuliiru', 'twehe', 'contact', 'eng-frn-swa'].includes(key);
  };

  const renderMenuItem = (key: string, item: MetaItem | string, level: number = 0, parentKey: string = ''): React.ReactNode => {
    // Skip header navigation items
    if (isHeaderNavItem(key)) {
      return null;
    }

    if (typeof item === 'string') {
      // Build the path: if parentKey exists, it's nested like "ukuharura/abandu"
      const fullPath = parentKey ? `${parentKey}/${key}` : key;
      const docHref = key === 'index' ? '/' : `/${fullPath}`;
      const currentPath = pathname || '/';
      const isActive = currentPath === docHref || currentPath === `/${key}`;
      
      // Reduce left margin for ukuharura items (level > 0)
      const isUkuharuraItem = parentKey === 'ukuharura' || level > 0;
      const leftPadding = isUkuharuraItem 
        ? `${level * 0.75 + 0.75}rem`  // Reduced margin for ukuharura items
        : `${level * 1.5 + 1}rem`;      // Normal margin for other items
      
      return (
        <li key={key}>
          <a
            href={docHref}
            onClick={() => {
              // Ensure parent menu stays open when clicking child
              if (parentKey) {
                setExpandedGroups(prev => {
                  const next = new Set(prev);
                  next.add(parentKey);
                  return next;
                });
              }
            }}
            className={`
              flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-all whitespace-nowrap
              ${isActive
                ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-semibold'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
              }
            `}
            style={{ paddingLeft: leftPadding }}
          >
            {getIcon(key, level)}
            <span className="truncate">{item}</span>
          </a>
        </li>
      );
    }

    const { title, type, href, newWindow, items } = item;
    const displayTitle = title || key;

    if (type === 'menu' && items) {
      const currentPath = pathname || '/';
      const isMenuActive = currentPath.startsWith(`/${key}`);
      const isExpanded = expandedGroups.has(key);
      
      // Get appropriate icon for menu items
      const iconClass = "w-4 h-4 flex-shrink-0";
      const menuIcon = (() => {
        switch (key) {
          case 'ukuharura':
            return <Calculator className={iconClass} />;
          default:
            return <Folder className={iconClass} />;
        }
      })();
      
      return (
        <li key={key} className="mb-2">
          <button
            onClick={() => toggleGroup(key)}
            className={`
              w-full flex items-center justify-between gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all
              ${isMenuActive
                ? 'text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-900'
              }
            `}
          >
            <div className="flex items-center gap-2">
              {menuIcon}
              <span>{displayTitle}</span>
            </div>
            <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
          {isExpanded && (
            <ul className={`mt-1 space-y-1 ${key === 'ukuharura' ? 'ml-2 pl-2 border-l border-gray-200 dark:border-gray-800' : 'ml-6 pl-4 border-l border-gray-200 dark:border-gray-800'}`}>
              {Object.entries(items).map(([subKey, subItem]) =>
                renderMenuItem(subKey, subItem, level + 1, key)
              )}
            </ul>
          )}
        </li>
      );
    }

    const linkHref = href || (key === 'index' ? '' : key);
    // Build nested path if parentKey exists
    const fullPath = parentKey ? `${parentKey}/${linkHref}` : linkHref;
    const docHref = href ? href : `/${fullPath}`;
    const currentPath = pathname || '/';
    const isActive = currentPath === docHref || currentPath === `/${fullPath}` || currentPath === `/${key}`;

    // Get appropriate icon for page items
    const iconClass = "w-4 h-4 flex-shrink-0";
    const pageIcon = (() => {
      switch (key) {
        case 'muyegerere':
        case 'index':
          return <Home className={iconClass} />;
        case 'gwajiika':
          return <Info className={iconClass} />;
        case 'ndondeero_tusome':
          return <BookOpen className={iconClass} />;
        case 'amagambo':
          return <Sparkles className={iconClass} />;
        default:
          return <Book className={iconClass} />;
      }
    })();

    return (
      <li key={key}>
        <a
          href={docHref}
          target={newWindow ? '_blank' : undefined}
          rel={newWindow ? 'noopener noreferrer' : undefined}
          className={`
            flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-all whitespace-nowrap
            ${isActive
              ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-semibold'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
            }
          `}
        >
          {pageIcon}
          <span className="truncate">{displayTitle}</span>
          {newWindow && <ExternalLink className="w-3 h-3 ml-auto opacity-40 flex-shrink-0" />}
        </a>
      </li>
    );
  };

  return (
    <>
      {/* Overlay - Only on mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Contained between header and footer */}
      <aside
        className={`
          w-80 h-full bg-white dark:bg-gray-950
          border-r border-gray-200 dark:border-gray-800
          overflow-y-auto overflow-x-hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          absolute z-40
          top-0
        `}
      >
        <div className="p-6">
          <nav>
            <ul className="space-y-1">
              {Object.entries(sidebarMeta)
                .filter(([key]) => !isHeaderNavItem(key))
                .map(([key, item]) =>
                  renderMenuItem(key, item)
                )}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
