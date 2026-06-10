import SpotifyWebApi from "spotify-web-api-node";
import { redis, TTL } from "../../config/redis.js";
import { env } from "../../config/env.js";
import type { MusicProfileVector } from "../../types/profile.types.js";
import type {
  SpotifyTrack,
  SpotifyRecommendationParams,
} from "../../types/recommendation.types.js";

// Mapeamento de gêneros internos → seeds válidos do Spotify
const SPOTIFY_GENRE_MAP: Record<string, string[]> = {
  mpb:          ["mpb", "brazilian"],
  bossa_nova:   ["bossa nova"],
  samba_pagode: ["pagode", "samba"],
  sertanejo:    ["sertanejo"],
  classical:    ["classical", "opera"],
  jazz:         ["jazz"],
  gospel:       ["gospel"],
  pop_br:       ["pop", "brazilian"],
  pop_intl:     ["pop"],
  rock:         ["rock", "indie"],
  electronic:   ["electronic", "house"],
  lounge:       ["jazz", "bossa nova"],
  forro:        ["forro"],
  funk:         ["funk"],
};

export class SpotifyRecommender {
  private client: SpotifyWebApi;

  constructor() {
    this.client = new SpotifyWebApi({
      clientId:     env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      redirectUri:  env.SPOTIFY_REDIRECT_URI,
    });
  }

  // ─── Autenticação (Client Credentials) ────────────────────────────────────

  async authenticate(): Promise<void> {
    // Tenta pegar token em cache primeiro
    const cached = await redis.get("spotify_token");
    if (cached) {
      this.client.setAccessToken(cached as string);
      return;
    }

    const data = await this.client.clientCredentialsGrant();
    const token = data.body.access_token;
    this.client.setAccessToken(token);

    await redis.set("spotify_token", token, { ex: TTL.SPOTIFY_TOKEN });
  }

  // ─── Recomendações por momento ─────────────────────────────────────────────

  async getRecommendationsForMoment(
    moment: string,
    profile: MusicProfileVector,
    limit = 20
  ): Promise<SpotifyTrack[]> {
    await this.authenticate();

    const params = this.buildSpotifyParams(moment, profile);
    const cacheKey = `spotify:rec:${moment}:${JSON.stringify(params)}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached as string) as SpotifyTrack[];

    // Spotify aceita no máximo 5 seeds no total (artists + genres + tracks)
    const seeds = this.buildSeeds(params, profile);

    try {
      const response = await this.client.getRecommendations({
        ...seeds,
        limit,
        target_energy:           params.targetEnergy,
        target_valence:          params.targetValence,
        target_danceability:     params.targetDanceability,
        target_acousticness:     params.targetAcousticness,
        target_instrumentalness: params.targetInstrumentalness,
        min_popularity:          params.minPopularity,
        market: "BR",
      });

      const tracks = response.body.tracks.map(this.mapSpotifyTrack);

      await redis.set(cacheKey, JSON.stringify(tracks), { ex: TTL.RECOMMENDATION });
      return tracks;
    } catch (err) {
      console.error("Spotify getRecommendations error:", err);
      return [];
    }
  }

  // ─── Busca de track por query ──────────────────────────────────────────────

  async searchTrack(query: string): Promise<SpotifyTrack | null> {
    await this.authenticate();
    const cacheKey = `spotify:search:track:${query}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached as string);

