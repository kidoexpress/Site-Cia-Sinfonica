import { Redis } from "@upstash/redis";
import { env } from "./env.js";

// Redis opcional — em dev sem Upstash configurado, usa um mock em memória
let redis: Redis | MemoryCache;

class MemoryCache {
  private store = new Map<string, { value: string; expiresAt?: number }>();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, options?: { ex?: number }): Promise<"OK"> {
    this.store.set(key, {
      value,
      expiresAt: options?.ex ? Date.now() + options.ex * 1000 : undefined,
    });
    return "OK";
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }

  async exists(key: string): Promise<number> {
    return this.store.has(key) ? 1 : 0;
  }
}

if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
} else {
  console.warn("⚠️  Redis não configurado — usando cache em memória (só para dev)");
  redis = new MemoryCache();
}

export { redis };

// TTLs padronizados (segundos)
export const TTL = {
  SPOTIFY_TOKEN: 3000,        // 50 minutos
  RECOMMENDATION: 60 * 60 * 6, // 6 horas
  YOUTUBE_SEARCH: 60 * 60 * 24, // 24 horas
  QUIZ_SESSION: 60 * 60 * 48,   // 48 horas
} as const;
