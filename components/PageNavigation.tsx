import React from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllContentSlugs } from '../lib/content-loader';

interface PageNavigationProps {
  currentSlug?: string;
}

// Define the navigation order based on _meta.json structure
const getNavigationOrder = (): string[] => {
  const order: string[] = [];
  
  // 1. Muyegerere (homepage)
  order.push('');
  
  // 2. Ndondeero Tusome (Menya bino)
  order.push('ndondeero_tusome');
  
  // 3. Ukuharura - Numbers section
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
  
  // 4. Kuharura Ibiindu section
  order.push('harura');
  order.push('ukuharura/ibindu');
  order.push('ukuharura/abandu');
  order.push('ukuharura/binamishwa');
  order.push('ukuharura/bihumbi-bingi');
  
  // 5. Amagambo section
  order.push('amagambo/ndondeero-amagambo');
  order.push('amagambo/ulufwabe');
  order.push('amagambo/herufi');
  order.push('amagambo/amagambo');
  order.push('amagambo/buniini-bwingi');
  order.push('amagambo/abaana');
  
  // 6. Kifuliiru
  order.push('kifuliiru');
  
  // 7. Imigani
  order.push('imigani');
  
  // 8. Imigeeza
  order.push('imigeeza');
  
  // 9. Imwitu section
  order.push('imwitu/ibufuliiru');
  order.push('imwitu/imigazi');
  order.push('imwitu/inyiji');
  order.push('imwitu/utwaya');
  
  // 10. Bingi ku Kifuliiru section
  order.push('bingi-ku-kifuliiru/amagambo');
  order.push('bingi-ku-kifuliiru/bitaabo-bya-bafuliiru');
  order.push('bingi-ku-kifuliiru/imikolwa');
  order.push('bingi-ku-kifuliiru/invumo');
  order.push('bingi-ku-kifuliiru/ibinamishwa-mu-kifuliiru');
  order.push('bingi-ku-kifuliiru/ibufuliiru.com');
  order.push('bingi-ku-kifuliiru/tuganule-i-kifuliiru');
  order.push('bingi-ku-kifuliiru/ibiyandike-mu-kifuliiru');
  
  // 11. Twehe section
  order.push('twehe/twehe');
  order.push('twehe/umwandisi');
  
  // 12. ENG/SWA/FRN section
  order.push('eng-frn-swa/kiswahili');
  order.push('eng-frn-swa/english');
  order.push('eng-frn-swa/francais');
  order.push('eng-frn-swa/tukole');
  
  return order;
};

