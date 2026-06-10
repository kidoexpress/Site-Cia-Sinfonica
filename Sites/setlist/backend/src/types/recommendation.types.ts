// ─── Spotify Track ────────────────────────────────────────────────────────────

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  albumCover?: string;
  durationMs: number;
  previewUrl?: string | null;
  spotifyUrl: string;
  spotifyUri: string;
  energy?: number;
  valence?: number;
  danceability?: number;
  acousticness?: number;
  instrumentalness?: number;
  popularity?: number;
}

// ─── YouTube Result ───────────────────────────────────────────────────────────

export interface YouTubeResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  youtubeUrl: string;
  embedUrl: string;
}

// ─── Enriched Track (Spotify + YouTube) ──────────────────────────────────────

export type TrackStatus = "pending" | "approved" | "rejected" | "mandatory";

export interface EnrichedTrack extends SpotifyTrack {
  fitScore: number;     // 0.0 – 1.0, calculado pelo ranker
  fitReason: string;    // explicação legível
  youtube?: YouTubeResult | null;
  status: TrackStatus;
  curatorNote?: string | null;
  isMandatory: boolean;
  momentTag: string;
}

// ─── Momento do Evento ────────────────────────────────────────────────────────

export interface EventMoment {
  key: string;
  label: string;
  description?: string;
  defaultDuration: number;  // minutos
  targetCount: number;      // qtd de músicas
}

export interface MomentSetlist {
  label: string;
  description?: string;
  durationMinutes: number;
  tracks: EnrichedTrack[];
}

// ─── Setlist Completo ─────────────────────────────────────────────────────────

export interface FullSetlist {
  eventId: string;
  generatedAt: string;
  profileHash: string;
  moments: Record<string, MomentSetlist>;
}

// ─── Parâmetros do Spotify Recommendations ───────────────────────────────────

export interface SpotifyRecommendationParams {
  seedArtists: string[];
  seedGenres: string[];
  targetEnergy: number;
  targetValence: number;
  targetDanceability: number;
  targetAcousticness: number;
  targetInstrumentalness: number;
  minPopularity: number;
}
