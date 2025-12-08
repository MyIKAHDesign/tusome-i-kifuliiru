import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { SidebarProvider, useSidebar } from './SidebarContext';

interface LayoutContentProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: LayoutContentProps) {
  const { isOpen } = useSidebar();
  const sidebarWidth = 288; // w-72 = 18rem = 288px

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main 
          className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out"
          style={{
            marginLeft: isOpen ? `${sidebarWidth}px` : '0',
          }}
        >
          <div className="w-full px-6 py-12">
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

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
