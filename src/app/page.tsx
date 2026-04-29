import MovieApp from "@/components/MovieApp";
import { GenresProvider } from "@/contexts/GenresContext";

export default function Home() {
  return (
    <GenresProvider>
      <MovieApp />
    </GenresProvider>
  );
}
