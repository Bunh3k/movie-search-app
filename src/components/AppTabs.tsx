"use client";

import { Tabs } from "antd";
import { usePathname, useRouter } from "next/navigation";

export default function AppTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const activeKey = pathname === "/rated" ? "rated" : "search";

  return (
    <Tabs
      activeKey={activeKey}
      centered
      onChange={(key) => {
        router.push(key === "rated" ? "/rated" : "/");
      }}
      items={[
        { key: "search", label: "Search" },
        { key: "rated", label: "Rated" },
      ]}
    />
  );
}
