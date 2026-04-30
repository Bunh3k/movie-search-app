import { rateMovie } from "@/lib/tmdb";

export async function POST(request: Request) {
  const { movieId, rating, guestSessionId } = await request.json();

  try {
    const data = await rateMovie(movieId, rating, guestSessionId);
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to rate" },
      { status: 500 },
    );
  }
}
