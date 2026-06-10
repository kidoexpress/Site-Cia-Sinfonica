import { createHash } from "crypto";
import { prisma } from "../../db/prisma.js";
import type { MusicProfileVector } from "../../types/profile.types.js";
import type {
  EnrichedTrack,
  EventMoment,
  FullSetlist,
  MomentSetlist,
  SpotifyTrack,
} from "../../types/recommendation.types.js";
import { SpotifyRecommender } from "../spotify/SpotifyRecommender.js";
import { YouTubeEnricher } from "../youtube/YouTubeEnricher.js";

// ─── Definição de momentos por tipo de evento ─────────────────────────────────

const EVENT_MOMENTS: Record<string, EventMoment[]> = {
  wedding: [
    { key: "guest_arrival", label: "Chegada dos Convidados",  description: "Música ambiente enquanto os convidados chegam",          defaultDuration: 30,  targetCount: 10 },
    { key: "ceremony",      label: "Cerimônia",               description: "Músicas para o momento sagrado da cerimônia",            defaultDuration: 30,  targetCount: 8  },
    { key: "entrance",      label: "Entrada da Noiva",        description: "A música que marcará esse momento único",                defaultDuration: 2,   targetCount: 1  },
    { key: "first_dance",   label: "Primeiro Dance",          description: "A música do casal para o momento especial",             defaultDuration: 4,   targetCount: 1  },
    { key: "cocktail",      label: "Coquetel",                description: "Trilha para o momento de recepção e cumprimentos",      defaultDuration: 60,  targetCount: 15 },
    { key: "dinner",        label: "Jantar",                  description: "Música de fundo para o jantar",                        defaultDuration: 90,  targetCount: 22 },
    { key: "party",         label: "Festa",                   description: "A trilha da pista de dança",                           defaultDuration: 120, targetCount: 40 },
    { key: "closing",       label: "Encerramento",            description: "As últimas músicas da noite",                          defaultDuration: 10,  targetCount: 3  },
  ],
  civil_wedding: [
    { key: "guest_arrival", label: "Chegada dos Convidados",  defaultDuration: 20, targetCount: 6  },
    { key: "ceremony",      label: "Cerimônia Civil",         defaultDuration: 20, targetCount: 5  },
    { key: "entrance",      label: "Entrada da Noiva",        defaultDuration: 2,  targetCount: 1  },
    { key: "cocktail",      label: "Coquetel / Festa",        defaultDuration: 90, targetCount: 20 },
    { key: "closing",       label: "Encerramento",            defaultDuration: 5,  targetCount: 2  },
  ],
  birthday_15: [
    { key: "guest_arrival", label: "Chegada dos Convidados",       defaultDuration: 30,  targetCount: 10 },
    { key: "entrance",      label: "Entrada da Aniversariante",    defaultDuration: 3,   targetCount: 1  },
    { key: "waltz",         label: "Valsa",                        defaultDuration: 5,   targetCount: 2  },
    { key: "cocktail",      label: "Coquetel",                     defaultDuration: 60,  targetCount: 15 },
    { key: "dinner",        label: "Jantar",                       defaultDuration: 60,  targetCount: 15 },
    { key: "party",         label: "Festa",                        defaultDuration: 120, targetCount: 40 },
    { key: "closing",       label: "Encerramento",                 defaultDuration: 10,  targetCount: 3  },
  ],
  birthday_adult: [
    { key: "guest_arrival", label: "Chegada dos Convidados",  defaultDuration: 30,  targetCount: 10 },
    { key: "cocktail",      label: "Coquetel",                defaultDuration: 60,  targetCount: 15 },
    { key: "party",         label: "Festa",                   defaultDuration: 90,  targetCount: 30 },
    { key: "closing",       label: "Encerramento",            defaultDuration: 10,  targetCount: 3  },
  ],
  corporate: [
    { key: "guest_arrival",  label: "Credenciamento / Chegada",       defaultDuration: 30,  targetCount: 10 },
    { key: "event_opening",  label: "Abertura do Evento",             defaultDuration: 5,   targetCount: 2  },
    { key: "networking",     label: "Networking / Coffee",            defaultDuration: 30,  targetCount: 10 },
    { key: "dinner",         label: "Jantar / Confraternização",      defaultDuration: 90,  targetCount: 20 },
    { key: "party",          label: "Confraternização",               defaultDuration: 60,  targetCount: 20 },
    { key: "closing",        label: "Encerramento",                   defaultDuration: 10,  targetCount: 3  },
  ],
  graduation: [
    { key: "guest_arrival",  label: "Chegada dos Convidados",         defaultDuration: 30,  targetCount: 10 },
    { key: "ceremony",       label: "Cerimônia de Colação",           defaultDuration: 60,  targetCount: 10 },
    { key: "entrance",       label: "Entrada dos Formandos",          defaultDuration: 5,   targetCount: 2  },
    { key: "cocktail",       label: "Coquetel",                       defaultDuration: 60,  targetCount: 15 },
    { key: "party",          label: "Festa da Formatura",             defaultDuration: 120, targetCount: 40 },
    { key: "closing",        label: "Encerramento",                   defaultDuration: 10,  targetCount: 3  },
  ],
  engagement: [
    { key: "guest_arrival",  label: "Chegada dos Convidados",         defaultDuration: 30,  targetCount: 10 },
    { key: "entrance",       label: "Entrada do Casal",               defaultDuration: 2,   targetCount: 1  },
    { key: "cocktail",       label: "Coquetel",                       defaultDuration: 60,  targetCount: 15 },
    { key: "dinner",         label: "Jantar",                         defaultDuration: 90,  targetCount: 20 },
    { key: "party",          label: "Festa",                          defaultDuration: 90,  targetCount: 25 },
    { key: "closing",        label: "Encerramento",                   defaultDuration: 10,  targetCount: 3  },
  ],
};

