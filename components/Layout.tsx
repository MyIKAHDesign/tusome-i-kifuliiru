import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

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
          {children}
        </main>
      </div>
      <Footer />
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          color: #111827;
          background-color: #ffffff;
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
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        @media (max-width: 768px) {
          .layout-content {
            flex-direction: column;
          }

          .main-content {
            padding: 1rem;
          }
        }

        /* MDX Content Styles */
        .main-content :global(h1) {
          font-size: 2.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .main-content :global(h2) {
          font-size: 2rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .main-content :global(h3) {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .main-content :global(p) {
          margin-bottom: 1rem;
          line-height: 1.7;
          font-size: 1rem;
        }

        .main-content :global(ul),
        .main-content :global(ol) {
          margin-bottom: 1rem;
          padding-left: 2rem;
        }

        .main-content :global(li) {
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }

        .main-content :global(a) {
          color: #2563eb;
          text-decoration: none;
          transition: color 0.2s;
        }

        .main-content :global(a:hover) {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .main-content :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }

        .main-content :global(code) {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        .main-content :global(pre) {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .main-content :global(pre code) {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }

        .main-content :global(blockquote) {
          border-left: 4px solid #2563eb;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #6b7280;
          font-style: italic;
        }

        @media (prefers-color-scheme: dark) {
          body {
            background-color: #111827;
            color: #f9fafb;
          }

          .main-content :global(code) {
            background-color: #374151;
          }
        }
      `}</style>
    </div>
  );
}

