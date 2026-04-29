import { getGenres } from "@/lib/tmdb";

export async function GET() {
  const data = await getGenres();

  return Response.json(data);
}
