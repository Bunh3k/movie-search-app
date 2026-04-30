const BASE_URL = process.env.TMDB_BASE_URL;
const TOKEN = process.env.TMDB_API_TOKEN;

export async function getMovies(query: string, page: number = 1) {
  if (!BASE_URL || !TOKEN) {
    throw new Error("Missing TMDB env");
  }

  const url = `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`;

  // await new Promise((resolve) => setTimeout(resolve, 2000));

  const res = await fetch(url, {
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

export async function createGuestSession() {
  if (!BASE_URL || !TOKEN) {
    throw new Error("Missing TMDB env");
  }

  const res = await fetch(`${BASE_URL}/authentication/guest_session/new`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to create guest session: ${res.status}`);
  }

  return res.json();
}

export async function getRatedMovies(guestSessionId: string, page: number = 1) {
  if (!BASE_URL || !TOKEN) {
    throw new Error("Missing TMDB env");
  }

  const url = new URL(
    `guest_session/${guestSessionId}/rated/movies`,
    `${BASE_URL}/`,
  );

  url.searchParams.set("page", page.toString());

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch rated movies: ${res.status}`);
  }

  return res.json();
}

export async function getGenres() {
  if (!BASE_URL || !TOKEN) {
    throw new Error("Missing TMDB env");
  }

  const res = await fetch(`${BASE_URL}/genre/movie/list`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch genres: ${res.status}`);
  }

  return res.json();
}

export async function rateMovie(
  movieId: number,
  rating: number,
  guestSessionId: string,
) {
  if (!BASE_URL || !TOKEN) {
    throw new Error("Missing TMDB env");
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
    throw new Error(`Failed to rate movie: ${res.status}`);
  }

  return res.json();
}
