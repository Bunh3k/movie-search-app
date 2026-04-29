import { getMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query") || "return";
  const page = Number(searchParams.get("page")) || 1;

  const data = await getMovies(query, page);

  return Response.json(data);
}
