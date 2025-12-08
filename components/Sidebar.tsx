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

export default function Sidebar({ meta }: SidebarProps) {
  const router = useRouter();
  const [sidebarMeta, setSidebarMeta] = useState<Record<string, MetaItem | string>>(defaultMeta);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const response = await fetch('/api/meta');
        if (response.ok) {
          const parsed = await response.json();
          setSidebarMeta(parsed);
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
  }, [meta]);

  const renderMenuItem = (key: string, item: MetaItem | string, level: number = 0, parentPath: string = ''): React.ReactNode => {
    if (typeof item === 'string') {
      const href = key === 'index' ? '/' : `/${key}`;
      const currentPath = router.asPath.split('?')[0];
      const isActive = currentPath === href || currentPath === `/${key}`;
      return (
        <li key={key} className={`nav-item ${isActive ? 'active' : ''}`} style={{ paddingLeft: `${level * 1.25}rem` }}>
          <a href={href} className="nav-link">
            {item}
          </a>
        </li>
      );
    }

    const { title, type, href, newWindow, items } = item;
    const displayTitle = title || key;

    if (type === 'menu' && items) {
      const currentPath = router.asPath.split('?')[0];
      const isMenuActive = currentPath.startsWith(`/${key}`);
      return (
        <li key={key} className="nav-group">
          <div className={`nav-group-header ${isMenuActive ? 'active' : ''}`}>
            {displayTitle}
          </div>
          <ul className="nav-group-list">
            {Object.entries(items).map(([subKey, subItem]) =>
              renderMenuItem(subKey, subItem, level + 1, `/${key}`)
            )}
          </ul>
        </li>
      );
    }

    const linkHref = href || `/${key === 'index' ? '' : key}`;
    const currentPath = router.asPath.split('?')[0];
    const isActive = currentPath === linkHref || currentPath === `/${key}` || (parentPath && currentPath.startsWith(parentPath));

    return (
      <li key={key} className={`nav-item ${isActive ? 'active' : ''}`} style={{ paddingLeft: `${level * 1.25}rem` }}>
        <a
          href={linkHref}
          target={newWindow ? '_blank' : undefined}
          rel={newWindow ? 'noopener noreferrer' : undefined}
          className="nav-link"
        >
          {displayTitle}
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
            <h2 className="sidebar-title">Tusome i Kifuliiru</h2>
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
            min-height: 100vh;
            background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-secondary) 100%);
            border-right: 1px solid var(--color-border);
            position: sticky;
            top: var(--header-height);
            align-self: flex-start;
            overflow-y: auto;
            max-height: calc(100vh - var(--header-height));
            transition: transform var(--transition-base);
          }

          .sidebar-content {
            padding: var(--spacing-6) 0;
          }

          .sidebar-header {
            padding: 0 var(--spacing-6);
            margin-bottom: var(--spacing-6);
            padding-bottom: var(--spacing-4);
            border-bottom: 1px solid var(--color-border);
          }

          .sidebar-title {
            font-size: var(--font-size-xl);
            font-weight: var(--font-weight-bold);
            color: var(--color-text);
            margin: 0;
            letter-spacing: -0.02em;
          }

          .sidebar-nav {
            padding: 0 var(--spacing-4);
          }

          .nav-list {
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .nav-group {
            margin-top: var(--spacing-4);
          }

          .nav-group-header {
            padding: var(--spacing-2) var(--spacing-4);
            font-weight: var(--font-weight-semibold);
            font-size: var(--font-size-xs);
            color: var(--color-text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: var(--spacing-2);
            transition: color var(--transition-base);
          }

          .nav-group-header.active {
            color: var(--color-primary);
          }

          .nav-item {
            margin: var(--spacing-1) 0;
          }

          .nav-link {
            display: block;
            padding: var(--spacing-2) var(--spacing-4);
            color: var(--color-text);
            text-decoration: none;
            border-radius: var(--radius-md);
            transition: all var(--transition-base);
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-normal);
            position: relative;
          }

          .nav-link:hover {
            background-color: var(--color-bg-tertiary);
            color: var(--color-primary);
            transform: translateX(4px);
          }

          .nav-item.active .nav-link {
            background: linear-gradient(90deg, var(--color-primary-bg) 0%, transparent 100%);
            color: var(--color-primary);
            font-weight: var(--font-weight-semibold);
            border-left: 3px solid var(--color-primary);
            padding-left: calc(var(--spacing-4) - 3px);
          }

          .nav-group-list {
            list-style: none;
            margin: 0;
            padding: 0;
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
            }
          }

          /* Scrollbar styling */
          .sidebar::-webkit-scrollbar {
            width: 6px;
          }

          .sidebar::-webkit-scrollbar-track {
            background: transparent;
          }

          .sidebar::-webkit-scrollbar-thumb {
            background: var(--color-border);
            border-radius: var(--radius-full);
          }

          .sidebar::-webkit-scrollbar-thumb:hover {
            background: var(--color-text-muted);
          }
        `}</style>
      </aside>
    </>
  );
}

