const BASE_URL = process.env.TMDB_BASE_URL;
const TOKEN = process.env.TMDB_API_TOKEN;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const guestSessionId = searchParams.get("guestSessionId");
  const page = searchParams.get("page") || "1";

  if (!BASE_URL || !TOKEN) {
    return Response.json({ error: "Missing TMDB env" }, { status: 500 });
  }

  if (!guestSessionId) {
    return Response.json(
      { error: "Missing guest session ID" },
      { status: 400 },
    );
  }

  const tmdbUrl = `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?page=${page}`;

  const res = await fetch(tmdbUrl, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return Response.json(data, { status: res.status });
  }

  return Response.json(data);
}
