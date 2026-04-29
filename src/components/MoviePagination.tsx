"use client";

import { Pagination } from "antd";

export default function MoviePagination({
  currentPage,
  total,
  setPage,
}: {
  currentPage: number;
  total: number;
  setPage: (page: number) => void;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <Pagination
        current={currentPage}
        total={total}
        pageSize={6}
        size="small"
        showSizeChanger={false}
        onChange={(page) => setPage(page)}
      />
    </div>
  );
}
