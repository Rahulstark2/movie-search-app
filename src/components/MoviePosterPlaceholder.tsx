'use client';

import { Film, Star } from 'lucide-react';

interface MoviePosterPlaceholderProps {
  title: string;
  year?: string;
}

export function MoviePosterPlaceholder({ title, year }: MoviePosterPlaceholderProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-16 h-16 border border-gray-600 rounded-full"></div>
        <div className="absolute bottom-8 right-6 w-12 h-12 border border-gray-600 rounded-full"></div>
        <div className="absolute top-1/2 right-8 w-8 h-8 border border-gray-600 rounded-full"></div>
        <div className="absolute bottom-4 left-6 w-6 h-6 border border-gray-600 rounded-full"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Film icon with glow effect */}
        <div className="mb-4 relative">
          <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30"></div>
          <div className="relative bg-gray-700 p-4 rounded-full border border-gray-600">
            <Film className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        {/* Movie title */}
        <h3 className="text-white font-bold text-sm mb-2 line-clamp-3 leading-tight">
          {title}
        </h3>
        
        {/* Year badge */}
        {year && (
          <div className="bg-gray-700/80 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-600">
            <span className="text-gray-300 text-xs font-medium">{year}</span>
          </div>
        )}
        
        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 text-yellow-400 opacity-50">
          <Star className="w-3 h-3 fill-current" />
        </div>
        <div className="absolute -bottom-1 -left-1 text-red-400 opacity-30">
          <div className="w-2 h-2 bg-current rounded-full"></div>
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent"></div>
    </div>
  );
}
