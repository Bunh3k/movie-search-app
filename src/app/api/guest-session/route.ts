import { createGuestSession } from "@/lib/tmdb";

export async function GET() {
  const data = await createGuestSession();

  return Response.json(data);
}
