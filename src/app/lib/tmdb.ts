const BASE_URL = process.env.TMDB_BASE_URL;
const TOKEN = process.env.TMDB_API_TOKEN;

export async function getMovies(query: string, page: number = 1) {
  if (!BASE_URL || !TOKEN) {
    throw new Error("Missing TMDB env");
  }

  const url = new URL("search/movie", `${BASE_URL}/`);
  url.searchParams.set("query", query);
  url.searchParams.set("page", page.toString());

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch movies: ${res.status}`);
  }

  return res.json();
}
