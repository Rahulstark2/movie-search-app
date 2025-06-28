import { movieApi } from '@/lib/api';
import { MovieDetails } from '@/components/MovieDetails';
import { notFound } from 'next/navigation';

interface MoviePageProps {
  params: {
    id: string;
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  try {
    const movieDetails = await movieApi.getMovieDetails(params.id);
    
    if (movieDetails.Response === 'False') {
      notFound();
    }

    return <MovieDetails movie={movieDetails} />;
  } catch (error) {
    console.error('Failed to fetch movie details:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: MoviePageProps) {
  try {
    const movieDetails = await movieApi.getMovieDetails(params.id);
    
    if (movieDetails.Response === 'False') {
      return {
        title: 'Movie Not Found',
      };
    }

    return {
      title: `${movieDetails.Title} (${movieDetails.Year}) - Movie Details`,
      description: movieDetails.Plot || `Watch ${movieDetails.Title} starring ${movieDetails.Actors}`,
    };
  } catch (_error) {
    return {
      title: 'Movie Not Found',
    };
  }
}
