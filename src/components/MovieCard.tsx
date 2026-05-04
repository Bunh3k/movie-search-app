import { Card, Rate } from "antd";
import Image from "next/image";
import type { Movie } from "../types/movie";
import { format } from "date-fns";
import styles from "./MovieCard.module.css";
import { useGenres } from "@/contexts/GenresContext";

export default function MovieCard({
  movie,
  guestSessionId,
  userRating,
  onRate,
}: {
  movie: Movie;
  guestSessionId: string;
  userRating?: number;
  onRate: (rating: number) => void;
}) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/200x300?text=No+Image";

  const formattedDate = movie.release_date
    ? format(new Date(movie.release_date), "MMMM d, yyyy")
    : "Unknown";

  const shortOverview =
    movie.overview.length > 120
      ? movie.overview.slice(0, 120).split(" ").slice(0, -1).join(" ") + "..."
      : movie.overview;

  const displayRating = userRating ?? movie.vote_average;
  const rating = displayRating.toFixed(1);

  const ratingColor =
    displayRating <= 3
      ? "#E90000"
      : displayRating <= 5
        ? "#E97E00"
        : displayRating <= 7
          ? "#E9D100"
          : "#66E900";

  const genres = useGenres();

  function handleRate(value: number) {
    fetch("/api/rate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieId: movie.id,
        rating: value,
        guestSessionId,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to rate");
        }
        return res.json();
      })
      .then(() => {
        onRate(value);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <Card className={styles.card} classNames={{ body: styles.cardBody }}>
      <div className={styles.cardContent}>
        <div className={styles.posterWrapper}>
          <Image
            src={posterUrl}
            alt={movie.title}
            width={183}
            height={279}
            unoptimized
            className={styles.poster}
          />
        </div>

        <div className={styles.info}>
          <div className={styles.header}>
            <h3 className={styles.title}>{movie.title}</h3>

            <div
              className={styles.ratingCircle}
              style={{ border: `2px solid ${ratingColor}` }}
            >
              {rating}
            </div>
          </div>

          <p className={styles.date}>{formattedDate}</p>

          <div className={styles.genres}>
            {movie.genre_ids.map((genreId) => {
              const genre = genres.find((item) => item.id === genreId);

              return (
                <span className={styles.genre} key={genreId}>
                  {genre?.name}
                </span>
              );
            })}
          </div>
          <p className={styles.overview}>{shortOverview}</p>

          <div className={styles.rateWrapper}>
            <Rate
              className={styles.rate}
              allowHalf
              count={10}
              value={userRating ?? movie.vote_average}
              onChange={handleRate}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
