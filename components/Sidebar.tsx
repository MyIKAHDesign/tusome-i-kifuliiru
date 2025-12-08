import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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

// Icon components
const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const HomeIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const BookIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const FolderIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

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
          // Auto-expand groups that contain the current page
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
      return <HomeIcon className="nav-icon" />;
    }
    if (level === 0) {
      return <BookIcon className="nav-icon" />;
    }
    return null;
  };

  const renderMenuItem = (key: string, item: MetaItem | string, level: number = 0, parentPath: string = ''): React.ReactNode => {
    if (typeof item === 'string') {
      const href = key === 'index' ? '/' : `/${key}`;
      const currentPath = router.asPath.split('?')[0];
      const isActive = currentPath === href || currentPath === `/${key}`;
      return (
        <li key={key} className={`nav-item ${isActive ? 'active' : ''}`}>
          <a href={href} className="nav-link">
            {getIcon(key, level)}
            <span className="nav-link-text">{item}</span>
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
        <li key={key} className="nav-group">
          <button
            className={`nav-group-header ${isMenuActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}
            onClick={() => toggleGroup(key)}
          >
            <FolderIcon className="nav-group-icon" />
            <span className="nav-group-text">{displayTitle}</span>
            <ChevronRightIcon className={`nav-group-chevron ${isExpanded ? 'expanded' : ''}`} />
          </button>
          {isExpanded && (
            <ul className="nav-group-list">
              {Object.entries(items).map(([subKey, subItem]) =>
                renderMenuItem(subKey, subItem, level + 1, `/${key}`)
              )}
            </ul>
          )}
        </li>
      );
    }

    const linkHref = href || `/${key === 'index' ? '' : key}`;
    const currentPath = router.asPath.split('?')[0];
    const isActive = currentPath === linkHref || currentPath === `/${key}` || (parentPath && currentPath.startsWith(parentPath));

    return (
      <li key={key} className={`nav-item ${isActive ? 'active' : ''}`}>
        <a
          href={linkHref}
          target={newWindow ? '_blank' : undefined}
          rel={newWindow ? 'noopener noreferrer' : undefined}
          className="nav-link"
        >
          {getIcon(key, level)}
          <span className="nav-link-text">{displayTitle}</span>
          {newWindow && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="external-icon">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          )}
        </a>
      </li>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sidebar-toggle"
        aria-label="Toggle sidebar"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <div className="brand-icon">
                <BookIcon className="brand-icon-svg" />
              </div>
              <h2 className="sidebar-title">Tusome i Kifuliiru</h2>
            </div>
          </div>
          <nav className="sidebar-nav">
            <ul className="nav-list">
              {Object.entries(sidebarMeta).map(([key, item]) =>
                renderMenuItem(key, item)
              )}
            </ul>
          </nav>
        </div>
        <style jsx>{`
          .sidebar {
            width: var(--sidebar-width);
            min-height: calc(100vh - var(--header-height));
            background: var(--color-bg);
            border-right: 1px solid var(--color-border);
            position: sticky;
            top: var(--header-height);
            align-self: flex-start;
            overflow-y: auto;
            overflow-x: hidden;
            max-height: calc(100vh - var(--header-height));
            transition: transform var(--transition-base);
          }

          .sidebar-content {
            padding: var(--spacing-6) 0;
          }

          .sidebar-header {
            padding: 0 var(--spacing-6);
            margin-bottom: var(--spacing-6);
            padding-bottom: var(--spacing-6);
            border-bottom: 2px solid var(--color-border);
          }

          .sidebar-brand {
            display: flex;
            align-items: center;
            gap: var(--spacing-3);
          }

          .brand-icon {
            width: 40px;
            height: 40px;
            border-radius: var(--radius-lg);
            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: var(--shadow-md);
          }

          .brand-icon-svg {
            width: 20px;
            height: 20px;
            color: white;
          }

          .sidebar-title {
            font-size: var(--font-size-lg);
            font-weight: var(--font-weight-bold);
            color: var(--color-text);
            margin: 0;
            letter-spacing: -0.02em;
            line-height: 1.2;
          }

          .sidebar-nav {
            padding: 0 var(--spacing-3);
          }

          .nav-list {
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .nav-group {
            margin: var(--spacing-2) 0;
          }

          .nav-group-header {
            width: 100%;
            display: flex;
            align-items: center;
            gap: var(--spacing-2);
            padding: var(--spacing-3) var(--spacing-4);
            font-weight: var(--font-weight-semibold);
            font-size: var(--font-size-xs);
            color: var(--color-text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            background: transparent;
            border: none;
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: all var(--transition-base);
            text-align: left;
            margin-bottom: var(--spacing-1);
          }

          .nav-group-header:hover {
            background-color: var(--color-bg-secondary);
            color: var(--color-primary);
          }

          .nav-group-header.active {
            color: var(--color-primary);
            background-color: var(--color-primary-bg);
          }

          .nav-group-icon {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
            opacity: 0.7;
          }

          .nav-group-text {
            flex: 1;
          }

          .nav-group-chevron {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
            transition: transform var(--transition-base);
            opacity: 0.5;
          }

          .nav-group-chevron.expanded {
            transform: rotate(90deg);
          }

          .nav-group-list {
            list-style: none;
            margin: 0;
            padding: 0;
            padding-left: var(--spacing-6);
            border-left: 2px solid var(--color-border-light);
            margin-left: var(--spacing-4);
            animation: slideDown 0.2s ease-out;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .nav-item {
            margin: var(--spacing-1) 0;
          }

          .nav-link {
            display: flex;
            align-items: center;
            gap: var(--spacing-3);
            padding: var(--spacing-3) var(--spacing-4);
            color: var(--color-text);
            text-decoration: none;
            border-radius: var(--radius-md);
            transition: all var(--transition-base);
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-normal);
            position: relative;
            line-height: 1.5;
          }

          .nav-link:hover {
            background-color: var(--color-bg-secondary);
            color: var(--color-primary);
            transform: translateX(4px);
          }

          .nav-icon {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            opacity: 0.6;
            transition: opacity var(--transition-base);
          }

          .nav-link:hover .nav-icon {
            opacity: 1;
          }

          .nav-link-text {
            flex: 1;
          }

          .external-icon {
            width: 12px;
            height: 12px;
            opacity: 0.4;
            flex-shrink: 0;
          }

          .nav-item.active .nav-link {
            background: linear-gradient(90deg, var(--color-primary-bg) 0%, transparent 100%);
            color: var(--color-primary);
            font-weight: var(--font-weight-semibold);
            border-left: 3px solid var(--color-primary);
            padding-left: calc(var(--spacing-4) - 3px);
          }

          .nav-item.active .nav-icon {
            opacity: 1;
            color: var(--color-primary);
          }

          .sidebar-toggle {
            display: none;
            position: fixed;
            top: var(--spacing-4);
            left: var(--spacing-4);
            z-index: 1001;
            padding: var(--spacing-3);
            background: var(--color-bg);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            cursor: pointer;
            color: var(--color-text);
            box-shadow: var(--shadow-lg);
            transition: all var(--transition-base);
          }

          .sidebar-toggle:hover {
            background: var(--color-bg-secondary);
            transform: scale(1.05);
            box-shadow: var(--shadow-xl);
          }

          .sidebar-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
            backdrop-filter: blur(4px);
            animation: fadeIn 0.2s ease-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @media (max-width: 768px) {
            .sidebar-toggle {
              display: block;
            }

            .sidebar-overlay {
              display: block;
            }

            .sidebar {
              position: fixed;
              left: ${isOpen ? '0' : 'calc(-1 * var(--sidebar-width))'};
              top: 0;
              z-index: 999;
              box-shadow: ${isOpen ? 'var(--shadow-xl)' : 'none'};
              max-height: 100vh;
              min-height: 100vh;
            }
          }

          /* Enhanced Scrollbar styling */
          .sidebar::-webkit-scrollbar {
            width: 8px;
          }

          .sidebar::-webkit-scrollbar-track {
            background: transparent;
          }

          .sidebar::-webkit-scrollbar-thumb {
            background: var(--color-border);
            border-radius: var(--radius-full);
            border: 2px solid transparent;
            background-clip: padding-box;
          }

          .sidebar::-webkit-scrollbar-thumb:hover {
            background: var(--color-text-muted);
            background-clip: padding-box;
          }

          /* Smooth transitions for all interactive elements */
          .nav-link,
          .nav-group-header {
            will-change: transform;
          }
        `}</style>
      </aside>
    </>
  );
}
