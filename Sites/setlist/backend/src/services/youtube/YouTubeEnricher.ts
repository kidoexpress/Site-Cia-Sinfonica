import { google } from "googleapis";
import { redis, TTL } from "../../config/redis.js";
import { env } from "../../config/env.js";
import type { SpotifyTrack, YouTubeResult, EnrichedTrack } from "../../types/recommendation.types.js";

export class YouTubeEnricher {
  private youtube;

  constructor() {
    this.youtube = google.youtube({
      version: "v3",
      auth:    env.YOUTUBE_API_KEY,
    });
  }

  // ─── Busca vídeo para uma track ────────────────────────────────────────────

  async findVideoForTrack(
    trackName: string,
    artistName: string
  ): Promise<YouTubeResult | null> {
    const cacheKey = `yt:${artistName}:${trackName}`.toLowerCase().replace(/\s+/g, "_");

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached as string);

    const query = `${artistName} ${trackName} official`;

    try {
      const response = await this.youtube.search.list({
        part:             ["snippet"],
        q:                query,
        type:             ["video"],
        maxResults:       5,
        videoCategoryId:  "10", // Music
        relevanceLanguage:"pt",
        regionCode:       "BR",
      });

      const items = response.data.items;
      if (!items || items.length === 0) return null;

      // Prioriza vídeos VEVO ou do canal oficial do artista
      const artistLower = artistName.toLowerCase();
      const best =
        items.find((item) =>
          item.snippet?.channelTitle?.toLowerCase().includes("vevo")
        ) ??
        items.find((item) =>
          item.snippet?.channelTitle?.toLowerCase().includes(artistLower)
        ) ??
        items[0];

      const videoId = best.id?.videoId;
      if (!videoId) return null;

      const result: YouTubeResult = {
        videoId,
        title:        best.snippet?.title ?? trackName,
        channelTitle: best.snippet?.channelTitle ?? "",
        thumbnail:    best.snippet?.thumbnails?.high?.url ?? "",
        youtubeUrl:   `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl:     `https://www.youtube.com/embed/${videoId}`,
      };

      await redis.set(cacheKey, JSON.stringify(result), { ex: TTL.YOUTUBE_SEARCH });
      return result;
    } catch (err) {
      console.error(`YouTube search error for "${query}":`, err);
      return null;
    }
  }

  // ─── Enriquece array de tracks em paralelo ─────────────────────────────────

  async enrichTracks(
    tracks: SpotifyTrack[],
    momentTag: string
  ): Promise<EnrichedTrack[]> {
    // Processar em lotes de 5 para não estourar rate limit do YouTube
    const results: EnrichedTrack[] = [];
    const batchSize = 5;

    for (let i = 0; i < tracks.length; i += batchSize) {
      const batch = tracks.slice(i, i + batchSize);
      const settled = await Promise.allSettled(
        batch.map(async (track) => {
          const youtube = await this.findVideoForTrack(track.name, track.artist);
          return {
            ...track,
            youtube:     youtube ?? null,
            fitScore:    0.5, // placeholder — será calculado pelo ranker
            fitReason:   "",
            status:      "pending" as const,
            curatorNote: null,
            isMandatory: false,
            momentTag,
          };
        })
      );

      for (const r of settled) {
        if (r.status === "fulfilled") results.push(r.value);
      }
    }

    return results;
  }
}
