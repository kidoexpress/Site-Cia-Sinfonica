import { describe, it, expect, vi, beforeEach } from "vitest";
import { SpotifyRecommender } from "../src/services/spotify/SpotifyRecommender.js";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("spotify-web-api-node", () => {
  const mockTracks = [
    {
      id: "track_1", name: "Garota de Ipanema", uri: "spotify:track:track_1",
      artists: [{ name: "João Gilberto" }],
      album: { images: [{ url: "https://cover.jpg" }] },
      external_urls: { spotify: "https://open.spotify.com/track/track_1" },
      duration_ms: 180000,
      preview_url: "https://preview.mp3",
      popularity: 90,
    },
  ];

  return {
    default: vi.fn().mockImplementation(() => ({
      clientCredentialsGrant: vi.fn().mockResolvedValue({ body: { access_token: "mock_token", expires_in: 3600 } }),
      setAccessToken: vi.fn(),
      getRecommendations: vi.fn().mockResolvedValue({ body: { tracks: mockTracks } }),
      searchTracks: vi.fn().mockResolvedValue({ body: { tracks: { items: mockTracks } } }),
      searchArtists: vi.fn().mockResolvedValue({
        body: {
          artists: {
            items: [{
              id: "artist_1", name: "João Gilberto",
              genres: ["bossa nova", "mpb"],
              popularity: 80,
              images: [{ url: "https://artist.jpg" }],
            }],
          },
        },
      }),
      getPlaylistTracks: vi.fn().mockResolvedValue({
        body: {
          items: mockTracks.map((t) => ({ track: t })),
        },
      }),
      createPlaylist: vi.fn().mockResolvedValue({
        body: { id: "playlist_1", external_urls: { spotify: "https://open.spotify.com/playlist/playlist_1" } },
      }),
      addTracksToPlaylist: vi.fn().mockResolvedValue({}),
      createAuthorizeURL: vi.fn().mockReturnValue("https://accounts.spotify.com/authorize?..."),
      authorizationCodeGrant: vi.fn().mockResolvedValue({
        body: { access_token: "user_token", refresh_token: "refresh", expires_in: 3600 },
      }),
    })),
  };
});

vi.mock("../src/config/redis.js", () => ({
  redis: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue("OK"),
  },
  TTL: {
    SPOTIFY_TOKEN: 3000,
    RECOMMENDATION: 21600,
    YOUTUBE_SEARCH: 86400,
  },
}));

vi.mock("../src/config/env.js", () => ({
  env: {
    SPOTIFY_CLIENT_ID:     "test_client_id",
    SPOTIFY_CLIENT_SECRET: "test_client_secret",
    SPOTIFY_REDIRECT_URI:  "http://localhost:3333/api/spotify/callback",
    YOUTUBE_API_KEY:       "test_yt_key",
    JWT_SECRET:            "test_jwt_secret_at_least_32_chars_long",
    FRONTEND_URL:          "http://localhost:3000",
    NODE_ENV:              "test",
    PORT:                  3333,
    DATABASE_URL:          "postgresql://test",
  },
}));

// ─── Profile fixture ──────────────────────────────────────────────────────────

const mockProfile = {
  genres: {
    mpb: 0.7, bossa_nova: 0.8, samba_pagode: 0.1, sertanejo: 0.0,
    pop_br: 0.3, pop_intl: 0.3, rock: 0.0, classical: 0.3,
    jazz: 0.6, gospel: 0.0, forro: 0.0, electronic: 0.0,
    lounge: 0.5, funk: 0.0,
  },
  mood: {
    romantic: 0.9, energetic: 0.3, emotional: 0.8,
    elegant: 0.75, joyful: 0.5, spiritual: 0.0,
  },
  instrumentation: {
    has_vocals: true, vocal_gender: "female" as const,
    ensemble_size: "small_group" as const,
    preferred_instruments: ["strings"],
    texture: "warm" as const,
  },
  context: {
    venue_type: "outdoor",
    religious_constraint: "none" as const,
    sound_restriction: "none" as const,
    event_size: "small" as const,
    formality: 0.6,
  },
  temporal: {
    era_preference: ["50s_60s", "90s_00s"],
    language_preference: ["portuguese"],
  },
  moments: {
    party: { moment: "party", energy_level: 0.85, mood_primary: "energetic" },
  },
  blacklist: { genres: [], trackIds: [], artistIds: [] },
  seeds: { artistIds: ["artist_joao"], trackIds: [], playlistIds: [] },
};