    try {
      const result = await this.client.searchTracks(query, { market: "BR", limit: 1 });
      const track = result.body.tracks?.items[0];
      if (!track) return null;

      const mapped = this.mapSpotifyTrack(track);
      await redis.set(cacheKey, JSON.stringify(mapped), { ex: TTL.YOUTUBE_SEARCH });
      return mapped;
    } catch {
      return null;
    }
  }

  // ─── Busca de artista por nome ─────────────────────────────────────────────

  async searchArtist(name: string) {
    await this.authenticate();
    const cacheKey = `spotify:search:artist:${name}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached as string);

    try {
      const result = await this.client.searchArtists(name, { limit: 1 });
      const artist = result.body.artists?.items[0];
      if (!artist) return null;

      const data = {
        id:        artist.id,
        name:      artist.name,
        genres:    artist.genres,
        popularity: artist.popularity,
        imageUrl:  artist.images[0]?.url,
      };

      await redis.set(cacheKey, JSON.stringify(data), { ex: TTL.YOUTUBE_SEARCH });
      return data;
    } catch {
      return null;
    }
  }

  // ─── Extrai tracks de playlist de referência ───────────────────────────────

  async getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
    await this.authenticate();
    const cacheKey = `spotify:playlist:${playlistId}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached as string);

    try {
      const result = await this.client.getPlaylistTracks(playlistId, {
        fields: "items(track(id,name,artists,album,external_urls,preview_url,duration_ms))",
        limit: 50,
      });

      const tracks = result.body.items
        .filter((item) => item.track)
        .map((item) => this.mapSpotifyTrack(item.track!));

      await redis.set(cacheKey, JSON.stringify(tracks), { ex: TTL.RECOMMENDATION });
      return tracks;
    } catch {
      return [];
    }
  }

  // ─── Cria playlist na conta do usuário (requer OAuth) ──────────────────────

  async createPlaylistForUser(
    userId: string,
    accessToken: string,
    eventName: string,
    trackUris: string[]
  ): Promise<string> {
    this.client.setAccessToken(accessToken);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playlist = await (this.client as any).createPlaylist(
      `🎵 ${eventName} — Repertório`,
      {
        description: "Playlist criada pela plataforma de curadoria musical Setlist",
        public: false,
        collaborative: false,
      }
    );

    // Spotify aceita no máximo 100 tracks por chamada
    const chunks = this.chunkArray(trackUris, 100);
    for (const chunk of chunks) {
      await this.client.addTracksToPlaylist(playlist.body.id, chunk);
    }

    return playlist.body.external_urls.spotify;
  }

  // ─── Gera URL OAuth ────────────────────────────────────────────────────────

  getAuthUrl(state: string): string {
    const scopes = [
      "playlist-modify-private",
      "playlist-modify-public",
      "user-read-private",
    ];
    return this.client.createAuthorizeURL(scopes, state);
  }

  // ─── Troca código por tokens ───────────────────────────────────────────────

  async exchangeCode(code: string) {
    const data = await this.client.authorizationCodeGrant(code);
    return {
      accessToken:  data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn:    data.body.expires_in,
    };
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private buildSpotifyParams(
    moment: string,
    profile: MusicProfileVector
  ): SpotifyRecommendationParams {
    const momentProfile = profile.moments[moment];

    // Gêneros com maior score → seeds
    const genresForMoment = momentProfile?.genre_bias
      ? { ...profile.genres, ...momentProfile.genre_bias }
      : profile.genres;

    const topGenres = (Object.entries(genresForMoment) as [string, number][])
      .filter(([g]) => !profile.blacklist.genres.includes(g))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .flatMap(([genre]) => SPOTIFY_GENRE_MAP[genre] ?? [])
      .slice(0, 5);

    const uniqueGenres = [...new Set(topGenres)].slice(0, 5);

    return {
      seedArtists:             profile.seeds.artistIds.slice(0, 2),
      seedGenres:              uniqueGenres,
      targetEnergy:            momentProfile?.energy_level ?? profile.mood.energetic,
      targetValence:           profile.mood.joyful * 0.6 + profile.mood.romantic * 0.4,
      targetDanceability:      moment === "party" ? 0.8 : moment === "cocktail" ? 0.45 : 0.35,
      targetAcousticness:      profile.instrumentation.texture === "minimal" ? 0.8 : 0.3,
      targetInstrumentalness:  !profile.instrumentation.has_vocals ? 0.8 : 0.1,
      minPopularity:           profile.context.event_size === "large" ? 50 : 20,
    };
  }

  private buildSeeds(
    params: SpotifyRecommendationParams,
    profile: MusicProfileVector
  ): {
    seed_artists?: string[];
    seed_genres?: string[];
    seed_tracks?: string[];
  } {
    // Máximo 5 seeds no total
    const artistSeeds = params.seedArtists.slice(0, 2);
    const trackSeeds  = profile.seeds.trackIds.slice(0, 1);
    const remaining   = 5 - artistSeeds.length - trackSeeds.length;
    const genreSeeds  = params.seedGenres.slice(0, remaining);

    return {
      ...(artistSeeds.length > 0 && { seed_artists: artistSeeds }),
      ...(genreSeeds.length > 0  && { seed_genres:  genreSeeds  }),
      ...(trackSeeds.length > 0  && { seed_tracks:  trackSeeds  }),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapSpotifyTrack(t: any): SpotifyTrack {
    return {
      id:               t.id,
      name:             t.name,
      artist:           t.artists?.[0]?.name ?? "Unknown",
      albumCover:       t.album?.images?.[0]?.url,
      durationMs:       t.duration_ms,
      previewUrl:       t.preview_url,
      spotifyUrl:       t.external_urls?.spotify,
      spotifyUri:       t.uri,
      popularity:       t.popularity,
    };
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  }
}
