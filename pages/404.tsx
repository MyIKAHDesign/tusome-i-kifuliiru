import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft, AlertCircle } from 'lucide-react';

const NotFound404 = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Number with Icon */}
          <div className="relative mb-8">
            <div className="inline-block relative">
              <h1 className="text-8xl md:text-9xl font-bold text-gray-200 dark:text-gray-800 transition-colors">
                404
              </h1>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 animate-bounce">
                <AlertCircle className="w-16 h-16 md:w-20 md:h-20 text-primary-500 dark:text-primary-400" />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 animate-fade-in">
            Ngisi biindu ushuba mulooza ndabyo twaloonga
          </h2>

          {/* Support Text */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto animate-fade-in">
            Haliko bigaba bikahamikizibwa mu kindi kibaaja, looza kandi li
            uhinduule ku ndondeero
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fade-in">
            <Link
              href="/"
              className="group flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Hindula ku ndondeero</span>
            </Link>

            <Link
              href="/"
              className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Looza hano</span>
            </Link>
          </div>

          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group animate-fade-in"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Galuka inyuma</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in:nth-child(1) {
          animation-delay: 0.1s;
        }

        .animate-fade-in:nth-child(2) {
          animation-delay: 0.2s;
        }

        .animate-fade-in:nth-child(3) {
          animation-delay: 0.3s;
        }

        .animate-fade-in:nth-child(4) {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default NotFound404;
