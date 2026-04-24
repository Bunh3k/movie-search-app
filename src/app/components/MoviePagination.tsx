"use client";

import { Pagination } from "antd";
import { useRouter } from "next/navigation";

export default function MoviePagination({
  currentPage,
  total,
  searchQuery,
}: {
  currentPage: number;
  total: number;
  searchQuery: string;
}) {
  const router = useRouter();

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <Pagination
        current={currentPage}
        total={total}
        pageSize={6}
        size="small"
        showSizeChanger={false}
        onChange={(page) => {
          router.push(`/?query=${searchQuery}&page=${page}`);
        }}
      />
    </div>
  );
}
