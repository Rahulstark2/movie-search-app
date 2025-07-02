'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StarRatingProps {
  movieId: string;
}

export function StarRating({ movieId }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load rating from localStorage on component mount
  useEffect(() => {
    const savedRating = localStorage.getItem(`movie-rating-${movieId}`);
    if (savedRating) {
      setRating(parseInt(savedRating, 10));
    }
  }, [movieId]);

  // Save rating to localStorage whenever it changes
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setIsAnimating(true);
    localStorage.setItem(`movie-rating-${movieId}`, newRating.toString());
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleStarClick = (starIndex: number) => {
    handleRatingChange(starIndex);
  };

  const handleStarHover = (starIndex: number) => {
    setHoverRating(starIndex);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const displayRating = hoverRating || rating;

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Rate this movie";
    }
  };

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 1: return "text-red-400";
      case 2: return "text-orange-400";
      case 3: return "text-yellow-400";
      case 4: return "text-blue-400";
      case 5: return "text-green-400";
      default: return "text-gray-400";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700 backdrop-blur-sm overflow-hidden shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3">
            <Star className="w-3 h-3 text-white fill-current" />
          </div>
          <h3 className="text-lg font-semibold text-white">Your Rating</h3>
        </div>
        
        <div 
          className="flex items-center space-x-1 mb-4"
          onMouseLeave={handleMouseLeave}
        >
          {[1, 2, 3, 4, 5].map((starIndex) => {
            const isActive = starIndex <= displayRating;
            const isHovered = starIndex <= hoverRating;
            
            return (
              <button
                key={starIndex}
                onClick={() => handleStarClick(starIndex)}
                onMouseEnter={() => handleStarHover(starIndex)}
                className={`
                  relative transition-all duration-200 ease-out transform 
                  hover:scale-110 active:scale-95 focus:outline-none 
                  ${isAnimating && starIndex <= rating ? 'animate-pulse' : ''}
                  ${isHovered ? 'scale-110' : ''}
                `}
                aria-label={`Rate ${starIndex} star${starIndex > 1 ? 's' : ''}`}
              >
                <Star
                  className={`
                    w-8 h-8 transition-all duration-200 
                    ${isActive 
                      ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg' 
                      : 'text-gray-600 hover:text-gray-400'
                    }
                    ${isHovered && !isActive ? 'text-yellow-300' : ''}
                  `}
                />
                
                {/* Glow effect for active stars */}
                {isActive && (
                  <div className="absolute inset-0 w-8 h-8 bg-yellow-400/30 rounded-full blur-md -z-10" />
                )}
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <p className={`text-sm font-medium transition-colors duration-200 ${getRatingColor(displayRating)}`}>
            {getRatingText(displayRating)}
          </p>
          {rating > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              You rated this movie {rating}/5 stars
            </p>
          )}
        </div>

        {/* Subtle animation when rating changes */}
        {isAnimating && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 animate-pulse rounded-lg" />
        )}
      </CardContent>
    </Card>
  );
}