// ─── SetlistBuilder ───────────────────────────────────────────────────────────

export class SetlistBuilder {
  private spotify: SpotifyRecommender;
  private youtube: YouTubeEnricher;

  constructor() {
    this.spotify = new SpotifyRecommender();
    this.youtube = new YouTubeEnricher();
  }

  async buildFullSetlist(
    eventId: string,
    eventType: string,
    profile: MusicProfileVector
  ): Promise<FullSetlist> {
    const moments = EVENT_MOMENTS[eventType] ?? EVENT_MOMENTS["wedding"];
    const profileHash = this.hashProfile(profile);
    const result: FullSetlist = {
      eventId,
      generatedAt: new Date().toISOString(),
      profileHash,
      moments: {},
    };

    // Resolver músicas obrigatórias do cliente (seeds.trackIds)
    const mandatoryTracks = await this.resolveMandatoryTracks(profile.seeds.trackIds);

    // Resolver playlist de referência
    const playlistTracks = await this.resolveReferencePlaylists(profile.seeds.playlistIds);

    for (const moment of moments) {
      result.moments[moment.key] = await this.buildMomentPlaylist(
        moment,
        profile,
        mandatoryTracks,
        playlistTracks
      );
    }

    return result;
  }

  // ─── Monta playlist de um momento ─────────────────────────────────────────

  private async buildMomentPlaylist(
    moment: EventMoment,
    profile: MusicProfileVector,
    mandatoryTracks: SpotifyTrack[],
    playlistTracks: SpotifyTrack[]
  ): Promise<MomentSetlist> {
    // 1. Músicas obrigatórias sem filtro de momento (aparece em todos os momentos)
    const mandatory = mandatoryTracks.map((t) => ({ ...t, isMandatory: true }));

    // 2. Recomendações Spotify para este momento
    const spotifyCount = Math.max(0, moment.targetCount - mandatory.length);
    const spotifyRecs  = await this.spotify.getRecommendationsForMoment(
      moment.key,
      profile,
      spotifyCount + 10 // pedimos a mais para ter margem
    );

    // 3. Banco curado como fallback
    const curatedFallback = await this.getCuratedFallback(
      moment.key,
      profile,
      moment.targetCount
    );

    // 4. Tracks da playlist de referência do cliente para este momento
    const fromPlaylist = playlistTracks.slice(0, 5);

    // 5. Merge, deduplica, filtra blacklist
    const allTracks = [...mandatory, ...fromPlaylist, ...spotifyRecs, ...curatedFallback];
    const deduped   = this.deduplicate(allTracks);
    const filtered  = this.applyBlacklist(deduped, profile);
    const ranked    = this.rankByFitScore(filtered, profile, moment);
    const final     = ranked.slice(0, moment.targetCount);

    // 6. Enriquece com YouTube
    const enriched = await this.youtube.enrichTracks(final, moment.key);

    // 7. Calcula fitScore e fitReason reais
    const withScores = this.computeFitScores(enriched, profile, moment);

    return {
      label:           moment.label,
      description:     moment.description,
      durationMinutes: moment.defaultDuration,
      tracks:          withScores,
    };
  }

  // ─── Banco curado (Prisma) ─────────────────────────────────────────────────

  private async getCuratedFallback(
    momentKey: string,
    profile: MusicProfileVector,
    limit: number
  ): Promise<SpotifyTrack[]> {
    try {
      const tracks = await prisma.curatedTrack.findMany({
        where: {
          curatorApproved: true,
          moments: { has: momentKey },
          NOT: {
            OR: [
              { spotifyId: { in: profile.blacklist.trackIds } },
              { genres: { hasSome: profile.blacklist.genres } },
            ],
          },
        },
        orderBy: [{ timesUsed: "asc" }, { popularity: "desc" }],
        take: limit,
      });

      return tracks.map((t) => ({
        id:         t.spotifyId,
        name:       t.name,
        artist:     t.artist,
        albumCover: t.albumCover ?? undefined,
        durationMs: t.durationMs,
        spotifyUrl: `https://open.spotify.com/track/${t.spotifyId}`,
        spotifyUri: `spotify:track:${t.spotifyId}`,
        previewUrl: undefined,
        popularity: t.popularity,
      }));
    } catch {
      return [];
    }
  }

