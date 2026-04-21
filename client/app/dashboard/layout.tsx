"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyUser = async () => {
      try {
        await apiRequest("/users/me");

        if (isMounted) {
          setLoading(false);
        }
      } catch {
        if (typeof window !== "undefined") {
          window.location.replace("/login");
        }
      }
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
