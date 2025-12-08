import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import '../styles/design-tokens.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-container">
      <Header />
      <div className="layout-content">
        <Sidebar />
        <main className="main-content">
          <article className="content-wrapper">
            {children}
          </article>
        </main>
      </div>
      <Footer />
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: var(--font-sans);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          color: var(--color-text);
          background-color: var(--color-bg);
          line-height: var(--line-height-relaxed);
        }

        .layout-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .layout-content {
          display: flex;
          flex: 1;
          max-width: 100%;
        }

        .main-content {
          flex: 1;
          padding: var(--spacing-8) var(--spacing-6);
          max-width: var(--content-max-width);
          margin: 0 auto;
          width: 100%;
          min-height: calc(100vh - var(--header-height));
        }

        .content-wrapper {
          max-width: 65ch;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .layout-content {
            flex-direction: column;
          }

          .main-content {
            padding: var(--spacing-4);
          }
        }

        /* Modern Typography for MDX Content */
        .main-content :global(h1) {
          font-size: var(--font-size-4xl);
          font-weight: var(--font-weight-bold);
          margin-top: var(--spacing-8);
          margin-bottom: var(--spacing-6);
          line-height: var(--line-height-tight);
          color: var(--color-text);
          letter-spacing: -0.025em;
        }

        .main-content :global(h2) {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-bold);
          margin-top: var(--spacing-10);
          margin-bottom: var(--spacing-4);
          line-height: var(--line-height-tight);
          color: var(--color-text);
          letter-spacing: -0.025em;
          padding-bottom: var(--spacing-2);
          border-bottom: 2px solid var(--color-border);
        }

        .main-content :global(h3) {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-semibold);
          margin-top: var(--spacing-8);
          margin-bottom: var(--spacing-4);
          line-height: var(--line-height-normal);
          color: var(--color-text);
        }

        .main-content :global(h4) {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          margin-top: var(--spacing-6);
          margin-bottom: var(--spacing-3);
          color: var(--color-text);
        }

        .main-content :global(p) {
          margin-bottom: var(--spacing-6);
          line-height: var(--line-height-relaxed);
          font-size: var(--font-size-base);
          color: var(--color-text);
        }

        .main-content :global(ul),
        .main-content :global(ol) {
          margin-bottom: var(--spacing-6);
          padding-left: var(--spacing-8);
          color: var(--color-text);
        }

        .main-content :global(li) {
          margin-bottom: var(--spacing-3);
          line-height: var(--line-height-relaxed);
        }

        .main-content :global(li::marker) {
          color: var(--color-primary);
        }

        .main-content :global(a) {
          color: var(--color-primary);
          text-decoration: none;
          font-weight: var(--font-weight-medium);
          transition: color var(--transition-base);
          border-bottom: 1px solid transparent;
          padding-bottom: 1px;
        }

        .main-content :global(a:hover) {
          color: var(--color-primary-dark);
          border-bottom-color: var(--color-primary);
        }

        .main-content :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: var(--radius-lg);
          margin: var(--spacing-8) 0;
          box-shadow: var(--shadow-lg);
          transition: transform var(--transition-slow), box-shadow var(--transition-slow);
        }

        .main-content :global(img:hover) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl);
        }

        .main-content :global(code) {
          background-color: var(--color-bg-tertiary);
          color: var(--color-primary-dark);
          padding: var(--spacing-1) var(--spacing-2);
          border-radius: var(--radius-sm);
          font-size: 0.9em;
          font-family: var(--font-mono);
          font-weight: var(--font-weight-medium);
        }

        .main-content :global(pre) {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: #f9fafb;
          padding: var(--spacing-6);
          border-radius: var(--radius-lg);
          overflow-x: auto;
          margin: var(--spacing-8) 0;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--color-border);
        }

        .main-content :global(pre code) {
          background-color: transparent;
          padding: 0;
          color: inherit;
          font-size: var(--font-size-sm);
        }

        .main-content :global(blockquote) {
          border-left: 4px solid var(--color-primary);
          padding-left: var(--spacing-6);
          margin: var(--spacing-8) 0;
          color: var(--color-text-secondary);
          font-style: italic;
          background-color: var(--color-bg-secondary);
          padding: var(--spacing-4) var(--spacing-6);
          border-radius: var(--radius-md);
        }

        .main-content :global(hr) {
          border: none;
          border-top: 2px solid var(--color-border);
          margin: var(--spacing-10) 0;
        }

        .main-content :global(table) {
          width: 100%;
          border-collapse: collapse;
          margin: var(--spacing-8) 0;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .main-content :global(th),
        .main-content :global(td) {
          padding: var(--spacing-4);
          text-align: left;
          border-bottom: 1px solid var(--color-border);
        }

        .main-content :global(th) {
          background-color: var(--color-bg-secondary);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
        }

        .main-content :global(tr:hover) {
          background-color: var(--color-bg-secondary);
        }
      `}</style>
    </div>
  );
}
