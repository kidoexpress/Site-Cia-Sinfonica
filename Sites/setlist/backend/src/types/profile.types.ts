// ─── Music Profile Vector ────────────────────────────────────────────────────
// Vetor de preferências musicais normalizado (0.0 – 1.0) gerado pelo ProfileScorer

export interface GenreScores {
  mpb: number;
  bossa_nova: number;
  samba_pagode: number;
  sertanejo: number;
  pop_br: number;
  pop_intl: number;
  rock: number;
  classical: number;
  jazz: number;
  gospel: number;
  forro: number;
  electronic: number;
  lounge: number;
  funk: number;
  [key: string]: number; // index signature para acesso dinâmico
}

export interface MoodScores {
  romantic: number;
  energetic: number;
  emotional: number;
  elegant: number;
  joyful: number;
  spiritual: number;
}

export interface InstrumentationProfile {
  has_vocals: boolean;
  vocal_gender: "female" | "male" | "mixed" | "none";
  ensemble_size: "solo" | "duo" | "small_group" | "full_band" | "orchestra";
  preferred_instruments: string[];
  texture: "minimal" | "warm" | "full" | "grand";
}

export interface ContextProfile {
  venue_type: string;
  ceremony_venue?: string;
  party_venue?: string;
  religious_constraint: "strict" | "mixed" | "none";
  sound_restriction: "none" | "moderate" | "strict";
  event_size: "intimate" | "small" | "medium" | "large";
  formality: number; // 0 = casual, 1 = black-tie
}

export interface TemporalProfile {
  era_preference: string[];
  language_preference: string[];
}

export interface MomentProfile {
  moment: string;
  energy_level: number;
  mood_primary: string;
  mood_secondary?: string;
  duration_minutes?: number;
  genre_bias?: Partial<GenreScores>;
}

export interface BlacklistProfile {
  genres: string[];
  trackIds: string[];
  artistIds: string[];
}

export interface SeedsProfile {
  artistIds: string[];
  trackIds: string[];
  playlistIds: string[];
  referenceText?: string; // filmes, novelas, etc.
}

export interface MusicProfileVector {
  genres: GenreScores;
  mood: MoodScores;
  instrumentation: InstrumentationProfile;
  context: ContextProfile;
  temporal: TemporalProfile;
  moments: Record<string, MomentProfile>;
  blacklist: BlacklistProfile;
  seeds: SeedsProfile;
}

// ─── Hash para invalidação de cache ─────────────────────────────────────────

export type ProfileHash = string; // SHA-256 do JSON do vetor
