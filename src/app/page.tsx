import { Row, Col, Tabs } from "antd";
import MovieCard from "./components/MovieCard";
import MoviePagination from "./components/MoviePagination";
import SearchForm from "./components/SearchForm";
import { getMovies } from "./lib/tmdb";
import type { Movie } from "./types/movie";

const UI_PAGE_SIZE = 6;
const API_PAGE_SIZE = 20;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query, page } = await searchParams;

  const searchQuery = query || "return";
  const currentPage = Number(page) || 1;

  const startIndex = (currentPage - 1) * UI_PAGE_SIZE;
  const apiPage = Math.floor(startIndex / API_PAGE_SIZE) + 1;
  const startOffset = startIndex % API_PAGE_SIZE;

  const data = await getMovies(searchQuery, apiPage);

  let visibleMovies = data.results.slice(
    startOffset,
    startOffset + UI_PAGE_SIZE,
  );

  if (visibleMovies.length < UI_PAGE_SIZE) {
    const nextData = await getMovies(searchQuery, apiPage + 1);

    visibleMovies = [
      ...visibleMovies,
      ...nextData.results.slice(0, UI_PAGE_SIZE - visibleMovies.length),
    ];
  }

  return (
    <main className="container">
      <div style={{ maxWidth: 938, margin: "0 auto" }}>
        <Tabs
          defaultActiveKey="search"
          centered
          items={[
            { key: "search", label: "Search" },
            { key: "rated", label: "Rated" },
          ]}
        />

        <SearchForm />
      </div>

      <Row gutter={[16, 16]}>
        {visibleMovies.map((movie: Movie) => (
          <Col span={12} key={movie.id}>
            <MovieCard movie={movie} />
          </Col>
        ))}
      </Row>

      <MoviePagination
        currentPage={currentPage}
        total={data.total_results}
        searchQuery={searchQuery}
      />
    </main>
  );
}
