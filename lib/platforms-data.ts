export interface Platform {
  id: string;
  name: string;
  nameKifuliiru: string;
  url: string;
  description: string;
  descriptionKifuliiru: string;
  detailedDescription?: string;
  detailedDescriptionKifuliiru?: string;
  features?: string[];
  featuresKifuliiru?: string[];
}

export const platforms: Platform[] = [
  {
    id: 'kifuliiru-lab',
    name: 'Kifuliiru Lab',
    nameKifuliiru: 'Kifuliiru Lab',
    url: 'https://kifuliiru.org',
    description: 'The main platform for Kifuliiru language resources and tools.',
    descriptionKifuliiru: 'Mukolwa mukulu wa Kifuliiru Language Platform. Iliri hano higulu lyo kubona abandu bitu na ngisi gundi yeshi uwangasima ukumenya bikingi ku ndeto yitu Kifuliiru.',
    detailedDescription: 'Kifuliiru Lab is the main platform for Kifuliiru language resources and tools. It serves as the central hub for all Kifuliiru language initiatives and provides access to various learning resources, tools, and community features.',
    detailedDescriptionKifuliiru: 'Kifuliiru Lab iliri mukolwa mukulu wa Kifuliiru Language Platform. Iliri hano higulu lyo kubona abandu bitu na ngisi gundi yeshi uwangasima ukumenya bikingi ku ndeto yitu Kifuliiru. Ikugwasa tumenye bingi ku mikolwa yitu yoshi.',
  },
  {
    id: 'kifuliiru-com',
    name: 'Kifuliiru.com',
    nameKifuliiru: 'Kifuliiru.com',
    url: 'https://www.kifuliiru.com',
    description: 'The main website for Kifuliiru language learning and resources. Includes dictionary, verbs, proverbs, numbers, books, audio, and more.',
    descriptionKifuliiru: 'Mukolwa mukulu wa Kifuliiru Language Platform. Iliri hano higulu lyo kubona abandu bitu na ngisi gundi yeshi uwangasima ukumenya bikingi ku ndeto yitu Kifuliiru. Ikugwasa tumenye bingi ku amagambo, imikolwa, imigani, ukuharura, ibitaabo, amajwi, na bindi bingi.',
    detailedDescription: 'Kifuliiru.com is the comprehensive website for Kifuliiru language learning and resources. It includes a dictionary, verb conjugations, proverbs, number guides, books, audio content, and many other learning tools. This is the main hub for all Kifuliiru language resources.',
    detailedDescriptionKifuliiru: 'Kifuliiru.com iliri mukolwa mukulu wa Kifuliiru Language Platform. Iliri hano higulu lyo kubona abandu bitu na ngisi gundi yeshi uwangasima ukumenya bikingi ku ndeto yitu Kifuliiru. Ikugwasa tumenye bingi ku amagambo, imikolwa, imigani, ukuharura, ibitaabo, amajwi, na bindi bingi.',
    features: [
      'Dictionary with translations',
      'Verb conjugations',
      'Proverbs collection',
      'Number guides',
      'Books library',
      'Audio content',
      'Language learning tools',
    ],
    featuresKifuliiru: [
      'Amagambo na kuyihindura',
      'Imikolwa',
      'Imigani',
      'Ukuharura',
      'Ibitabo',
      'Amajwi',
      'Mikolwa ya kuyigiriza',
    ],
  },
  {
    id: 'kifuliiru-dictionary',
    name: 'Kifuliiru Dictionary',
    nameKifuliiru: 'Kifuliiru Dictionary',
    url: 'https://dictionary.kifuliiru.net/',
    description: 'Kifuliiru Public Dictionary - Search for words in Kifuliiru and translate to English, French, and Swahili. Includes verbs, proverbs, and numbers.',
    descriptionKifuliiru: 'Mukolwa wa amagambo ge\'Kifuliiru. Iliri hano higulu lyo kubona amagambo ge\'Kifuliiru na kuyihindura mu zindi ndeto nga English, Français, na Kiswahili. Ikugwasa tumenye bingi ku amagambo, imikolwa, imigani, na ukuharura.',
    detailedDescription: 'The Kifuliiru Public Dictionary is a comprehensive dictionary that allows you to search for words in Kifuliiru and translate them to English, French, and Swahili. It includes extensive word lists, verb conjugations, proverbs, and number translations. Perfect for learners at all levels.',
    detailedDescriptionKifuliiru: 'Kifuliiru Dictionary iliri mukolwa wa amagambo ge\'Kifuliiru. Iliri hano higulu lyo kubona amagambo ge\'Kifuliiru na kuyihindura mu zindi ndeto nga English, Français, na Kiswahili. Ikugwasa tumenye bingi ku amagambo, imikolwa, imigani, na ukuharura.',
    features: [
      'Word search in Kifuliiru',
      'Translations to English, French, Swahili',
      'Verb conjugations',
      'Proverbs collection',
      'Number translations',
      'Word of the day',
      'Recent additions',
    ],
    featuresKifuliiru: [
      'Kuharura amagambo mu Kifuliiru',
      'Kuyihindura mu English, Français, Kiswahili',
      'Imikolwa',
      'Imigani',
      'Ukuharura',
      'Ijambo rya munsi',
      'Amagambo mashasha',
    ],
  },
  {
    id: 'imyazi',
    name: 'imyazi.com',
    nameKifuliiru: 'imyazi.com',
    url: 'https://imyazi.com',
    description: 'A platform for Kifuliiru language resources and learning materials.',
    descriptionKifuliiru: 'Mukolwa wa Kifuliiru Language Platform. Iliri hano higulu lyo kubona abandu bitu na ngisi gundi yeshi uwangasima ukumenya bikingi ku ndeto yitu Kifuliiru.',
    detailedDescription: 'imyazi.com is a platform dedicated to Kifuliiru language resources and learning materials. It provides various tools and content to help learners understand and use the Kifuliiru language effectively.',
    detailedDescriptionKifuliiru: 'imyazi.com iliri mukolwa wa Kifuliiru Language Platform. Iliri hano higulu lyo kubona abandu bitu na ngisi gundi yeshi uwangasima ukumenya bikingi ku ndeto yitu Kifuliiru.',
  },
  {
    id: 'kifuliiru-books',
    name: 'Kifuliiru Books',
    nameKifuliiru: 'Kifuliiru Books',
    url: 'https://www.kifuliiru.com/books',
    description: 'Your gateway to language learning. Discover the largest collection of Kifuliiru language books online. Free digital library featuring language learning materials, cultural literature, and educational resources for all levels.',
    descriptionKifuliiru: 'Mukolwa wa ibitaabo bya Kifuliiru. Iliri hano higulu lyo kubona ibitaabo bya Kifuliiru byoshi. Ikugwasa tumenye bingi ku ibitaabo bya Kifuliiru byoshi, ibitaabo bya kuyigiriza, ibitaabo bya kumenya, na bindi bingi.',
    detailedDescription: 'Kifuliiru Books is your gateway to language learning. It features the largest collection of Kifuliiru language books available online. The free digital library includes language learning materials, cultural literature, and educational resources suitable for all levels - from beginners to advanced learners.',
    detailedDescriptionKifuliiru: 'Kifuliiru Books iliri mukolwa wa ibitaabo bya Kifuliiru. Iliri hano higulu lyo kubona ibitaabo bya Kifuliiru byoshi. Ikugwasa tumenye bingi ku ibitaabo bya Kifuliiru byoshi, ibitaabo bya kuyigiriza, ibitaabo bya kumenya, na bindi bingi.',
    features: [
      '8+ free books available',
      'Multiple languages supported',
      'Language learning materials',
      'Cultural literature',
      'Educational resources',
      'Free downloads',
      'PDF and DOCX formats',
    ],
    featuresKifuliiru: [
      'Ibitabo 8+ bya mahala',
      'Zindi ndeto zingi',
      'Ibitabo bya kuyigiriza',
      'Ibitabo bya kumenya',
      'Ibitabo bya kumenya',
      'Kugura mahala',
      'PDF na DOCX',
    ],
  },
  {
    id: 'kifuliiru-bookstore',
    name: 'Kifuliiru Bookstore',
    nameKifuliiru: 'Kifuliiru Bookstore',
    url: 'https://www.kifuliiru.com/bookstore',
    description: 'Preserve culture and support creators. Discover books in Kifuliiru, English, French & Swahili. Categories include medicinal herbs, language learning, stories & folktales, cultural practices, traditional foods, and children\'s books.',
    descriptionKifuliiru: 'Mukolwa wa ibitaabo bya Kifuliiru. Iliri hano higulu lyo kugura ibitaabo bya Kifuliiru. Ikugwasa tumenye bingi ku ibitaabo bya Kifuliiru, English, Français, na Kiswahili.',
    detailedDescription: 'The Kifuliiru Bookstore is dedicated to preserving culture and supporting creators. Discover a wide variety of books in Kifuliiru, English, French, and Swahili. Categories include medicinal herbs, language learning materials, stories & folktales, cultural practices, traditional foods, and children\'s books.',
    detailedDescriptionKifuliiru: 'Kifuliiru Bookstore iliri mukolwa wa ibitaabo bya Kifuliiru. Iliri hano higulu lyo kugura ibitaabo bya Kifuliiru. Ikugwasa tumenye bingi ku ibitaabo bya Kifuliiru, English, Français, na Kiswahili.',
    features: [
      'Books in multiple languages',
      'Medicinal herbs guides',
      'Language learning books',
      'Stories & folktales',
      'Cultural practices',
      'Traditional foods',
      'Children\'s books',
    ],
    featuresKifuliiru: [
      'Ibitabo mu zindi ndeto zingi',
      'Ibitabo bya imiti',
      'Ibitabo bya kuyigiriza',
      'Imigani na imigani',
      'Imikolwa ya kumenya',
      'Ibyakulya bya kera',
      'Ibitabo bya abaana',
    ],
  },
  {
    id: 'kifuliiru-audio',
    name: 'Kifuliiru Audio',
    nameKifuliiru: 'Kifuliiru Audio',
    url: 'https://www.kifuliiru.com/audio',
    description: 'Audio Hub - Listen to Kifuliiru stories, conversations, and cultural content. Includes numbers & counting, music & songs, stories & tales, news & radio, conversations, language lessons, and cultural content.',
    descriptionKifuliiru: 'Mukolwa wa amajwi ge\'Kifuliiru. Iliri hano higulu lyo kumwumwa amajwi ge\'Kifuliiru. Ikugwasa tumenye bingi ku amajwi ge\'Kifuliiru, imigani, amagambo, ukuharura, na bindi bingi.',
    detailedDescription: 'Kifuliiru Audio is an audio hub where you can listen to Kifuliiru stories, conversations, and cultural content. It includes numbers & counting exercises, music & songs, stories & tales, news & radio content, conversations, language lessons, and various cultural content. Perfect for improving pronunciation and listening skills.',
    detailedDescriptionKifuliiru: 'Kifuliiru Audio iliri mukolwa wa amajwi ge\'Kifuliiru. Iliri hano higulu lyo kumwumwa amajwi ge\'Kifuliiru. Ikugwasa tumenye bingi ku amajwi ge\'Kifuliiru, imigani, amagambo, ukuharura, na bindi bingi.',
    features: [
      'Numbers & counting audio',
      'Music & songs',
      'Stories & tales',
      'News & radio',
      'Conversations',
      'Language lessons',
      'Cultural content',
      'Immersive mode',
    ],
    featuresKifuliiru: [
      'Amajwi ge\'ukuharura',
      'Amajwi ge\'muziki',
      'Imigani',
      'Amajwi ge\'habari',
      'Amagambo',
      'Amajwi ge\'kuyigiriza',
      'Amajwi ge\'kumenya',
      'Immersive mode',
    ],
  },
];

export function getPlatformById(id: string): Platform | undefined {
  return platforms.find(p => p.id === id);
}

export function getPlatformBySlug(slug: string): Platform | undefined {
  return platforms.find(p => p.id === slug);
}

