"use client";
import { useState, useCallback } from "react";
import type { MomentSuggestions } from "@/app/api/suggest-music/route";

type Status = "idle" | "loading" | "success" | "error";

export function useMusicSuggestions() {
  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<MomentSuggestions[]>([]);
  const [error, setError] = useState<string | null>(null);

  const suggest = useCallback(async (profile: unknown, moments: unknown) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/suggest-music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, moments }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || data?.error || `HTTP ${res.status}`);
      setResults(data.moments);
      setStatus("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
      setStatus("error");
    }
  }, []);

  return { suggest, status, results, error };
}
