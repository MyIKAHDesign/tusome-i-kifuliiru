import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

import { SidebarProvider } from './SidebarContext';

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="flex-1">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
