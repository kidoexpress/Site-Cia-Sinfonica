import { describe, it, expect, vi, beforeEach } from "vitest";
import { SetlistBuilder } from "../src/services/recommendation/SetlistBuilder.js";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("../src/db/prisma.js", () => ({
  prisma: {
    event: {
      findUniqueOrThrow: vi.fn().mockResolvedValue({ id: "evt_1", type: "WEDDING" }),
      update: vi.fn(),
    },
    recommendationCache: {
      upsert: vi.fn(),
      findUnique: vi.fn().mockResolvedValue(null),
    },
    quizSession: {
      findFirst: vi.fn().mockResolvedValue(null),
    },
    curatedTrack: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

vi.mock("../src/services/spotify/SpotifyRecommender.js", () => ({
  SpotifyRecommender: vi.fn().mockImplementation(() => ({
    getRecommendationsForMoment: vi.fn().mockResolvedValue([
      {
        id: "spotify_1",
        name: "Canon in D",
        artist: "Pachelbel",
        durationMs: 230000,
        spotifyUrl: "https://open.spotify.com/track/spotify_1",
        spotifyUri: "spotify:track:spotify_1",
        energy: 0.3,
        popularity: 85,
      },
    ]),
    getPlaylistTracks: vi.fn().mockResolvedValue([]),
    authenticate: vi.fn(),
  })),
}));

vi.mock("../src/services/youtube/YouTubeEnricher.js", () => ({
  YouTubeEnricher: vi.fn().mockImplementation(() => ({
    enrichTracks: vi.fn().mockImplementation(async (tracks: unknown[], moment: string) =>
      (tracks as Array<Record<string, unknown>>).map((t) => ({
        ...t,
        youtube: {
          videoId: "yt_abc",
          title:   `${t["name"]} - YouTube`,
          channelTitle: "ClassicalChannel",
          thumbnail: "https://i.ytimg.com/vi/yt_abc/hq.jpg",
          youtubeUrl: "https://www.youtube.com/watch?v=yt_abc",
          embedUrl:   "https://www.youtube.com/embed/yt_abc",
        },
        fitScore:    0.5,
        fitReason:   "compatível",
        status:      "pending",
        curatorNote: null,
        isMandatory: false,
        momentTag:   moment,
      }))
    ),
  })),
}));

// ─── Profile fixture ──────────────────────────────────────────────────────────

const mockProfile = {
  genres: {
    mpb: 0.5, bossa_nova: 0.3, samba_pagode: 0.0, sertanejo: 0.0,
    pop_br: 0.3, pop_intl: 0.4, rock: 0.1, classical: 0.8,
    jazz: 0.6, gospel: 0.0, forro: 0.0, electronic: 0.0,
    lounge: 0.4, funk: 0.0,
  },
  mood: {
    romantic: 0.9, energetic: 0.3, emotional: 0.8,
    elegant: 0.8, joyful: 0.5, spiritual: 0.0,
  },
  instrumentation: {
    has_vocals: true,
    vocal_gender: "female" as const,
    ensemble_size: "small_group" as const,
    preferred_instruments: ["strings", "piano"],
    texture: "full" as const,
  },
  context: {
    venue_type: "hotel_ballroom",
    religious_constraint: "none" as const,
    sound_restriction: "none" as const,
    event_size: "medium" as const,
    formality: 0.8,
  },
  temporal: {
    era_preference: ["90s_00s", "current"],
    language_preference: ["portuguese", "english"],
  },
  moments: {
    party: { moment: "party", energy_level: 0.85, mood_primary: "energetic" },
    cocktail: { moment: "cocktail", energy_level: 0.35, mood_primary: "elegant" },
  },
  blacklist: { genres: ["funk", "sertanejo"], trackIds: ["banned_track_1"], artistIds: [] },
  seeds: { artistIds: ["artist_chico"], trackIds: [], playlistIds: [] },
};

// ─── Testes ───────────────────────────────────────────────────────────────────

describe("SetlistBuilder", () => {
  let builder: SetlistBuilder;

  beforeEach(() => {
    builder = new SetlistBuilder();
    vi.clearAllMocks();
  });

  it("deve retornar momentos corretos para casamento", () => {
    const moments = SetlistBuilder.getMomentsForEventType("wedding");
    const keys = moments.map((m) => m.key);
    expect(keys).toContain("guest_arrival");
    expect(keys).toContain("ceremony");
    expect(keys).toContain("entrance");
    expect(keys).toContain("first_dance");
    expect(keys).toContain("cocktail");
    expect(keys).toContain("dinner");
    expect(keys).toContain("party");
    expect(keys).toContain("closing");
  });

  it("deve retornar momentos corretos para formatura", () => {
    const moments = SetlistBuilder.getMomentsForEventType("graduation");
    const keys = moments.map((m) => m.key);
    expect(keys).toContain("ceremony");
    expect(keys).toContain("party");
    expect(keys).not.toContain("first_dance");
  });

  it("deve retornar momentos corretos para evento corporativo", () => {
    const moments = SetlistBuilder.getMomentsForEventType("corporate");
    const keys = moments.map((m) => m.key);
    expect(keys).toContain("networking");
    expect(keys).toContain("event_opening");
    expect(keys).not.toContain("entrance");
  });

  it("deve gerar setlist completo para casamento com links Spotify e YouTube", async () => {
    const setlist = await builder.buildFullSetlist("evt_1", "wedding", mockProfile);

    expect(setlist.eventId).toBe("evt_1");
    expect(setlist.generatedAt).toBeDefined();
    expect(setlist.profileHash).toBeDefined();
    expect(Object.keys(setlist.moments).length).toBeGreaterThan(0);

    // Verifica que cada momento tem tracks com links
    for (const [, momentData] of Object.entries(setlist.moments)) {
      if (momentData.tracks.length > 0) {
        const track = momentData.tracks[0];
        expect(track.spotifyUrl).toContain("spotify");
        expect(track.youtube).toBeDefined();
        expect(track.youtube?.youtubeUrl).toContain("youtube.com");
      }
    }
  });

  it("deve excluir tracks na blacklist", async () => {
    const profileWithBlacklist = {
      ...mockProfile,
      blacklist: {
        genres: [],
        trackIds: ["spotify_1"], // ID do mock deve ser excluído
        artistIds: [],
      },
    };

    const setlist = await builder.buildFullSetlist("evt_1", "wedding", profileWithBlacklist);

    for (const moment of Object.values(setlist.moments)) {
      const hasBlacklisted = moment.tracks.some((t) => t.id === "spotify_1");
      expect(hasBlacklisted).toBe(false);
    }
  });

  it("deve gerar hash de perfil consistente", async () => {
    const setlist1 = await builder.buildFullSetlist("evt_1", "wedding", mockProfile);
    const setlist2 = await builder.buildFullSetlist("evt_1", "wedding", mockProfile);
    expect(setlist1.profileHash).toBe(setlist2.profileHash);
  });

  it("deve gerar hash diferente para perfis diferentes", async () => {
    const altProfile = { ...mockProfile, mood: { ...mockProfile.mood, romantic: 0.1 } };
    const setlist1 = await builder.buildFullSetlist("evt_1", "wedding", mockProfile);
    const setlist2 = await builder.buildFullSetlist("evt_1", "wedding", altProfile);
    expect(setlist1.profileHash).not.toBe(setlist2.profileHash);
  });

  it("deve incluir fitScore em cada track", async () => {
    const setlist = await builder.buildFullSetlist("evt_1", "wedding", mockProfile);
    for (const moment of Object.values(setlist.moments)) {
      for (const track of moment.tracks) {
        expect(typeof track.fitScore).toBe("number");
        expect(track.fitScore).toBeGreaterThanOrEqual(0);
        expect(track.fitScore).toBeLessThanOrEqual(1);
      }
    }
  });

  it("deve deduplicar tracks repetidas", async () => {
    const setlist = await builder.buildFullSetlist("evt_1", "wedding", mockProfile);
    for (const moment of Object.values(setlist.moments)) {
      const ids = moment.tracks.map((t) => t.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    }
  });
});
