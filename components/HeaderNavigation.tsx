'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, ExternalLink, Home, BookOpen, Info, Languages } from 'lucide-react';

interface NavItem {
  title?: string;
  type?: 'page' | 'menu' | 'link';
  href?: string;
  newWindow?: boolean;
  items?: Record<string, NavItem | string>;
}

interface HeaderNavigationProps {
  items: Record<string, NavItem | string>;
}

export default function HeaderNavigation({ items }: HeaderNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Don't close if clicking on a link or button inside the dropdown
      if (target instanceof Element) {
        const isLink = target.closest('a');
        const isButton = target.closest('button');
        if (isLink || isButton) {
          return; // Let the link/button handle the click
        }
      }
      
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(target)) {
          setOpenDropdown(null);
        }
      });
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  // Build the new navigation structure
  const buildNavigation = () => {
    const kifuliiruItems: Record<string, NavItem | string> = {};
    
    // Add Kifuliiru, Imigani, Imigeeza
    if (items.kifuliiru) {
      kifuliiruItems.kifuliiru = items.kifuliiru;
    }
    if (items.imigani) {
      kifuliiruItems.imigani = items.imigani;
    }
    if (items.imigeeza) {
      kifuliiruItems.imigeeza = items.imigeeza;
    }
    
    // Add all Bingi ku Kifuliiru items
    if (typeof items['bingi-ku-kifuliiru'] === 'object' && items['bingi-ku-kifuliiru'] !== null) {
      const bingi = items['bingi-ku-kifuliiru'] as NavItem;
      if (bingi.items) {
        Object.assign(kifuliiruItems, bingi.items);
      }
    }
    
    // Build Imwitu items (Ibufuliiru and others)
    const imwituItems: Record<string, NavItem | string> = {};
    if (typeof items.imwitu === 'object' && items.imwitu !== null) {
      const imwitu = items.imwitu as NavItem;
      if (imwitu.items) {
        Object.assign(imwituItems, imwitu.items);
      }
    }
    
    // Build Twehe items (include Tuyandikire)
    const tweheItems: Record<string, NavItem | string> = {};
    if (typeof items.twehe === 'object' && items.twehe !== null) {
      const twehe = items.twehe as NavItem;
      if (twehe.items) {
        Object.assign(tweheItems, twehe.items);
      }
    }
    // Add Tuyandikire to Twehe
    if (items.contact) {
      tweheItems.contact = items.contact;
    }
    
    return {
      home: { title: 'Home', type: 'page' as const, href: '/' },
      tusome: { title: 'Tusome', type: 'page' as const, href: '/tusome' },
      kifuliiru: {
        title: 'Kifuliiru',
        type: 'menu' as const,
        items: kifuliiruItems,
      },
      imwitu: {
        title: 'Imwitu',
        type: 'menu' as const,
        items: imwituItems,
      },
      twehe: {
        title: 'Twehe',
        type: 'menu' as const,
        items: tweheItems,
      },
      'eng-frn-swa': items['eng-frn-swa'] || {
        title: '🇬🇧 🇹🇿 🇫🇷',
        type: 'menu' as const,
        items: {},
      },
    };
  };

  const navItems = buildNavigation();

  const getIcon = (key: string) => {
    switch (key) {
      case 'home':
        return <Home className="w-4 h-4" />;
      case 'tusome':
        return <BookOpen className="w-4 h-4" />;
      case 'kifuliiru':
        return <BookOpen className="w-4 h-4" />;
      case 'imwitu':
        return <BookOpen className="w-4 h-4" />;
      case 'twehe':
        return <Info className="w-4 h-4" />;
      case 'eng-frn-swa':
        return null; // Using flags instead of icon
      default:
        return null;
    }
  };

  const renderDropdown = (key: string, item: NavItem | string) => {
    if (typeof item === 'string' || !item.items) return null;

    const isOpen = openDropdown === key;
    const itemEntries = Object.entries(item.items);
    const isMegaMenu = key === 'kifuliiru';

    // For mega menu, split items into two columns
    const splitItems = (items: [string, NavItem | string][]) => {
      if (!isMegaMenu) return { left: items, right: [] };
      
      // Column 1: Kifuliiru, Imigani, Imigeeza
      const leftItems: [string, NavItem | string][] = [];
      const rightItems: [string, NavItem | string][] = [];
      
      const mainItems = ['kifuliiru', 'imigani', 'imigeeza'];
      
      items.forEach(([subKey, subItem]) => {
        if (mainItems.includes(subKey)) {
          leftItems.push([subKey, subItem]);
        } else {
          rightItems.push([subKey, subItem]);
        }
      });
      
      return { left: leftItems, right: rightItems };
    };

    const { left, right } = splitItems(itemEntries);

    return (
      <div
        key={key}
        className="relative"
        ref={(el) => {
          dropdownRefs.current[key] = el;
        }}
      >
        <button
          onClick={() => setOpenDropdown(isOpen ? null : key)}
          className={`
            w-full lg:w-auto flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all
            ${
              pathname?.startsWith(`/${key}`)
                ? 'text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-white/10 dark:backdrop-blur-sm'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-white/5'
            }
          `}
        >
          {getIcon(key)}
          <span>{item.title}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <>
            {/* Indicator Arrow - Hidden on mobile */}
            <div className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-300 dark:border-b-slate-700 z-[100]" />
            <div className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[7px] border-l-transparent border-r-transparent border-b-white dark:border-b-slate-800 z-[101]" />
            
            {/* Dropdown/Mega Menu */}
            <div className={`
              lg:absolute lg:top-full mt-2 bg-white dark:bg-slate-800 dark:backdrop-blur-xl rounded-lg shadow-2xl border border-gray-200 dark:border-white/20 z-[100] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden
              ${isMegaMenu 
                ? 'w-full lg:w-[400px] lg:left-1/2 lg:-translate-x-1/2' 
                : 'w-full lg:w-40 lg:left-1/2 lg:-translate-x-1/2'
              }
            `}>
            {isMegaMenu ? (
              <div className="flex flex-col lg:grid lg:grid-cols-2 lg:divide-x divide-y lg:divide-y-0 divide-gray-200 dark:divide-white/10">
                {/* Left Column */}
                <div className="p-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2 border-b border-gray-200 dark:border-white/10 pb-2">
                    Kifuliiru
                  </h3>
                  <div className="space-y-0.5">
                    {left.map(([subKey, subItem]) => {
                      const subTitle = typeof subItem === 'string' ? subItem : subItem.title || subKey;
                      let subHref: string;
                      if (typeof subItem === 'object' && subItem.href) {
                        subHref = subItem.href;
                      } else {
                        subHref = `/${subKey}`;
                      }
                      const isExternal = typeof subItem === 'object' && subItem.newWindow || subHref.startsWith('http');
                      const isActive = pathname === subHref || pathname?.startsWith(`${subHref}/`);

                      return (
                        <a
                          key={subKey}
                          href={subHref}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isExternal) {
                              e.preventDefault();
                              setOpenDropdown(null);
                              router.push(subHref);
                            } else {
                              setOpenDropdown(null);
                            }
                          }}
                          className={`
                            flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-all
                            ${
                              isActive
                                ? 'bg-gray-100 dark:bg-white/10 dark:backdrop-blur-sm text-gray-900 dark:text-gray-50 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-50'
                            }
                          `}
                        >
                          <span className="truncate">{subTitle}</span>
                          {isExternal && <ExternalLink className="w-3 h-3 opacity-50 flex-shrink-0" />}
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column */}
                <div className="p-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2 border-b border-gray-200 dark:border-white/10 pb-2">
                    Bingi ku Kifuliiru
                  </h3>
                  <div className="space-y-0.5">
                    {right.map(([subKey, subItem]) => {
                      const subTitle = typeof subItem === 'string' ? subItem : subItem.title || subKey;
                      let subHref: string;
                      if (typeof subItem === 'object' && subItem.href) {
                        subHref = subItem.href;
                      } else {
                        // Items in right column are from "bingi-ku-kifuliiru" menu
                        subHref = `/bingi-ku-kifuliiru/${subKey}`;
                      }
                      const isExternal = typeof subItem === 'object' && subItem.newWindow || subHref.startsWith('http');
                      const isActive = pathname === subHref || pathname?.startsWith(`${subHref}/`);

                      return (
                        <a
                          key={subKey}
                          href={subHref}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isExternal) {
                              e.preventDefault();
                              setOpenDropdown(null);
                              router.push(subHref);
                            } else {
                              setOpenDropdown(null);
                            }
                          }}
                          className={`
                            flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-all
                            ${
                              isActive
                                ? 'bg-gray-100 dark:bg-white/10 dark:backdrop-blur-sm text-gray-900 dark:text-gray-50 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-50'
                            }
                          `}
                        >
                          <span className="truncate">{subTitle}</span>
                          {isExternal && <ExternalLink className="w-3 h-3 opacity-50 flex-shrink-0" />}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-2">
                {itemEntries.map(([subKey, subItem]) => {
                  const subTitle = typeof subItem === 'string' ? subItem : subItem.title || subKey;
                  let subHref: string;
                  if (typeof subItem === 'object' && subItem.href) {
                    subHref = subItem.href;
                  } else {
                    if (key === 'eng-frn-swa') {
                      subHref = `/eng-frn-swa/${subKey}`;
                    } else if (key === 'imwitu') {
                      subHref = `/imwitu/${subKey}`;
                    } else if (key === 'twehe') {
                      subHref = `/twehe/${subKey}`;
                    } else if (key === 'bingi-ku-kifuliiru') {
                      subHref = `/bingi-ku-kifuliiru/${subKey}`;
                    } else {
                      subHref = `/${subKey}`;
                    }
                  }
                  const isExternal = typeof subItem === 'object' && subItem.newWindow || subHref.startsWith('http');
                  const isActive = pathname === subHref || pathname?.startsWith(`${subHref}/`);

                  return (
                    <a
                      key={subKey}
                      href={subHref}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isExternal) {
                          e.preventDefault();
                          setOpenDropdown(null);
                          router.push(subHref);
                        } else {
                          setOpenDropdown(null);
                        }
                      }}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 text-xs rounded-md transition-all
                        ${
                          isActive
                            ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-gray-50'
                        }
                      `}
                    >
                      <span className="truncate">{subTitle}</span>
                      {isExternal && <ExternalLink className="w-3 h-3 opacity-50 flex-shrink-0 ml-auto" />}
                    </a>
                  );
                })}
              </div>
            )}
            </div>
          </>
        )}
      </div>
    );
  };

  // Language selector for eng-frn-swa
  const getLanguageFlag = (langKey: string): string => {
    switch (langKey) {
      case 'kiswahili':
        return '🇹🇿';
      case 'english':
        return '🇬🇧';
      case 'francais':
        return '🇫🇷';
      case 'tukole':
        return '🌍'; // Default icon for Tukole
      default:
        return '🌐';
    }
  };

  const getCurrentLanguage = (): string => {
    if (!pathname?.startsWith('/eng-frn-swa/')) {
      return 'english'; // Default
    }
    const pathParts = pathname.split('/');
    const langKey = pathParts[2]; // eng-frn-swa/[lang]
    return langKey || 'english';
  };

  const renderLanguageSelector = (key: string, item: NavItem) => {
    if (!item.items) return null;

    const currentLang = getCurrentLanguage();
    const currentFlag = getLanguageFlag(currentLang);
    const isOpen = openDropdown === key;
    const itemEntries = Object.entries(item.items);

    return (
      <div
        key={key}
        className="relative"
        ref={(el) => {
          dropdownRefs.current[key] = el;
        }}
      >
        <button
          onClick={() => setOpenDropdown(isOpen ? null : key)}
          className={`
            w-full lg:w-auto flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all
            ${
              pathname?.startsWith(`/${key}`)
                ? 'text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-white/10 dark:backdrop-blur-sm'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-white/5'
            }
          `}
        >
          <span className="text-lg">{currentFlag}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <>
            {/* Indicator Arrow - Hidden on mobile */}
            <div className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-300 dark:border-b-slate-700 z-[100]" />
            <div className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[7px] border-l-transparent border-r-transparent border-b-white dark:border-b-slate-800 z-[101]" />
            
            {/* Language Dropdown */}
            <div className="lg:absolute lg:top-full mt-2 bg-white dark:bg-slate-800/95 dark:backdrop-blur-xl rounded-lg shadow-2xl border border-gray-200 dark:border-white/20 z-[100] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden w-full lg:w-40 lg:left-1/2 lg:-translate-x-1/2">
              <div className="py-2">
                {itemEntries.map(([subKey, subItem]) => {
                  const subTitle = typeof subItem === 'string' ? subItem : subItem.title || subKey;
                  const subHref = `/eng-frn-swa/${subKey}`;
                  const isActive = pathname === subHref || pathname?.startsWith(`${subHref}/`);
                  const flag = getLanguageFlag(subKey);

                  return (
                    <a
                      key={subKey}
                      href={subHref}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setOpenDropdown(null);
                        router.push(subHref);
                      }}
                      className={`
                        flex items-center gap-3 px-4 py-2.5 text-xs rounded-md transition-all
                        ${
                          isActive
                            ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-gray-50'
                        }
                      `}
                    >
                      <span className="text-base">{flag}</span>
                      <span className="truncate">{subTitle}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderNavItem = (key: string, item: NavItem | string) => {
    if (typeof item === 'string') {
      const href = `/${key}`;
      const isActive = pathname === href || pathname?.startsWith(`/${key}/`);
      
      return (
        <a
          key={key}
          href={href}
          onClick={(e) => {
            e.preventDefault();
            router.push(href);
          }}
          className={`
            w-full lg:w-auto flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
            ${
              isActive
                ? 'text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-900'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-900'
            }
          `}
        >
          {getIcon(key)}
          <span>{item}</span>
        </a>
      );
    }

    // Special handling for language selector
    if (key === 'eng-frn-swa' && item.type === 'menu' && item.items) {
      return renderLanguageSelector(key, item);
    }

    if (item.type === 'menu' && item.items) {
      return renderDropdown(key, item);
    }

    const href = item.href || `/${key}`;
    const isActive = pathname === href || pathname?.startsWith(`/${key}/`);
    const isExternal = item.newWindow || href.startsWith('http');

    return (
      <a
        key={key}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        onClick={(e) => {
          if (!isExternal) {
            e.preventDefault();
            router.push(href);
          }
        }}
        className={`
          w-full lg:w-auto flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
          ${
            isActive
              ? 'text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-900'
              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-900'
          }
        `}
      >
        {getIcon(key)}
        <span>{item.title}</span>
        {isExternal && <ExternalLink className="w-3 h-3 ml-1" />}
      </a>
    );
  };

  return (
    <nav className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-2">
      {Object.entries(navItems).map(([key, item]) => renderNavItem(key, item))}
    </nav>
  );
}