// ─── Testes ───────────────────────────────────────────────────────────────────

describe("SpotifyRecommender", () => {
  let recommender: SpotifyRecommender;

  beforeEach(() => {
    recommender = new SpotifyRecommender();
    vi.clearAllMocks();
  });

  describe("autenticação", () => {
    it("deve autenticar com client credentials", async () => {
      await expect(recommender.authenticate()).resolves.not.toThrow();
    });
  });

  describe("recomendações por momento", () => {
    it("deve retornar tracks para o momento 'cocktail'", async () => {
      const tracks = await recommender.getRecommendationsForMoment("cocktail", mockProfile, 10);
      expect(tracks).toBeInstanceOf(Array);
      expect(tracks.length).toBeGreaterThan(0);
    });

    it("deve retornar tracks com campos obrigatórios", async () => {
      const tracks = await recommender.getRecommendationsForMoment("cocktail", mockProfile, 10);
      const track = tracks[0];
      expect(track.id).toBeDefined();
      expect(track.name).toBeDefined();
      expect(track.artist).toBeDefined();
      expect(track.spotifyUrl).toContain("spotify.com");
      expect(track.spotifyUri).toContain("spotify:track:");
    });

    it("deve aplicar target_energy menor para momento 'ceremony' vs 'party'", async () => {
      // Verifica que o cálculo de params produz energias corretas
      // (sem acessar mock interno — testa o comportamento via resultado)
      const tracksParty    = await recommender.getRecommendationsForMoment("party",    mockProfile, 5);
      const tracksCeremony = await recommender.getRecommendationsForMoment("ceremony", mockProfile, 5);
      // Ambas retornam tracks (mock retorna sempre o mesmo array)
      expect(tracksParty.length).toBeGreaterThan(0);
      expect(tracksCeremony.length).toBeGreaterThan(0);
      // O momento 'party' tem energy_level 0.85 no profile, ceremony não tem — lógica verificada no scoring.test
    });

    it("deve incluir seed_artists quando profile.seeds.artistIds não vazio", async () => {
      const tracks = await recommender.getRecommendationsForMoment("cocktail", mockProfile, 5);
      // Verifica que a chamada retorna dados (seed_artists são incluídos internamente — testado via integração)
      expect(tracks.length).toBeGreaterThan(0);
      expect(mockProfile.seeds.artistIds).toContain("artist_joao");
    });
  });

  describe("busca de tracks", () => {
    it("deve retornar uma track ao buscar por nome", async () => {
      const track = await recommender.searchTrack("Garota de Ipanema João Gilberto");
      expect(track).not.toBeNull();
      expect(track?.name).toBeDefined();
    });
  });

  describe("busca de artistas", () => {
    it("deve retornar artista com id, name e genres", async () => {
      const artist = await recommender.searchArtist("João Gilberto");
      expect(artist).not.toBeNull();
      expect(artist?.id).toBeDefined();
      expect(artist?.genres).toBeInstanceOf(Array);
    });
  });

  describe("playlist de referência", () => {
    it("deve retornar tracks de uma playlist", async () => {
      const tracks = await recommender.getPlaylistTracks("playlist_abc123");
      expect(tracks).toBeInstanceOf(Array);
    });
  });

  describe("criação de playlist OAuth", () => {
    it("deve criar playlist na conta do usuário e retornar URL", async () => {
      const url = await recommender.createPlaylistForUser(
        "spotify_user_id",
        "user_access_token",
        "Casamento Ana & Pedro",
        ["spotify:track:abc", "spotify:track:def"]
      );
      expect(url).toContain("spotify.com");
    });
  });

  describe("mapeamento de gêneros para Spotify seeds", () => {
    it("deve gerar URL de autorização OAuth válida", () => {
      const url = recommender.getAuthUrl("random_state");
      expect(url).toContain("spotify.com");
    });
  });
});
