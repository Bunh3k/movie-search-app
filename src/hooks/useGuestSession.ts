"use client";

import { useEffect, useState } from "react";
import { getStoredGuestSession, saveGuestSession } from "@/lib/guestSession";

export function useGuestSession() {
  const [guestSessionId, setGuestSessionId] = useState("");

  useEffect(() => {
    async function init() {
      const stored = getStoredGuestSession();

      if (stored) {
        setGuestSessionId(stored.guest_session_id);
        return;
      }

      const res = await fetch("/api/guest-session");
      const data = await res.json();

      saveGuestSession(data);
      setGuestSessionId(data.guest_session_id);
    }

    init();
  }, []);

  return guestSessionId;
}
