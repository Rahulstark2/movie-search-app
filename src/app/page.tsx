import { SearchBar } from '@/components/SearchBar';
import { MovieGrid } from '@/components/MovieGrid';
import { movieApi } from '@/lib/api';

// This is a Server Component, so we can fetch data directly.
export default async function Home() {
  // Fetch initial movies on the server.
  const response = await movieApi.getRecentMovies(1);
  const initialMovies = response.Search || [];
  const totalResults = response.totalResults || '0';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="my-8">
        <SearchBar />
      </div>
      {/* Pass the server-fetched data as props to the client component */}
      <MovieGrid initialMovies={initialMovies} totalResults={totalResults} />
    </div>
  );
}
