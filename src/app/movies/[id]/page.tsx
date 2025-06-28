import { movieApi } from '@/lib/api';
import { MovieDetails } from '@/components/MovieDetails';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

export default async function MoviePage({ params }: Props) {
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
