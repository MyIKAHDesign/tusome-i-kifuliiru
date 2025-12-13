import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, ArrowRight, Info } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Tusome i Kifuliiru</span>
          </div>
          
          {/* Flag Image */}
          <div className="flex justify-center mb-6 px-4">
            <div className="relative inline-block max-w-full">
              <div className="relative">
                {/* Image */}
                <div className="relative rounded-[1.5rem] overflow-hidden">
                  <Image
                    src="/.github/DRCongo.png"
                    alt="DR Congo Flag"
                    width={400}
                    height={267}
                    className="rounded-[1.5rem] object-cover w-full h-auto"
                    priority
                  />
                  
                  {/* Glow effect around the flag content only, using flag colors - Blue, Yellow, Red */}
                  <div className="absolute inset-[2%] -inset-[0.5rem] bg-gradient-to-br from-blue-500/12 via-yellow-400/10 to-red-500/12 blur-2xl rounded-[1.2rem] dark:from-blue-500/10 dark:via-yellow-400/8 dark:to-red-500/10 pointer-events-none" style={{ zIndex: -1 }}></div>
                  <div className="absolute inset-[2%] -inset-[0.4rem] bg-gradient-to-tr from-blue-400/10 via-yellow-300/8 to-red-400/10 blur-xl rounded-[1.2rem] dark:from-blue-400/8 dark:via-yellow-300/6 dark:to-red-400/8 pointer-events-none" style={{ zIndex: -1 }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Gwajiika Content - Hero Text */}
          <div className="text-left max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">Muyegerere</h2>
            
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Mu kihugo kya zene, abandu booshi bagweti bagakola kwoshi bashobwiri higulu lyo' kudeta kwo bazamuule indeto zabo. Mu bindu bihamu ibija ku ndeto ne'byangatuma indeto igasikama inamale ne' kyanya kingi halinde ihikire ibibusi ibigayija, haliri ukusome no kusomeesa iyo ndeto. Ukusomeesa kwoshi ngisi kwo kwangaba kuliri kusoma nakwo, nga ngisi kwo tumubwirwa na'bakoli komiri ukusomeesa. Umuundu ugasomesa i Kifuliiru, akwaniini atebera ayiji bingi mu ino ndeto.
            </p>
            
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              Abandu bingi batayiji kwo ikyanya indeto yayandikwa bimutuma igasikama, inagire ikise, inalonge injira yo'kulama. Ku balya ngisi kera abasobanukirwa yibyo bagweti bagakola higulu indeto zaabo zitatereeke. Na nitu ku Kifuliiru tugweti tugakola ngisi kwo tushobwiri, higulu indeto yitu Kifuliiru itakengeri lenga nga mbusi.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">Hayi tugasomera?</h2>
            
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Ukudeta kwo utole ngisi byo ugasoma, lenga yaho higulu mu menu, utole i menu Tusome kandi li ulenge uhume hano tugakutwala ku <Link href="/ndondeero_tusome" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Ndondeero yo'kusoma</Link>.
            </p>
            
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-10">
              Kongwa. Tuyegerere tweeshi.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/tusome"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-medium text-sm rounded-md shadow-sm hover:shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Gwajika Ukusoma
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/twehe"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium text-sm rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 shadow-sm hover:shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Info className="w-4 h-4" />
              Twehe
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

