import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Home, 
  Book, 
  Folder, 
  ChevronRight, 
  ExternalLink, 
  FileText, 
  X,
  Info,
  Calculator,
  BookOpen,
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

const defaultMeta: Record<string, MetaItem | string> = {};

export default function SiteNavigation() {
  const router = useRouter();
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
          const currentPath = router.asPath.split('?')[0];
          const groups = Object.keys(parsed).filter(key => {
            const item = parsed[key];
            return typeof item === 'object' && item.type === 'menu' && item.items;
          });
          const activeGroups = groups.filter(key => {
            const item = parsed[key] as MetaItem;
            if (item.items) {
              return Object.keys(item.items).some(subKey => {
                const subItem = item.items![subKey];
                if (typeof subItem === 'string') {
                  const fullPath = `${key}/${subKey}`;
                  return currentPath === `/${fullPath}` || currentPath === `/${subKey}`;
                } else if (subItem.href) {
                  return currentPath === subItem.href;
                } else {
                  const fullPath = `${key}/${subKey}`;
                  return currentPath === `/${fullPath}` || currentPath === `/${subKey}`;
                }
              });
            }
            return false;
          });
          setExpandedGroups(new Set(activeGroups));
        }
      } catch (error) {
        console.error('Error loading meta.json:', error);
      }
    };

    loadMeta();
  }, [router.asPath]);

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
    const iconClass = "w-3.5 h-3.5 flex-shrink-0";
    
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
    return <FileText className={iconClass} />;
  };

  const isHeaderNavItem = (key: string): boolean => {
    return ['kifuliiru', 'imigani', 'imigeeza', 'imwitu', 'bingi-ku-kifuliiru', 'twehe', 'contact', 'eng-frn-swa'].includes(key);
  };

  const renderMenuItem = (key: string, item: MetaItem | string, level: number = 0, parentKey: string = ''): React.ReactNode => {
    if (isHeaderNavItem(key)) {
      return null;
    }

    if (typeof item === 'string') {
      const fullPath = parentKey ? `${parentKey}/${key}` : key;
      const docHref = key === 'index' ? '/' : `/${fullPath}`;
      const currentPath = router.asPath.split('?')[0];
      const isActive = currentPath === docHref || currentPath === `/${key}`;
      
      const isUkuharuraItem = parentKey === 'ukuharura' || level > 0;
      const leftPadding = isUkuharuraItem 
        ? `${level * 0.75 + 0.75}rem`
        : `${level * 1.5 + 1}rem`;
      
      return (
        <li key={key}>
          <a
            href={docHref}
            onClick={() => {
              if (parentKey) {
                setExpandedGroups(prev => {
                  const next = new Set(prev);
                  next.add(parentKey);
                  return next;
                });
              }
              setIsOpen(false);
            }}
            className={`
              flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-all whitespace-nowrap
              ${isActive
                ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-gray-50'
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
      const currentPath = router.asPath.split('?')[0];
      const isMenuActive = currentPath.startsWith(`/${key}`);
      const isExpanded = expandedGroups.has(key);
      
      const iconClass = "w-3.5 h-3.5 flex-shrink-0";
      const menuIcon = (() => {
        switch (key) {
          case 'ukuharura':
            return <Calculator className={iconClass} />;
          default:
            return <Folder className={iconClass} />;
        }
      })();
      
      return (
        <li key={key} className="mb-1">
          <button
            onClick={() => toggleGroup(key)}
            className={`
              w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all
              ${isMenuActive
                ? 'text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-900/50'
              }
            `}
          >
            <div className="flex items-center gap-2">
              {menuIcon}
              <span className="truncate">{displayTitle}</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
          {isExpanded && (
            <ul className={`mt-0.5 space-y-0.5 ${key === 'ukuharura' ? 'ml-2 pl-2 border-l border-gray-200 dark:border-gray-800' : 'ml-4 pl-3 border-l border-gray-200 dark:border-gray-800'}`}>
              {Object.entries(items).map(([subKey, subItem]) =>
                renderMenuItem(subKey, subItem, level + 1, key)
              )}
            </ul>
          )}
        </li>
      );
    }

    const linkHref = href || (key === 'index' ? '' : key);
    const fullPath = parentKey ? `${parentKey}/${linkHref}` : linkHref;
    const docHref = href ? href : `/${fullPath}`;
    const currentPath = router.asPath.split('?')[0];
    const isActive = currentPath === docHref || currentPath === `/${fullPath}` || currentPath === `/${key}`;

    const iconClass = "w-3.5 h-3.5 flex-shrink-0";
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
          onClick={() => setIsOpen(false)}
          className={`
            flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-all whitespace-nowrap
            ${isActive
              ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-gray-50'
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
      {/* Dialog Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog Card - Positioned from left, compact and professional */}
          <div className="absolute left-4 top-20 bottom-4 w-full max-w-xs bg-white dark:bg-gray-950 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col animate-in fade-in slide-in-from-left-2 duration-200">
            {/* Header - Compact */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0 bg-gray-50/50 dark:bg-gray-900/30">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                Navigation
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Scrollable Content - Compact spacing */}
            <nav className="overflow-y-auto flex-1 p-3 min-h-0">
              <ul className="space-y-0.5">
                {Object.entries(sidebarMeta)
                  .filter(([key]) => !isHeaderNavItem(key))
                  .map(([key, item]) =>
                    renderMenuItem(key, item)
                  )}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

