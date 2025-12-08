import React from 'react';
import Search from './Search';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-brand">
          <a href="/" className="brand-link">
            <span className="brand-text">Tusome i Kifuliiru</span>
          </a>
        </div>
        <nav className="header-nav">
          <Search />
          <a href="/" className="nav-link">
            Ndondeero
          </a>
        </nav>
      </div>
      <style jsx>{`
        .site-header {
          height: var(--header-height);
          border-bottom: 1px solid var(--color-border);
          background: var(--color-bg);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.8);
          box-shadow: var(--shadow-sm);
        }

        @media (prefers-color-scheme: dark) {
          .site-header {
            background: rgba(17, 24, 39, 0.8);
          }
        }

        .header-container {
          max-width: var(--content-max-width);
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--spacing-6);
        }

        .header-brand {
          display: flex;
          align-items: center;
        }

        .brand-link {
          text-decoration: none;
          color: var(--color-text);
          transition: opacity var(--transition-base);
        }

        .brand-link:hover {
          opacity: 0.8;
        }

        .brand-text {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-nav {
          display: flex;
          gap: var(--spacing-6);
          align-items: center;
        }

        .nav-link {
          color: var(--color-text);
          text-decoration: none;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          padding: var(--spacing-2) var(--spacing-4);
          border-radius: var(--radius-md);
          transition: all var(--transition-base);
        }

        .nav-link:hover {
          color: var(--color-primary);
          background-color: var(--color-bg-secondary);
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 0 var(--spacing-4);
          }

          .brand-text {
            font-size: var(--font-size-lg);
          }

          .header-nav {
            gap: var(--spacing-4);
          }
        }
      `}</style>
    </header>
  );
}
