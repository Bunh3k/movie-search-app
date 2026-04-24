"use client";

import { Input } from "antd";
import { useRouter } from "next/navigation";

export default function SearchForm() {
  const router = useRouter();

  return (
    <Input
      style={{ marginBottom: 19 }}
      placeholder="Type to search..."
      onPressEnter={(e) => {
        const value = e.currentTarget.value;
        router.push(`/?query=${value}&page=1`);
      }}
    />
  );
}