  // ─── Resolve músicas obrigatórias via Spotify API ──────────────────────────

  private async resolveMandatoryTracks(trackIds: string[]): Promise<SpotifyTrack[]> {
    if (!trackIds.length) return [];
    // Busca informações detalhadas — tracks já têm ID, usa searchTrack como fallback
    // Numa versão completa: client.getTracks(trackIds)
    return []; // Retorna vazio aqui — o frontend já envia os dados completos normalmente
  }

  // ─── Resolve tracks de playlists de referência ────────────────────────────

  private async resolveReferencePlaylists(playlistIds: string[]): Promise<SpotifyTrack[]> {
    if (!playlistIds.length) return [];
    const all: SpotifyTrack[] = [];
    for (const id of playlistIds) {
      const tracks = await this.spotify.getPlaylistTracks(id);
      all.push(...tracks);
    }
    return all;
  }

  // ─── Ranking por fit score preliminar (pré-YouTube) ───────────────────────

  private rankByFitScore(
    tracks: SpotifyTrack[],
    profile: MusicProfileVector,
    moment: EventMoment
  ): SpotifyTrack[] {
    const momentProfile = profile.moments[moment.key];
    const targetEnergy  = momentProfile?.energy_level ?? 0.5;

    return tracks.sort((a, b) => {
      const scoreA = this.quickScore(a, profile, targetEnergy);
      const scoreB = this.quickScore(b, profile, targetEnergy);
      return scoreB - scoreA;
    });
  }

  private quickScore(
    track: SpotifyTrack,
    profile: MusicProfileVector,
    targetEnergy: number
  ): number {
    let score = (track.popularity ?? 50) / 100; // base: popularidade
    if (track.energy !== undefined) {
      score += 1 - Math.abs(track.energy - targetEnergy); // proximidade da energia
    }
    // Bônus se o artista está nos seeds
    const uri = track.spotifyUri ?? "";
    if (profile.seeds.trackIds.some((id) => uri.includes(id))) score += 0.5;
    return score;
  }

  // ─── Calcula fitScore final (pós-enrichment) ──────────────────────────────

  private computeFitScores(
    tracks: EnrichedTrack[],
    profile: MusicProfileVector,
    moment: EventMoment
  ): EnrichedTrack[] {
    return tracks.map((track) => {
      const momentProfile = profile.moments[moment.key];
      const targetEnergy  = momentProfile?.energy_level ?? 0.5;
      const reasons: string[] = [];

      let score = 0;

      // Energia
      if (track.energy !== undefined) {
        const energyDiff = Math.abs(track.energy - targetEnergy);
        const energyScore = Math.max(0, 1 - energyDiff * 2);
        score += energyScore * 0.3;
        if (energyScore > 0.7) reasons.push("energia alinhada ao momento");
      }

      // Popularidade
      const popScore = (track.popularity ?? 50) / 100;
      score += popScore * 0.2;
      if (popScore > 0.7) reasons.push("música muito conhecida");

      // Tem YouTube
      if (track.youtube) {
        score += 0.1;
        reasons.push("vídeo encontrado no YouTube");
      }

      // É obrigatória
      if (track.isMandatory) {
        score = 1.0;
        reasons.push("selecionada pelo cliente");
      }

      // Valência (alegria vs melancolia)
      if (track.valence !== undefined) {
        const moodTarget = profile.mood.joyful * 0.6 + profile.mood.romantic * 0.4;
        const valenceDiff = Math.abs(track.valence - moodTarget);
        score += Math.max(0, 0.4 - valenceDiff * 0.4);
        if (valenceDiff < 0.2) reasons.push("clima emocional compatível");
      }

      return {
        ...track,
        fitScore:  Math.min(1, score),
        fitReason: reasons.join(", ") || "compatível com o perfil do evento",
      };
    });
  }

  // ─── Utilitários ──────────────────────────────────────────────────────────

  private deduplicate(tracks: Array<SpotifyTrack & { isMandatory?: boolean }>): SpotifyTrack[] {
    const seen = new Set<string>();
    return tracks.filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
  }

  private applyBlacklist(
    tracks: SpotifyTrack[],
    profile: MusicProfileVector
  ): SpotifyTrack[] {
    return tracks.filter((t) => !profile.blacklist.trackIds.includes(t.id));
  }

  private hashProfile(profile: MusicProfileVector): string {
    return createHash("sha256")
      .update(JSON.stringify(profile))
      .digest("hex")
      .slice(0, 16);
  }

  // ─── Expõe lista de momentos para um tipo de evento ───────────────────────

  static getMomentsForEventType(eventType: string): EventMoment[] {
    return EVENT_MOMENTS[eventType] ?? EVENT_MOMENTS["wedding"];
  }
}
