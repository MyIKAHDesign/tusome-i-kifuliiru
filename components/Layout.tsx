import React from 'react';
import Header from './Header';
import Footer from './Footer';
import PageNavigation from './PageNavigation';
import ChatBot from './ChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      <main className="flex-1">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
      <Footer />
      {/* Floating Page Navigation */}
      <PageNavigation />
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
