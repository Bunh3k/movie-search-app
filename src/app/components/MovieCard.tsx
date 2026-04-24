import { Card, Rate } from "antd";
import Image from "next/image";
import type { Movie } from "../types/movie";
import { format } from "date-fns";

export default function MovieCard({ movie }: { movie: Movie }) {
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

  const rating = movie.vote_average.toFixed(1);

  return (
    <Card
      style={{
        marginBottom: 0,
        position: "relative",
        height: 279,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "none",
        borderRadius: 8,
        overflow: "hidden",
      }}
      styles={{ body: { padding: 0, height: "100%" } }}
    >
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: 183, height: "100%", flexShrink: 0 }}>
          <Image
            src={posterUrl}
            alt={movie.title}
            width={183}
            height={279}
            unoptimized
            style={{ objectFit: "cover", height: "100%" }}
          />
        </div>

        <div
          style={{
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 500,
                flex: 1,
                minWidth: 0,
              }}
            >
              {movie.title}
            </h3>

            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "2px solid #E9D100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              {rating}
            </div>
          </div>

          <p style={{ margin: 0, fontSize: 12, color: "#827E7E" }}>
            {formattedDate}
          </p>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 4,
              fontSize: 11,
              color: "#595959",
            }}
          >
            <span
              style={{
                fontSize: 12,
                border: "1px solid #d9d9d9",
                borderRadius: 2,
                padding: "0 6px",
                lineHeight: "20px",
              }}
            >
              Action
            </span>
            <span
              style={{
                fontSize: 12,
                border: "1px solid #d9d9d9",
                borderRadius: 2,
                padding: "0 6px",
                lineHeight: "20px",
              }}
            >
              Drama
            </span>
          </div>
          <p
            style={{
              marginTop: 4,
              fontSize: 12,
              lineHeight: "18px",
              color: "#595959",
            }}
          >
            {shortOverview}
          </p>

          <div style={{ marginTop: "auto" }}>
            <Rate
              disabled
              allowHalf
              count={10}
              value={movie.vote_average}
              character="★"
              style={{
                fontSize: 18,
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
