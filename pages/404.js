import React from 'react';
import { Search, Home, AlertCircle, ChevronRight, MoveLeft } from 'lucide-react';

const NotFound404 = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-2xl w-full text-center space-y-8 px-4">
        {/* Responsive 404 Container with Centered Icon */}
        <div className="relative h-32 sm:h-48 flex items-center justify-center mb-12">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold text-blue-600 dark:text-blue-500 transition-colors duration-200">
            404
          </h1>
          <AlertCircle 
            className="w-16 sm:w-20 h-16 sm:h-20 text-red-500 dark:text-red-400 absolute top-0 sm:-top-4 left-1/2 -translate-x-1/2 animate-bounce" 
          />
        </div>
        
        {/* Main Message - Responsive Text */}
        <div className="flex items-center justify-center gap-2 animate-fadeIn">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold px-4">
            Ngisi biindu ushuba mulooza ndabyo twaloonga
          </h2>
        </div>
        
        {/* Supportive Text - Responsive */}
        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 transition-colors duration-200 animate-fadeIn max-w-prose mx-auto px-4">
          Haliko bigaba bikahamikizibwa mu kindi kibaaja, looza kandi li uhinduule ku ndondeero
        </p>
        
        {/* Responsive Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fadeIn px-4">
          <a 
            href="/"
            className="px-4 sm:px-6 py-3 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 group hover:shadow-lg text-sm sm:text-base"
          >
            <Home className="w-4 sm:w-5 h-4 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Hindula ku ndondeero</span>
            <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </a>
          
          <a 
            href="/search"
            className="px-4 sm:px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2 group hover:shadow-lg text-sm sm:text-base"
          >
            <Search className="w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110 transition-transform" />
            <span>Looza hano</span>
          </a>
        </div>

        {/* Responsive Return Link */}
        <div className="mt-8 sm:mt-12 animate-fadeIn">
          <a 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group text-sm sm:text-base"
          >
            <MoveLeft className="w-4 sm:w-5 h-4 sm:h-5 group-hover:-translate-x-2 transition-transform" />
            <span>Garuka inyuma</span>
          </a>
        </div>
      </div>
    </div>
  );
};

// Add keyframe animations with responsive timing
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }

  @media (max-width: 640px) {
    .animate-fadeIn {
      animation-duration: 0.3s;
    }
  }
`;
document.head.appendChild(style);

export default NotFound404;