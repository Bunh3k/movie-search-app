type GuestSession = {
  guest_session_id: string;
  expires_at: string;
};

const STORAGE_KEY = "tmdb_guest_session";

export function getStoredGuestSession(): GuestSession | null {
  const storedSession = localStorage.getItem(STORAGE_KEY);

  if (!storedSession) return null;

  const session: GuestSession = JSON.parse(storedSession);
  const expiresAt = new Date(session.expires_at).getTime();
  const now = Date.now();

  if (expiresAt <= now) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  return session;
}

export function saveGuestSession(session: GuestSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}
