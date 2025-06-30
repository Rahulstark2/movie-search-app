'use client';

import { Movie } from '@/types/movie';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MoviePosterPlaceholder } from './MoviePosterPlaceholder';
import { useState } from 'react';

interface MovieCardProps {
  movie: Movie;
  isLoadingGenres?: boolean;
}

function getHighResPoster(url: string | undefined, size: number = 800): string | undefined {
  if (!url) return url;
  return url.replace(/_SX\d+(_)?/i, `_SX${size}$1`);
}

export function MovieCard({ movie, isLoadingGenres = false }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasPoster = movie.Poster && movie.Poster !== 'N/A' && !imageError;
  
  // Parse genres from the string (usually comma-separated)
  const genres = movie.Genre 
    ? movie.Genre.split(',').map(genre => genre.trim()).slice(0, 2) // Show max 2 genres
    : [];
  
  // Genre colors for visual appeal
  const getGenreColor = (genre: string) => {
    const genreColors: { [key: string]: string } = {
      'Action': 'bg-red-500/80 text-white border-red-400/50',
      'Adventure': 'bg-orange-500/80 text-white border-orange-400/50',
      'Comedy': 'bg-yellow-500/80 text-black border-yellow-400/50',
      'Drama': 'bg-purple-500/80 text-white border-purple-400/50',
      'Horror': 'bg-gray-800/80 text-red-400 border-gray-600/50',
      'Romance': 'bg-pink-500/80 text-white border-pink-400/50',
      'Thriller': 'bg-indigo-500/80 text-white border-indigo-400/50',
      'Sci-Fi': 'bg-cyan-500/80 text-white border-cyan-400/50',
      'Fantasy': 'bg-emerald-500/80 text-white border-emerald-400/50',
      'Crime': 'bg-slate-600/80 text-white border-slate-400/50',
      'Mystery': 'bg-violet-500/80 text-white border-violet-400/50',
      'Animation': 'bg-teal-500/80 text-white border-teal-400/50',
      'Family': 'bg-green-500/80 text-white border-green-400/50',
      'Biography': 'bg-amber-600/80 text-white border-amber-400/50',
      'History': 'bg-amber-700/80 text-white border-amber-500/50',
      'War': 'bg-red-800/80 text-white border-red-600/50',
      'Western': 'bg-orange-700/80 text-white border-orange-600/50',
      'Musical': 'bg-fuchsia-500/80 text-white border-fuchsia-400/50',
      'Sport': 'bg-blue-500/80 text-white border-blue-400/50',
      'Documentary': 'bg-gray-600/80 text-white border-gray-400/50'
    };
    return genreColors[genre] || 'bg-blue-500/80 text-white border-blue-400/50';
  };

  return (
    <Link href={`/movies/${movie.imdbID}`}>
      <Card className="movie-card overflow-hidden bg-gray-900 dark:bg-gray-900 bg-white border-gray-800 dark:border-gray-800 border-gray-200 cursor-pointer group relative shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-[2/3] overflow-hidden">
          {hasPoster ? (
            <Image
              src={getHighResPoster(movie.Poster, 800) || ''}
              alt={movie.Title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <MoviePosterPlaceholder title={movie.Title} year={movie.Year} />
          )}
          {hasPoster && (
            <>
              {/* Multiple Gradient Overlays for Depth */}
              {/* Bottom gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              {/* Hover overlay with subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          )}
          
        </div>
        
        {/* Default visible content - enhanced on hover */}
        <div className="p-3 h-36 flex flex-col group-hover:bg-gray-800/50 dark:group-hover:bg-gray-800/50 group-hover:bg-gray-100/50 transition-all duration-300">
          <div className="flex-grow">
            <h3 className="text-white dark:text-white text-gray-900 font-semibold text-sm mb-2 line-clamp-2 group-hover:text-yellow-400 dark:group-hover:text-yellow-400 group-hover:text-red-600 transition-colors duration-300 h-10">
              {movie.Title}
            </h3>
            
            {/* Genre chips - visible by default */}
            <div className="flex flex-wrap items-start gap-1 group-hover:gap-x-1.5 transition-all duration-300 mb-2 min-h-[36px]">
              {genres.length > 0 ? (
                genres.map((genre, index) => (
                  <Badge 
                    key={index}
                    className={`${getGenreColor(genre)} text-[10px] px-2 py-0.5 font-medium shadow-sm group-hover:shadow-lg group-hover:-translate-y-px transition-all duration-300`}
                  >
                    <Tag className="w-2.5 h-2.5 mr-1" />
                    {genre}
                  </Badge>
                ))
              ) : isLoadingGenres ? (
                <>
                  <div className="h-5 w-16 bg-gray-700/50 rounded-full animate-pulse" />
                  <div className="h-5 w-12 bg-gray-700/50 rounded-full animate-pulse" />
                </>
              ) : null}
            </div>
          </div>
          
          {/* Footer content */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-gray-600 dark:border-gray-600 border-gray-400 text-gray-300 dark:text-gray-300 text-gray-600 text-xs group-hover:border-yellow-400 dark:group-hover:border-yellow-400 group-hover:border-red-500 group-hover:text-yellow-400 dark:group-hover:text-yellow-400 group-hover:text-red-600 transition-colors duration-300">
              {movie.Year}
            </Badge>
            
            {movie.imdbRating ? (
              <div className="flex items-center text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-3 h-3 mr-1 fill-current" />
                <span className="text-xs font-semibold">{movie.imdbRating}</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-400 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-3 h-3 mr-1" />
                <span className="text-xs font-semibold">N/A</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}