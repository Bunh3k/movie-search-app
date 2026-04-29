"use client";

import { Alert, Col, Row, Spin, Tabs } from "antd";
import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import MoviePagination from "./MoviePagination";
import SearchForm from "./SearchForm";
import type { Movie } from "@/types/movie";

const UI_PAGE_SIZE = 6;
const API_PAGE_SIZE = 20;

export default function MovieApp() {
  const [guestSessionId, setGuestSessionId] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [ratedMovies, setRatedMovies] = useState<Record<number, number>>({});
  const [query, setQuery] = useState("return");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [activeTab, setActiveTab] = useState("search");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function initGuestSession() {
      const res = await fetch("/api/guest-session");
      const data = await res.json();

      setGuestSessionId(data.guest_session_id);
    }

    initGuestSession();
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true);
      setError("");

      try {
        if (activeTab === "rated") {
          if (!guestSessionId) {
            setMovies([]);
            setTotalResults(0);
            return;
          }

          const params = new URLSearchParams({
            guestSessionId,
            page: page.toString(),
          });

          const res = await fetch(`/api/rated-movies?${params.toString()}`);

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Failed to load rated movies");
          }

          setMovies(data.results || []);
          setTotalResults(data.total_results || 0);
          return;
        }

        const startIndex = (page - 1) * UI_PAGE_SIZE;
        const apiPage = Math.floor(startIndex / API_PAGE_SIZE) + 1;
        const startOffset = startIndex % API_PAGE_SIZE;

        const params = new URLSearchParams({
          query,
          page: apiPage.toString(),
        });

        const res = await fetch(`/api/movies?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load movies");
        }

        setTotalResults(data.total_results || 0);

        let visibleMovies = data.results.slice(
          startOffset,
          startOffset + UI_PAGE_SIZE,
        );

        if (visibleMovies.length < UI_PAGE_SIZE) {
          const nextParams = new URLSearchParams({
            query,
            page: (apiPage + 1).toString(),
          });

          const nextRes = await fetch(`/api/movies?${nextParams.toString()}`);

          const nextData = await nextRes.json();

          visibleMovies = [
            ...visibleMovies,
            ...nextData.results.slice(0, UI_PAGE_SIZE - visibleMovies.length),
          ];
        }

        setMovies(visibleMovies);
      } catch (err) {
        setMovies([]);
        setTotalResults(0);
        setError("Failed to load rated movies");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, [query, page, activeTab, guestSessionId]);

  return (
    <main>
      <div className="page-header">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setPage(1);
            setMovies([]);
            setTotalResults(0);
            setError("");
          }}
          centered
          items={[
            { key: "search", label: "Search" },
            { key: "rated", label: "Rated" },
          ]}
        />

        {activeTab === "search" && (
          <SearchForm setQuery={setQuery} setPage={setPage} />
        )}
      </div>

      {error && (
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
      ) : movies.length === 0 ? (
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
                onRate={(rating) => {
                  setRatedMovies((prev) => ({
                    ...prev,
                    [movie.id]: rating,
                  }));
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
    </main>
  );
}
