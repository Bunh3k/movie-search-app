import { getRatedMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const guestSessionId = searchParams.get("guestSessionId");
  const page = Number(searchParams.get("page")) || 1;

  if (!guestSessionId) {
    return Response.json(
      { error: "Missing guest session ID" },
      { status: 400 },
    );
  }

  try {
    const data = await getRatedMovies(guestSessionId, page);
    return Response.json(data);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch rated",
      },
      { status: 500 },
    );
  }
}
