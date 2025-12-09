import React from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllContentSlugs } from '../lib/content-loader';

interface PageNavigationProps {
  currentSlug: string;
}

// Define the navigation order
const getNavigationOrder = (): string[] => {
  const order: string[] = [];
  
  // 1. Muyegerere (homepage)
  order.push('');
  
  // 2. Gwajiika
  order.push('gwajiika');
  
  // 3. Menya bino
  order.push('ndondeero_tusome');
  
  // 4. Ukuharura mu Kifuliiru and all its pages
  order.push('ukuharura/ndondeero');
  order.push('ukuharura/zero-ku-ikumi');
  order.push('ukuharura/ikumi-ku-igana');
  order.push('ukuharura/igana-ku-kihumbi');
  order.push('ukuharura/igana');
  order.push('ukuharura/magana-gabiri');
  order.push('ukuharura/magana-gashatu');
  order.push('ukuharura/magana-gana');
  order.push('ukuharura/magana-gatanu');
  order.push('ukuharura/magana-galindatu');
  order.push('ukuharura/magana-galinda');
  order.push('ukuharura/magana-galimunaana');
  order.push('ukuharura/magana-galimweenda');
  order.push('ukuharura/kihumbi-no-kuzamuuka');
  order.push('ukuharura/kihumbi');
  order.push('ukuharura/bihumbi-bibiri');
  order.push('ukuharura/bihumbi-bishatu');
  order.push('ukuharura/bihumbi-bina');
  order.push('ukuharura/bihumbi-bitanu');
  order.push('ukuharura/bihumbi-ndatu');
  order.push('ukuharura/bihumbi-birinda');
  order.push('ukuharura/bihumbi-munaana');
  order.push('ukuharura/bihumbi-mweenda');
  order.push('ukuharura/bihumbi-ikumi');
  order.push('ukuharura/bihumbi-ikumi-na-kiguma');
  order.push('ukuharura/bihumbi-ikumi-na-bibiri');
  order.push('ukuharura/bihumbi-ikumi-na-bishatu');
  order.push('ukuharura/bihumbi-ikumi-na-bina');
  order.push('ukuharura/bihumbi-ikumi-na-bitanu');
  order.push('ukuharura/bihumbi-ikumi-na-ndatu');
  order.push('ukuharura/bihumbi-ikumi-na-biriinda');
  order.push('ukuharura/bihumbi-ikumi-na-munaana');
  order.push('ukuharura/bihumbi-ikumi-na-mweenda');
  order.push('ukuharura/bihumbi-makumi-gabiri');
  order.push('ukuharura/bihumbi-makumi-gabiri-na-kiguma');
  order.push('ukuharura/bihumbi-makumi-gabiri-na-bibiri');
  order.push('ukuharura/bihumbi-makumi-gabiri-na-bishatu');
  order.push('ukuharura/bihumbi-makumi-gabiri-na-bina');
  order.push('ukuharura/bihumbi-makumi-gabiri-na-bitanu');
  order.push('ukuharura/bihumbi-makumi-gabiri-na-ndatu');
  order.push('ukuharura/bihumbi-makumi-gabiri-na-birinda');
  order.push('ukuharura/bihumbi-makumi-gabiri-na-munaana');
  order.push('ukuharura/bihumbi-makumi-gabiri-na-mweenda');
  order.push('ukuharura/bihumbi-makumi-gashatu');
  order.push('ukuharura/bihumbi-makumi-gana');
  order.push('ukuharura/bihumbi-makumi-gatanu');
  order.push('ukuharura/bihumbi-makumi-galindatu');
  order.push('ukuharura/bihumbi-makumi-galiinda');
  order.push('ukuharura/bihumbi-makumi-galimunaana');
  order.push('ukuharura/bihumbi-makumi-galimweenda');
  order.push('ukuharura/bihumbi-igana');
  order.push('ukuharura/bihumbi-magana-gabiri');
  order.push('ukuharura/bihumbi-magana-gashatu');
  order.push('ukuharura/bihumbi-magana-gana');
  order.push('ukuharura/bihumbi-magana-gatanu');
  order.push('ukuharura/bihumbi-magana-galindatu');
  order.push('ukuharura/bihumbi-magana-galiinda');
  order.push('ukuharura/bihumbi-magana-galimunaana');
  order.push('ukuharura/bihumbi-magana-galimweenda');
  order.push('ukuharura/umulyoni');
  order.push('ukuharura/umulyari');
  order.push('ukuharura/umulyari-muguma');
  order.push('ukuharura/bihumbi-bingi');
  order.push('ukuharura/abandu');
  order.push('ukuharura/ibindu');
  order.push('ukuharura/binamishwa');
  
  // 5. Tusome Amagambo
  order.push('amagambo');
  
  return order;
};

