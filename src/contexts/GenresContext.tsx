"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Genre = {
  id: number;
  name: string;
};

const GenresContext = createContext<Genre[]>([]);

export function GenresProvider({ children }: { children: React.ReactNode }) {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    async function fetchGenres() {
      const res = await fetch("/api/genres");
      const data = await res.json();

      setGenres(data.genres);
    }

    fetchGenres();
  }, []);

  return (
    <GenresContext.Provider value={genres}>{children}</GenresContext.Provider>
  );
}

export function useGenres() {
  return useContext(GenresContext);
}
