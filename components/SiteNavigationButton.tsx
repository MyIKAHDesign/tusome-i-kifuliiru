import React from 'react';
import { Menu } from 'lucide-react';
import { useSidebar } from './SidebarContext';

export default function SiteNavigationButton() {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="fixed right-6 bottom-6 lg:right-8 lg:bottom-8 z-40 w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:shadow-lg transition-all duration-200 hover:scale-105 group"
      aria-label="Toggle site navigation"
    >
      <Menu className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
    </button>
  );
}

