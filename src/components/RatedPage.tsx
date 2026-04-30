"use client";

import { Alert, Col, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import MoviePagination from "./MoviePagination";
import type { Movie } from "@/types/movie";
import { useGuestSession } from "@/hooks/useGuestSession";
import {
  UI_PAGE_SIZE,
  getApiPagination,
  getVisibleItems,
  shouldFetchNextPage,
} from "@/lib/pagination";

export default function RatedPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [ratedMovies, setRatedMovies] = useState<Record<number, number>>({});
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const guestSessionId = useGuestSession();

  useEffect(() => {
    async function fetchRatedMovies() {
      if (!guestSessionId) return;

      setIsLoading(true);
      setError("");

      try {
        const { startIndex, apiPage, startOffset } = getApiPagination(page);

        const params = new URLSearchParams({
          guestSessionId,
          page: apiPage.toString(),
        });

        const res = await fetch(`/api/rated-movies?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load rated movies");
        }

        setTotalResults(data.total_results || 0);

        let visibleMovies = getVisibleItems<Movie>(data.results, startOffset);

        if (
          shouldFetchNextPage(
            visibleMovies.length,
            startIndex,
            data.total_results || 0,
          )
        ) {
          const nextParams = new URLSearchParams({
            guestSessionId,
            page: (apiPage + 1).toString(),
          });

          const nextRes = await fetch(
            `/api/rated-movies?${nextParams.toString()}`,
          );
          const nextData = await nextRes.json();

          visibleMovies = [
            ...visibleMovies,
            ...nextData.results.slice(0, UI_PAGE_SIZE - visibleMovies.length),
          ];
        }

        setMovies(visibleMovies);
      } catch {
        setMovies([]);
        setTotalResults(0);
        setError("Failed to load rated movies");
      } finally {
        setIsLoading(false);
      }
    }

    fetchRatedMovies();
  }, [guestSessionId, page]);

  return (
    <>
      {error && movies.length === 0 && (
        <Alert
          title="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}

      {isLoading ? (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 80 }}
        >
          <Spin size="large" />
        </div>
      ) : movies.length === 0 && !error ? (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          No movies found
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {movies.map((movie) => (
            <Col span={12} key={movie.id}>
              <MovieCard
                movie={movie}
                guestSessionId={guestSessionId}
                userRating={ratedMovies[movie.id] ?? movie.rating}
                onRate={async (rating) => {
                  const res = await fetch("/api/rate", {
                    method: "POST",
                    body: JSON.stringify({
                      movieId: movie.id,
                      rating,
                      guestSessionId,
                    }),
                  });

                  if (res.ok) {
                    setRatedMovies((prev) => ({
                      ...prev,
                      [movie.id]: rating,
                    }));
                  }
                }}
              />
            </Col>
          ))}
        </Row>
      )}

      <MoviePagination
        currentPage={page}
        total={totalResults}
        setPage={setPage}
      />
    </>
  );
}
