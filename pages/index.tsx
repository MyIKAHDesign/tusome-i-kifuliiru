import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, ArrowRight, Search } from 'lucide-react';
import PageNavigation from '../components/PageNavigation';

export default function Home() {
  const router = useRouter();

  const handleStartLearning = () => {
    router.push('/docs');
  };

  const handleBrowseDocs = () => {
    router.push('/docs');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Learn Kifuliiru Language</span>
          </div>
          
          {/* Flag Image */}
          <div className="flex justify-center mb-6">
            <Image
              src="/.github/DRCongo.png"
              alt="DR Congo Flag"
              width={400}
              height={267}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Tusome i Kifuliiru
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover and learn the Kifuliiru language. A comprehensive platform for learners, students, and teachers to explore this beautiful language spoken in the Eastern DRC.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16">
            <button
              onClick={handleStartLearning}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-medium text-sm rounded-md shadow-sm hover:shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleBrowseDocs}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium text-sm rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 shadow-sm hover:shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Search className="w-4 h-4" />
              Browse Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Gwajiika Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Ndondeezo</h2>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Mu kihugo kya zene, abandu booshi bagweti bagakola kwoshi bashobwiri higulu lyo' kudeta kwo bazamuule indeto zabo. Mu bindu bihamu ibija ku ndeto ne'byangatuma indeto igasikama inamale ne' kyanya kingi halinde ihikire ibibusi ibigayija, haliri ukusome no kusomeesa iyo ndeto. Ukusomeesa kwoshi ngisi kwo kwangaba kuliri kusoma nakwo, nga ngisi kwo tumubwirwa na'bakoli komiri ukusomeesa. Umuundu ugasomesa i Kifuliiru, akwaniini atebera ayiji bingi mu ino ndeto.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            Abandu bingi batayiji kwo ikyanya indeto yayandikwa bimutuma igasikama, inagire ikise, inalonge injira yo'kulama. Ku balya ngisi kera abasobanukirwa yibyo bagweti bagakola higulu indeto zaabo zitatereeke. Na nitu ku Kifuliiru tugweti tugakola ngisi kwo tushobwiri, higulu indeto yitu Kifuliiru itakengeri lenga nga mbusi.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Hayi tugasomera?</h2>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Ukudeta kwo utole ngisi byo ugasoma, lenga yaho higulu mu menu, utole i menu Tusome kandi li ulenge uhume hano tugakutwala ku <Link href="/docs/ndondeero_tusome" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Ndondeero yo'kusoma</Link>.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Kongwa. Tuyegerere tweeshi.
          </p>
        </div>
        
        {/* Page Navigation */}
        <div className="mt-12">
          <PageNavigation currentSlug="" />
        </div>
      </section>
    </>
  );
}
