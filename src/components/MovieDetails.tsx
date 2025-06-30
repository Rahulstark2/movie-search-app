'use client';

import { MovieDetailsResponse } from '@/types/movie';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Star, 
  Calendar, 
  Clock, 
  Users, 
  Camera, 
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MoviePosterPlaceholder } from './MoviePosterPlaceholder';
import { StarRating } from './StarRating';
import { useState } from 'react';

interface MovieDetailsProps {
  movie: MovieDetailsResponse;
}

function getHighResPoster(url: string | undefined, size: number = 800): string | undefined {
  if (!url) return url;
  return url.replace(/_SX\d+(_)?/i, `_SX${size}$1`);
}

export function MovieDetails({ movie }: MovieDetailsProps) {
  const [imageError, setImageError] = useState(false);
  const hasPoster = movie.Poster && movie.Poster !== 'N/A' && !imageError;
  const genres = movie.Genre ? movie.Genre.split(',').map(g => g.trim()) : [];
  const actors = movie.Actors ? movie.Actors.split(',').map(a => a.trim()) : [];
  const directors = movie.Director ? movie.Director.split(',').map(d => d.trim()) : [];

  // Genre colors matching the movie cards
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
    <div className="min-h-screen dark:bg-black bg-gray-50 dark:text-white text-gray-900 transition-colors duration-300 overflow-x-hidden">
      {/* Hero Section with Backdrop */}
      <div className="relative min-h-screen">
        {/* Background Image/Gradient */}
        <div className="fixed inset-0 bg-gradient-to-b from-gray-900/90 via-black/70 to-black dark:from-gray-900/90 dark:via-black/70 dark:to-black from-gray-200/90 via-white/70 to-gray-50 z-0">
          {hasPoster && (
            <div className="absolute inset-0 opacity-20">
              <Image
                src={getHighResPoster(movie.Poster, 800) || ''}
                alt={movie.Title}
                fill
                className="object-cover blur-3xl"
                sizes="100vw"
                priority
                onError={() => setImageError(true)}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link href="/">
            <Button 
              variant="outline" 
              className="mb-6 border-gray-600 dark:border-gray-600 border-gray-300 text-gray-300 dark:text-gray-300 text-gray-700 hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100 hover:text-white dark:hover:text-white hover:text-gray-900 transition-all duration-300 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Movies
            </Button>
          </Link>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Poster Section */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden bg-gray-900/50 dark:bg-gray-900/50 bg-white/50 border-gray-800 dark:border-gray-800 border-gray-200 backdrop-blur-sm shadow-lg p-0">
                <div className="relative aspect-[2/3] w-full max-w-md mx-auto">
                  {hasPoster ? (
                    <Image
                      src={getHighResPoster(movie.Poster, 800) || ''}
                      alt={movie.Title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <MoviePosterPlaceholder title={movie.Title} year={movie.Year} />
                  )}
                </div>
              </Card>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Basic Info */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 dark:from-white dark:via-gray-100 dark:to-gray-300 from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                  {movie.Title}
                </h1>
                <p className="text-xl text-gray-400 dark:text-gray-400 text-gray-600 mb-4">{movie.Year}</p>

                {/* Genres */}
                {genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {genres.map((genre, index) => (
                      <Badge 
                        key={index}
                        className={`${getGenreColor(genre)} text-sm px-3 py-1 font-medium`}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Rating and Runtime */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-5 h-5 mr-2 fill-current" />
                      <span className="font-semibold text-lg">{movie.imdbRating}</span>
                      <span className="text-gray-400 ml-1">/10 IMDb</span>
                    </div>
                  )}
                  {movie.Runtime && movie.Runtime !== 'N/A' && (
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      {movie.Runtime}
                    </div>
                  )}
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-4 h-4 mr-2" />
                    {movie.Year}
                  </div>
                </div>
              </div>

              {/* Plot */}
              {movie.Plot && movie.Plot !== 'N/A' && (
                <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                      <h2 className="text-xl font-semibold">Plot Summary</h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-lg">{movie.Plot}</p>
                  </CardContent>
                </Card>
              )}

              {/* User Rating Section */}
              <StarRating movieId={movie.imdbID} />

              {/* Cast and Crew */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Director */}
                {directors.length > 0 && directors[0] !== 'N/A' && (
                  <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <Camera className="w-5 h-5 mr-2 text-purple-400" />
                        <h3 className="text-lg font-semibold">
                          Director{directors.length > 1 ? 's' : ''}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {directors.map((director, index) => (
                          <p key={index} className="text-gray-300 font-medium">
                            {director}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Cast */}
                {actors.length > 0 && actors[0] !== 'N/A' && (
                  <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <Users className="w-5 h-5 mr-2 text-green-400" />
                        <h3 className="text-lg font-semibold">Cast</h3>
                      </div>
                      <div className="space-y-2">
                        {actors.slice(0, 6).map((actor, index) => (
                          <p key={index} className="text-gray-300">
                            {actor}
                          </p>
                        ))}
                        {actors.length > 6 && (
                          <p className="text-gray-500 text-sm">
                            and {actors.length - 6} more...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Additional Info */}
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    {movie.Released && movie.Released !== 'N/A' && (
                      <div>
                        <span className="text-gray-400">Released:</span>
                        <span className="ml-2 text-white">{movie.Released}</span>
                      </div>
                    )}
                    {movie.Rated && movie.Rated !== 'N/A' && (
                      <div>
                        <span className="text-gray-400">Rated:</span>
                        <span className="ml-2 text-white">{movie.Rated}</span>
                      </div>
                    )}
                    {movie.Language && movie.Language !== 'N/A' && (
                      <div>
                        <span className="text-gray-400">Language:</span>
                        <span className="ml-2 text-white">{movie.Language}</span>
                      </div>
                    )}
                    {movie.Country && movie.Country !== 'N/A' && (
                      <div>
                        <span className="text-gray-400">Country:</span>
                        <span className="ml-2 text-white">{movie.Country}</span>
                      </div>
                    )}
                    {movie.Awards && movie.Awards !== 'N/A' && (
                      <div className="sm:col-span-2">
                        <span className="text-gray-400">Awards:</span>
                        <span className="ml-2 text-white">{movie.Awards}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
