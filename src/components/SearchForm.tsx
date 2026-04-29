"use client";

import { Input } from "antd";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";

export default function SearchForm({
  setQuery,
  setPage,
}: {
  setQuery: (query: string) => void;
  setPage: (page: number) => void;
}) {
  const [value, setValue] = useState("");

  const debounceSearch = useMemo(
    () =>
      debounce((searchValue: string) => {
        setQuery(searchValue || "return");
        setPage(1);
      }, 600),
    [setQuery, setPage],
  );

  useEffect(() => {
    debounceSearch(value.trim());

    return () => {
      debounceSearch.cancel();
    };
  }, [value, debounceSearch]);

  return (
    <Input
      style={{ marginBottom: 19 }}
      placeholder="Type to search..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
