'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, ExternalLink, Home, BookOpen, Info } from 'lucide-react';

interface NavItem {
  title?: string;
  type?: 'page' | 'menu' | 'link';
  href?: string;
  newWindow?: boolean;
  items?: Record<string, NavItem | string>;
}

interface MobileNavigationProps {
  items: Record<string, NavItem | string>;
}

export default function MobileNavigation({ items }: MobileNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Debug: Log to confirm this component is being used
  if (typeof window !== 'undefined') {
    console.log('MobileNavigation component is rendering');
  }

  // Build the navigation structure
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
    
    // Build Imwitu items
    const imwituItems: Record<string, NavItem | string> = {};
    if (typeof items.imwitu === 'object' && items.imwitu !== null) {
      const imwitu = items.imwitu as NavItem;
      if (imwitu.items) {
        Object.assign(imwituItems, imwitu.items);
      }
    }
    
    // Build Twehe items
    const tweheItems: Record<string, NavItem | string> = {};
    if (typeof items.twehe === 'object' && items.twehe !== null) {
      const twehe = items.twehe as NavItem;
      if (twehe.items) {
        Object.assign(tweheItems, twehe.items);
      }
    }
    if (items.contact) {
      tweheItems.contact = items.contact;
    }
    
    return {
      home: { title: 'Ikaya', type: 'page' as const, href: '/' },
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
        return null;
      default:
        return null;
    }
  };

  const getLanguageFlag = (langKey: string): string => {
    switch (langKey) {
      case 'kiswahili':
        return '🇹🇿';
      case 'english':
        return '🇬🇧';
      case 'francais':
        return '🇫🇷';
      case 'tukole':
        return '🌍';
      default:
        return '🌐';
    }
  };

  const getCurrentLanguage = (): string => {
    if (!pathname?.startsWith('/eng-frn-swa/')) {
      return 'english';
    }
    const pathParts = pathname.split('/');
    const langKey = pathParts[2];
    return langKey || 'english';
  };

  const renderDropdown = (key: string, item: NavItem) => {
    if (!item.items) return null;

    const isOpen = openDropdown === key;
    const itemEntries = Object.entries(item.items);
    const isMegaMenu = key === 'kifuliiru';

    // Split items for mega menu
    const splitItems = (items: [string, NavItem | string][]) => {
      if (!isMegaMenu) return { left: items, right: [] };
      
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
      <div key={key} className="w-full">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : key)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium rounded-md transition-all text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-white/5"
        >
          <div className="flex items-center gap-2">
            {getIcon(key)}
            <span>{item.title}</span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="mt-2 ml-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-white/20 overflow-hidden">
            {isMegaMenu ? (
              <div className="flex flex-col divide-y divide-gray-200 dark:divide-white/10">
                {/* Left Column */}
                <div className="p-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2 border-b border-gray-200 dark:border-white/10 pb-2">
                    Kifuliiru
                  </h3>
                  <div className="space-y-1">
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
                          className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-all ${
                            isActive
                              ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-50 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-50'
                          }`}
                        >
                          <span className="truncate">{subTitle}</span>
                          {isExternal && <ExternalLink className="w-3 h-3 opacity-50 flex-shrink-0 ml-auto" />}
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column */}
                <div className="p-4 border-t border-gray-200 dark:border-white/10">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2 border-b border-gray-200 dark:border-white/10 pb-2">
                    Bingi ku Kifuliiru
                  </h3>
                  <div className="space-y-1">
                    {right.map(([subKey, subItem]) => {
                      const subTitle = typeof subItem === 'string' ? subItem : subItem.title || subKey;
                      let subHref: string;
                      if (typeof subItem === 'object' && subItem.href) {
                        subHref = subItem.href;
                      } else {
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
                          className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-all ${
                            isActive
                              ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-50 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-50'
                          }`}
                        >
                          <span className="truncate">{subTitle}</span>
                          {isExternal && <ExternalLink className="w-3 h-3 opacity-50 flex-shrink-0 ml-auto" />}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-2 space-y-1">
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
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs rounded-md transition-all ${
                        isActive
                          ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-gray-50'
                      }`}
                    >
                      <span className="truncate">{subTitle}</span>
                      {isExternal && <ExternalLink className="w-3 h-3 opacity-50 flex-shrink-0 ml-auto" />}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderLanguageSelector = (key: string, item: NavItem) => {
    if (!item.items) return null;

    const currentLang = getCurrentLanguage();
    const currentFlag = getLanguageFlag(currentLang);
    const isOpen = openDropdown === key;
    const itemEntries = Object.entries(item.items);

    return (
      <div key={key} className="w-full">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : key)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium rounded-md transition-all text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-white/5"
        >
          <span className="text-lg">{currentFlag}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="mt-2 ml-4 bg-white dark:bg-slate-800/95 rounded-lg border border-gray-200 dark:border-white/20 overflow-hidden">
            <div className="py-2 space-y-1">
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
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs rounded-md transition-all ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-gray-50'
                    }`}
                  >
                    <span className="text-base">{flag}</span>
                    <span className="truncate">{subTitle}</span>
                  </a>
                );
              })}
            </div>
          </div>
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
          className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
            isActive
              ? 'text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-900'
              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-900'
          }`}
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
        className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
          isActive
            ? 'text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-900'
            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-900'
        }`}
      >
        {getIcon(key)}
        <span>{item.title}</span>
        {isExternal && <ExternalLink className="w-3 h-3 ml-1" />}
      </a>
    );
  };

  return (
    <div className="w-full">
      <nav className="flex flex-col gap-3 w-full" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
        {Object.entries(navItems).map(([key, item]) => (
          <div key={key} className="w-full block" style={{ width: '100%', display: 'block', flexShrink: 0 }}>
            {renderNavItem(key, item)}
          </div>
        ))}
      </nav>
    </div>
  );
}