const getPageTitle = (slug: string): string => {
  if (slug === '') return 'Muyegerere';
  if (slug === 'gwajiika') return 'Gwajiika';
  if (slug === 'ndondeero_tusome') return 'Menya bino';
  if (slug === 'amagambo') return 'Tusome Amagambo';
  
  // For ukuharura pages, try to get title from meta.json
  if (slug.startsWith('ukuharura/')) {
    try {
      // This will be loaded client-side, so we'll use a simple approach
      const parts = slug.split('/');
      const lastPart = parts[parts.length - 1];
      
      // Common ukuharura titles mapping
      const titleMap: Record<string, string> = {
        'ndondeero': 'Ndondero',
        'zero-ku-ikumi': 'Ubusha kuhisa ku ikumi',
        'ikumi-ku-igana': 'Ikumi ukuhisa ku igana',
        'igana-ku-kihumbi': 'Igana kuhisa ku kihumbi',
        'igana': 'Igana',
        'magana-gabiri': 'Magana gabiri',
        'magana-gashatu': 'Magana gashatu',
        'magana-gana': 'Magana gana',
        'magana-gatanu': 'Magana gatanu',
        'magana-galindatu': 'Magana galidatu',
        'magana-galinda': 'Magana galiinda',
        'magana-galimunaana': 'Magana galimunaana',
        'magana-galimweenda': 'Magana galimweenda',
        'kihumbi-no-kuzamuuka': 'Ikihumbi no kuzamuuka',
        'kihumbi': 'Kihumbi',
        'bihumbi-bibiri': 'Bihumbi bibiri',
        'bihumbi-bishatu': 'Bihumbi bishatu',
        'bihumbi-bina': 'Bihumbi bina',
        'bihumbi-bitanu': 'Bihumbi bitanu',
        'bihumbi-ndatu': 'Bihumbi ndatu',
        'bihumbi-birinda': 'Bihumbi birinda',
        'bihumbi-munaana': 'Bihumbi munaana',
        'bihumbi-mweenda': 'Bihumbi mweenda',
        'bihumbi-ikumi': 'Bihumbi ikumi',
        'umulyoni': 'Umulyoni',
        'umulyari': 'Umulyari',
        'umulyari-muguma': 'Umulyari muguma',
        'bihumbi-bingi': 'Bihumbi bingi',
        'abandu': 'Abaandu',
        'ibindu': 'Ibindu',
        'binamishwa': 'Ibinamishwa',
      };
      
      return titleMap[lastPart] || lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    } catch {
      const parts = slug.split('/');
      const lastPart = parts[parts.length - 1];
      return lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  }
  
  return slug;
};

export default function PageNavigation({ currentSlug }: PageNavigationProps) {
  const router = useRouter();
  const navigationOrder = getNavigationOrder();
  
  // Normalize current slug (handle both 'index' and '' for homepage)
  const normalizedSlug = currentSlug === 'index' ? '' : currentSlug;
  
  const currentIndex = navigationOrder.findIndex(slug => slug === normalizedSlug);
  
  const prevSlug = currentIndex > 0 ? navigationOrder[currentIndex - 1] : null;
  const nextSlug = currentIndex < navigationOrder.length - 1 ? navigationOrder[currentIndex + 1] : null;
  
  const getHref = (slug: string): string => {
    if (slug === '') return '/';
    if (slug === 'gwajiika') return '/gwajiika';
    return `/${slug}`;
  };
  
  if (!prevSlug && !nextSlug) {
    return null;
  }
  
  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between gap-6">
        {prevSlug ? (
          <a
            href={getHref(prevSlug)}
            onClick={(e) => {
              e.preventDefault();
              router.push(getHref(prevSlug));
            }}
            className="group flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 flex-1 max-w-xs"
          >
            <ChevronLeft className="w-4 h-4 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform text-gray-500 dark:text-gray-400" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Previous</span>
              <span className="truncate font-medium text-base">{getPageTitle(prevSlug)}</span>
            </div>
          </a>
        ) : (
          <div className="flex-1" />
        )}
        
        {nextSlug && (
          <a
            href={getHref(nextSlug)}
            onClick={(e) => {
              e.preventDefault();
              router.push(getHref(nextSlug));
            }}
            className="group flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 flex-1 max-w-xs ml-auto text-right"
          >
            <div className="flex flex-col min-w-0 flex-1 text-right">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Next</span>
              <span className="truncate font-medium text-base">{getPageTitle(nextSlug)}</span>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform text-gray-500 dark:text-gray-400" />
          </a>
        )}
      </div>
    </div>
  );
}

