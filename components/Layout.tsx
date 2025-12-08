import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <article className="mdx-content">
              {children}
            </article>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
