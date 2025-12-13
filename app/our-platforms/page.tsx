import React from 'react';
import SEO from '../../components/SEO';
import { ExternalLink } from 'lucide-react';

interface Platform {
  name: string;
  nameKifuliiru: string;
  url: string;
  description: string;
  descriptionKifuliiru: string;
}

const platforms: Platform[] = [
  {
    name: 'Kifuliiru Lab',
    nameKifuliiru: 'Kifuliiru Lab',
    url: 'https://kifuliiru.org',
    description: 'The main platform for Kifuliiru language resources and tools.',
    descriptionKifuliiru: 'Mukolwa mukulu wa Kifuliiru Language Platform. Iliri hano higulu lyo kubona abandu bitu na ngisi gundi yeshi uwangasima ukumenya bikingi ku ndeto yitu Kifuliiru.',
  },
  {
    name: 'Kifuliiru.com',
    nameKifuliiru: 'Kifuliiru.com',
    url: 'https://www.kifuliiru.com',
    description: 'The main website for Kifuliiru language learning and resources. Includes dictionary, verbs, proverbs, numbers, books, audio, and more.',
    descriptionKifuliiru: 'Mukolwa mukulu wa Kifuliiru Language Platform. Iliri hano higulu lyo kubona abandu bitu na ngisi gundi yeshi uwangasima ukumenya bikingi ku ndeto yitu Kifuliiru. Ikugwasa tumenye bingi ku amagambo, imikolwa, imigani, ukuharura, ibitaabo, amajwi, na bindi bingi.',
  },
  {
    name: 'Kifuliiru Dictionary',
    nameKifuliiru: 'Kifuliiru Dictionary',
    url: 'https://dictionary.kifuliiru.net/',
    description: 'Kifuliiru Public Dictionary - Search for words in Kifuliiru and translate to English, French, and Swahili. Includes verbs, proverbs, and numbers.',
    descriptionKifuliiru: 'Mukolwa wa amagambo ge\'Kifuliiru. Iliri hano higulu lyo kubona amagambo ge\'Kifuliiru na kuyihindura mu zindi ndeto nga English, Français, na Kiswahili. Ikugwasa tumenye bingi ku amagambo, imikolwa, imigani, na ukuharura.',
  },
  {
    name: 'imyazi.com',
    nameKifuliiru: 'imyazi.com',
    url: 'https://imyazi.com',
    description: 'A platform for Kifuliiru language resources and learning materials.',
    descriptionKifuliiru: 'Mukolwa wa Kifuliiru Language Platform. Iliri hano higulu lyo kubona abandu bitu na ngisi gundi yeshi uwangasima ukumenya bikingi ku ndeto yitu Kifuliiru.',
  },
  {
    name: 'Kifuliiru Books',
    nameKifuliiru: 'Kifuliiru Books',
    url: 'https://www.kifuliiru.com/books',
    description: 'Your gateway to language learning. Discover the largest collection of Kifuliiru language books online. Free digital library featuring language learning materials, cultural literature, and educational resources for all levels.',
    descriptionKifuliiru: 'Mukolwa wa ibitaabo bya Kifuliiru. Iliri hano higulu lyo kubona ibitaabo bya Kifuliiru byoshi. Ikugwasa tumenye bingi ku ibitaabo bya Kifuliiru byoshi, ibitaabo bya kuyigiriza, ibitaabo bya kumenya, na bindi bingi.',
  },
  {
    name: 'Kifuliiru Bookstore',
    nameKifuliiru: 'Kifuliiru Bookstore',
    url: 'https://www.kifuliiru.com/bookstore',
    description: 'Preserve culture and support creators. Discover books in Kifuliiru, English, French & Swahili. Categories include medicinal herbs, language learning, stories & folktales, cultural practices, traditional foods, and children\'s books.',
    descriptionKifuliiru: 'Mukolwa wa ibitaabo bya Kifuliiru. Iliri hano higulu lyo kugura ibitaabo bya Kifuliiru. Ikugwasa tumenye bingi ku ibitaabo bya Kifuliiru, English, Français, na Kiswahili.',
  },
  {
    name: 'Kifuliiru Audio',
    nameKifuliiru: 'Kifuliiru Audio',
    url: 'https://www.kifuliiru.com/audio',
    description: 'Audio Hub - Listen to Kifuliiru stories, conversations, and cultural content. Includes numbers & counting, music & songs, stories & tales, news & radio, conversations, language lessons, and cultural content.',
    descriptionKifuliiru: 'Mukolwa wa amajwi ge\'Kifuliiru. Iliri hano higulu lyo kumwumwa amajwi ge\'Kifuliiru. Ikugwasa tumenye bingi ku amajwi ge\'Kifuliiru, imigani, amagambo, ukuharura, na bindi bingi.',
  },
];

export default function OurPlatformsPage() {
  return (
    <>
      <SEO
        title="Mikolwa yitu yindi - Our Other Platforms"
        description="Discover other Kifuliiru language platforms and resources"
      />
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            Mikolwa yitu yindi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Our Other Platforms
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Tugweti mikolwa yindi yingi yitugwasa tumenye na tugendereze indeto yitu Kifuliiru. 
            Bino bikolwa byoshi bikolwa bya Kifuliiru Lab, bikugwasa tumenye bingi ku ndeto yitu na mu ndeto yitu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform) => (
            <div
              key={platform.url}
              className="border border-gray-200 dark:border-white/10 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-white/5"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                  {platform.nameKifuliiru}
                </h2>
                <ExternalLink className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" />
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                {platform.descriptionKifuliiru}
              </p>
              
              <p className="text-gray-500 dark:text-gray-500 mb-4 text-sm italic">
                {platform.description}
              </p>
              
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
              >
                <span>Visit Platform</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