const getPageTitle = (slug: string): string => {
  if (slug === '') return 'Muyegerere';
  if (slug === 'ndondeero_tusome') return 'Menya bino';
  if (slug === 'kifuliiru') return 'Kifuliiru';
  if (slug === 'imigani') return 'Imigani';
  if (slug === 'imigeeza') return 'Imigeeza';
  if (slug === 'harura') return 'Kuharura';
  
  // Ukuharura pages
  if (slug.startsWith('ukuharura/')) {
    const lastPart = slug.split('/')[1];
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
      'bihumbi-ikumi-na-kiguma': 'Bihumbi ikumi na kiguma',
      'bihumbi-ikumi-na-bibiri': 'Bihumbi ikumi na bibiri',
      'bihumbi-ikumi-na-bishatu': 'Bihumbi ikumi na bishatu',
      'bihumbi-ikumi-na-bina': 'Bihumbi ikumi na bina',
      'bihumbi-ikumi-na-bitanu': 'Bihumbi ikumi na bitanu',
      'bihumbi-ikumi-na-ndatu': 'Bihumbi ikumi na ndatu',
      'bihumbi-ikumi-na-biriinda': 'Bihumbi ikumi na biriinda',
      'bihumbi-ikumi-na-munaana': 'Bihumbi ikumi na munaana',
      'bihumbi-ikumi-na-mweenda': 'Bihumbi ikumi na mweenda',
      'bihumbi-makumi-gabiri': 'Bihumbi makumi gabiri',
      'bihumbi-makumi-gabiri-na-kiguma': 'Bihumbi makumi gabiri na kiguma',
      'bihumbi-makumi-gabiri-na-bibiri': 'Bihumbi makumi gabiri na bibiri',
      'bihumbi-makumi-gabiri-na-bishatu': 'Bihumbi makumi gabiri na bishatu',
      'bihumbi-makumi-gabiri-na-bina': 'Bihumbi makumi gabiri na bina',
      'bihumbi-makumi-gabiri-na-bitanu': 'Bihumbi makumi gabiri na bitanu',
      'bihumbi-makumi-gabiri-na-ndatu': 'Bihumbi makumi gabiri na ndatu',
      'bihumbi-makumi-gabiri-na-birinda': 'Bihumbi makumi gabiri na biriinda',
      'bihumbi-makumi-gabiri-na-munaana': 'Bihumbi makumi gabiri na munaana',
      'bihumbi-makumi-gabiri-na-mweenda': 'Bihumbi makumi gabiri na mweenda',
      'bihumbi-makumi-gashatu': 'Bihumbi makumi gashatu',
      'bihumbi-makumi-gana': 'Bihumbi makumi gana',
      'bihumbi-makumi-gatanu': 'Bihumbi makumi gatanu',
      'bihumbi-makumi-galindatu': 'Bihumbi makumi galindatu',
      'bihumbi-makumi-galiinda': 'Bihumbi makumi galiinda',
      'bihumbi-makumi-galimunaana': 'Bihumbi makumi galimunaana',
      'bihumbi-makumi-galimweenda': 'Bihumbi makumi galimweenda',
      'bihumbi-igana': 'Bihumbi igana',
      'bihumbi-magana-gabiri': 'Bihumbi magana gabiri',
      'bihumbi-magana-gashatu': 'Bihumbi magana gashatu',
      'bihumbi-magana-gana': 'Bihumbi magana gana',
      'bihumbi-magana-gatanu': 'Bihumbi magana gatanu',
      'bihumbi-magana-galindatu': 'Bihumbi magana galindatu',
      'bihumbi-magana-galiinda': 'Bihumbi magana galiinda',
      'bihumbi-magana-galimunaana': 'Bihumbi magana galimunaana',
      'bihumbi-magana-galimweenda': 'Bihumbi magana galimweenda',
      'umulyoni': 'Umulyoni',
      'umulyari': 'Umulyari',
      'umulyari-muguma': 'Umulyari muguma',
      'bihumbi-bingi': 'Bihumbi bingi',
      'abandu': 'Abaandu',
      'ibindu': 'Ibindu',
      'binamishwa': 'Ibinamishwa',
    };
    return titleMap[lastPart] || lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  // Amagambo pages
  if (slug.startsWith('amagambo/')) {
    const lastPart = slug.split('/')[1];
    const titleMap: Record<string, string> = {
      'ndondeero-amagambo': 'Menya bino',
      'ulufwabe': 'Ulufwabe lwe\'Kifuliiru',
      'herufi': 'Herufi ze\'Kifuliiru',
      'amagambo': 'Amagambo',
      'buniini-bwingi': 'Ubuniini no\'bwingi',
      'abaana': 'Abaana',
    };
    return titleMap[lastPart] || lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  // Imwitu pages
  if (slug.startsWith('imwitu/')) {
    const lastPart = slug.split('/')[1];
    const titleMap: Record<string, string> = {
      'ibufuliiru': 'Ibufuliiru',
      'imigazi': 'Imigazi',
      'inyiji': 'Inyiji',
      'utwaya': 'Utwaya',
    };
    return titleMap[lastPart] || lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  // Bingi ku Kifuliiru pages
  if (slug.startsWith('bingi-ku-kifuliiru/')) {
    const lastPart = slug.split('/')[1];
    const titleMap: Record<string, string> = {
      'amagambo': 'Amagambo ge\'Kifuliiru',
      'bitaabo-bya-bafuliiru': 'Ibitaabo bya\'Bafuliiru',
      'imikolwa': 'Imikolwa',
      'invumo': 'Ukufuma mu Kifuliiru',
      'ibinamishwa-mu-kifuliiru': 'Ibinamishwa mu Kifuliiru',
      'ibufuliiru.com': 'Ibufuliiru.com',
      'tuganule-i-kifuliiru': 'Tuganuule i Kifuliiru',
      'ibiyandike-mu-kifuliiru': 'Ibiyandike mu Kifuliiru',
    };
    return titleMap[lastPart] || lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  // Twehe pages
  if (slug.startsWith('twehe/')) {
    const lastPart = slug.split('/')[1];
    const titleMap: Record<string, string> = {
      'twehe': 'Guno mukolwa',
      'umwandisi': 'Umwandisi',
    };
    return titleMap[lastPart] || lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  // ENG/SWA/FRN pages
  if (slug.startsWith('eng-frn-swa/')) {
    const lastPart = slug.split('/')[1];
    const titleMap: Record<string, string> = {
      'kiswahili': 'Kiswahili',
      'english': 'English',
      'francais': 'Français',
      'tukole': 'Tukole',
    };
    return titleMap[lastPart] || lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  return slug;
};

export default function PageNavigation({ currentSlug }: PageNavigationProps) {
  const router = useRouter();
  const navigationOrder = getNavigationOrder();
  
  // Get current slug from router if not provided
  const routerSlug = router.asPath.split('?')[0].replace(/^\//, '').replace(/\/$/, '') || '';
  const slug = currentSlug !== undefined ? currentSlug : routerSlug;
  
  // Normalize current slug (handle both 'index' and '' for homepage)
  const normalizedSlug = slug === 'index' ? '' : slug;
  
  const currentIndex = navigationOrder.findIndex(slug => slug === normalizedSlug);
  
  const prevSlug = currentIndex > 0 ? navigationOrder[currentIndex - 1] : null;
  const nextSlug = currentIndex < navigationOrder.length - 1 ? navigationOrder[currentIndex + 1] : null;
  
  const getHref = (slug: string): string => {
    if (slug === '') return '/';
    return `/${slug}`;
  };
  
  if (!prevSlug && !nextSlug) {
    return null;
  }
  
  return (
    <>
      {/* Previous Button - Left Side */}
      {prevSlug && (
        <div className="fixed left-8 lg:left-[calc((100vw-1024px)/2-80px)] top-1/2 -translate-y-1/2 z-40">
          <a
            href={getHref(prevSlug)}
            onClick={(e) => {
              e.preventDefault();
              router.push(getHref(prevSlug));
            }}
            className="group flex items-center gap-2 px-4 py-3 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 rounded-lg bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-xl backdrop-blur-sm"
            title={getPageTitle(prevSlug)}
          >
            <ChevronLeft className="w-4 h-4 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform text-gray-500 dark:text-gray-400" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Previous</span>
              <span className="hidden sm:inline truncate max-w-[100px] text-sm font-medium">{getPageTitle(prevSlug)}</span>
              <span className="sm:hidden text-sm font-medium">Prev</span>
            </div>
          </a>
        </div>
      )}
      
      {/* Next Button - Right Side */}
      {nextSlug && (
        <div className="fixed right-8 lg:right-[calc((100vw-1024px)/2-80px)] top-1/2 -translate-y-1/2 z-40">
          <a
            href={getHref(nextSlug)}
            onClick={(e) => {
              e.preventDefault();
              router.push(getHref(nextSlug));
            }}
            className="group flex items-center gap-2 px-4 py-3 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 rounded-lg bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-xl backdrop-blur-sm"
            title={getPageTitle(nextSlug)}
          >
            <div className="flex flex-col min-w-0 text-right">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Next</span>
              <span className="hidden sm:inline truncate max-w-[100px] text-sm font-medium">{getPageTitle(nextSlug)}</span>
              <span className="sm:hidden text-sm font-medium">Next</span>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform text-gray-500 dark:text-gray-400" />
          </a>
        </div>
      )}
    </>
  );
}

