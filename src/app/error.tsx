"use client";

import { Alert } from "antd";

export default function Error({ error }: { error: Error }) {
  return (
    <div style={{ maxWidth: 600, margin: "50px auto" }}>
      <Alert
        message="Error loading movies"
        description={error.message || "Something went wrong"}
        type="error"
        showIcon
      />
    </div>
  );
}
