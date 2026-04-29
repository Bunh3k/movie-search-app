import { NextRequest } from "next/server";

const BASE_URL = process.env.TMDB_BASE_URL;
const TOKEN = process.env.TMDB_API_TOKEN;

export async function POST(request: NextRequest) {
  if (!BASE_URL || !TOKEN) {
    return Response.json({ error: "Missing TMDB env" }, { status: 500 });
  }

  const { movieId, rating, guestSessionId } = await request.json();

  if (!movieId || !rating || !guestSessionId) {
    return Response.json({ error: "Missing rating data" }, { status: 400 });
  }

  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/rating?guest_session_id=${guestSessionId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ value: rating }),
    },
  );

  if (!res.ok) {
    return Response.json(
      { error: `Failed to rate movie: ${res.status}` },
      { status: res.status },
    );
  }

  const data = await res.json();
  return Response.json(data);
}
