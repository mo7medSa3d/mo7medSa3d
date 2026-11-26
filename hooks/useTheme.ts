"use client";

import { useCallback, useEffect, useState } from "react";

export function useTheme() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const saved = document.documentElement.dataset.theme;
    setLight(saved === "light");
  }, []);

  const toggle = useCallback(() => {
    setLight((prev) => {
      const next = !prev;
      const mode = next ? "light" : "dark";
      document.documentElement.dataset.theme = mode;
      try {
        localStorage.setItem("mas-theme", mode);
      } catch {
        // Ignore storage errors in private browsing modes.
      }
      return next;
    });
  }, []);

  return [light, toggle] as const;
}
