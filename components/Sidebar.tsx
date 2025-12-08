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

// Default meta structure - fallback if API fails
const defaultMeta: Record<string, MetaItem | string> = {};

export default function Sidebar({ meta }: SidebarProps) {
  const router = useRouter();
  const [sidebarMeta, setSidebarMeta] = useState<Record<string, MetaItem | string>>(defaultMeta);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load meta.json via API or use provided meta
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
        <li key={key} style={{ marginLeft: `${level * 1}rem` }}>
          <a
            href={href}
            className={isActive ? 'active' : ''}
            style={{
              display: 'block',
              padding: '0.5rem 1rem',
              color: isActive ? '#2563eb' : '#374151',
              fontWeight: isActive ? 600 : 400,
              textDecoration: 'none',
              borderRadius: '0.375rem',
              transition: 'all 0.2s',
            }}
          >
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
        <li key={key} style={{ marginTop: level > 0 ? '0.5rem' : '0' }}>
          <div
            style={{
              padding: '0.5rem 1rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: isMenuActive ? '#2563eb' : '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {displayTitle}
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
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
      <li key={key} style={{ marginLeft: `${level * 1}rem` }}>
        <a
          href={linkHref}
          target={newWindow ? '_blank' : undefined}
          rel={newWindow ? 'noopener noreferrer' : undefined}
          className={isActive ? 'active' : ''}
          style={{
            display: 'block',
            padding: '0.5rem 1rem',
            color: isActive ? '#2563eb' : '#374151',
            fontWeight: isActive ? 600 : 400,
            textDecoration: 'none',
            borderRadius: '0.375rem',
            transition: 'all 0.2s',
          }}
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
        style={{
          display: 'none',
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
          padding: '0.5rem',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          cursor: 'pointer',
        }}
      >
        ☰
      </button>
      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '280px',
          minHeight: '100vh',
          borderRight: '1px solid #e5e7eb',
          padding: '2rem 0',
          backgroundColor: '#f9fafb',
          position: 'sticky',
          top: 0,
          alignSelf: 'flex-start',
          overflowY: 'auto',
          maxHeight: '100vh',
        }}
      >
        <div style={{ padding: '0 1rem' }}>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              padding: '0 1rem',
            }}
          >
            Tusome i Kifuliiru
          </h2>
          <nav>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}
            >
              {Object.entries(sidebarMeta).map(([key, item]) =>
                renderMenuItem(key, item)
              )}
            </ul>
          </nav>
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            .sidebar-toggle {
              display: block !important;
            }

            .sidebar {
              position: fixed;
              left: ${isOpen ? '0' : '-280px'};
              top: 0;
              z-index: 999;
              transition: left 0.3s ease;
              box-shadow: ${isOpen ? '2px 0 8px rgba(0,0,0,0.1)' : 'none'};
            }
          }

          .sidebar :global(a:hover) {
            background-color: #f3f4f6;
          }

          .sidebar :global(.active) {
            background-color: #eff6ff;
          }
        `}</style>
      </aside>
    </>
  );
}

