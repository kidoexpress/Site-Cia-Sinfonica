import { prisma } from "../../db/prisma.js";
import { SetlistBuilder } from "../../services/recommendation/SetlistBuilder.js";
import { SpotifyRecommender } from "../../services/spotify/SpotifyRecommender.js";
import type { MusicProfileVector } from "../../types/profile.types.js";
import type { FullSetlist } from "../../types/recommendation.types.js";

const spotify = new SpotifyRecommender();

export class RecommendationService {
  // ─── Retorna setlist completo do evento ───────────────────────────────────

  async getSetlist(eventId: string): Promise<FullSetlist> {
    // Busca cache
    const cache = await prisma.recommendationCache.findUnique({
      where: { eventId },
    });

    if (cache && new Date() < cache.expiresAt) {
      return cache.setlistJson as unknown as FullSetlist;
    }

    // Cache expirado ou inexistente: regenera
    return this.generateSetlist(eventId);
  }

  // ─── Retorna tracks de um momento específico ──────────────────────────────

  async getMomentTracks(eventId: string, moment: string) {
    const setlist = await this.getSetlist(eventId);
    const momentData = setlist.moments[moment];
    if (!momentData) throw new Error(`Momento '${moment}' não encontrado.`);
    return momentData;
  }

  // ─── Regenera recomendações para um momento ───────────────────────────────

  async regenerateMoment(eventId: string, moment: string) {
    const event = await prisma.event.findUniqueOrThrow({ where: { id: eventId } });
    const quizSession = await prisma.quizSession.findFirst({
      where:   { eventId, status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
    });

    if (!quizSession?.profileVector) {
      throw new Error("Perfil musical não encontrado. Conclua o quiz primeiro.");
    }

    const profile   = quizSession.profileVector as unknown as MusicProfileVector;
    const moments   = SetlistBuilder.getMomentsForEventType(event.type.toLowerCase());
    const momentDef = moments.find((m) => m.key === moment);
    if (!momentDef) throw new Error(`Momento '${moment}' inválido para este tipo de evento.`);

    // Busca setlist atual
    const cache = await prisma.recommendationCache.findUnique({ where: { eventId } });
    const currentSetlist = cache?.setlistJson as unknown as FullSetlist | null;

    // Regenera apenas o momento solicitado
    const builder = new SetlistBuilder();
    const newSetlist = await builder.buildFullSetlist(
      eventId,
      event.type.toLowerCase(),
      profile
    );

    const updatedSetlist: FullSetlist = {
      ...(currentSetlist ?? newSetlist),
      moments: {
        ...(currentSetlist?.moments ?? {}),
        [moment]: newSetlist.moments[moment],
      },
    };

    await prisma.recommendationCache.upsert({
      where:  { eventId },
      update: {
        setlistJson: updatedSetlist as object,
        generatedAt: new Date(),
        expiresAt:   new Date(Date.now() + 6 * 60 * 60 * 1000),
      },
      create: {
        eventId,
        setlistJson: updatedSetlist as object,
        profileHash: updatedSetlist.profileHash,
        expiresAt:   new Date(Date.now() + 6 * 60 * 60 * 1000),
      },
    });

    return updatedSetlist.moments[moment];
  }

  // ─── Busca tracks via Spotify ─────────────────────────────────────────────

  async searchTracks(query: string, limit = 10) {
    await spotify.authenticate();
    // Retorna resultados simplificados para o frontend
    return spotify.searchTrack(query);
  }

  async searchArtists(query: string) {
    return spotify.searchArtist(query);
  }

  // ─── Fixa uma track em um momento (ação do curador) ───────────────────────

  async pinTrack(eventId: string, trackId: string, moment: string) {
    const cache = await prisma.recommendationCache.findUniqueOrThrow({ where: { eventId } });
    const setlist = cache.setlistJson as unknown as FullSetlist;

    const momentData = setlist.moments[moment];
    if (!momentData) throw new Error(`Momento '${moment}' não encontrado.`);

    // Marca a track como aprovada/fixada
    const track = momentData.tracks.find((t) => t.id === trackId);
    if (track) track.status = "approved";

    await prisma.recommendationCache.update({
      where: { eventId },
      data:  { setlistJson: setlist as object },
    });

    return { success: true };
  }

  // ─── Remove uma track do setlist ──────────────────────────────────────────

  async removeTrack(eventId: string, trackId: string) {
    const cache = await prisma.recommendationCache.findUniqueOrThrow({ where: { eventId } });
    const setlist = cache.setlistJson as unknown as FullSetlist;

    for (const moment of Object.values(setlist.moments)) {
      moment.tracks = moment.tracks.filter((t) => t.id !== trackId);
    }

    await prisma.recommendationCache.update({
      where: { eventId },
      data:  { setlistJson: setlist as object },
    });

    return { success: true };
  }

  // ─── Geração completa do setlist ─────────────────────────────────────────

  private async generateSetlist(eventId: string): Promise<FullSetlist> {
    const event = await prisma.event.findUniqueOrThrow({ where: { id: eventId } });
    const quizSession = await prisma.quizSession.findFirst({
      where:   { eventId, status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
    });

    if (!quizSession?.profileVector) {
      throw new Error("Perfil musical não encontrado. Conclua o quiz primeiro.");
    }

    const profile = quizSession.profileVector as unknown as MusicProfileVector;
    const builder = new SetlistBuilder();
    const setlist = await builder.buildFullSetlist(eventId, event.type.toLowerCase(), profile);

    await prisma.recommendationCache.upsert({
      where:  { eventId },
      update: {
        setlistJson: setlist as object,
        profileHash: setlist.profileHash,
        generatedAt: new Date(),
        expiresAt:   new Date(Date.now() + 6 * 60 * 60 * 1000),
      },
      create: {
        eventId,
        setlistJson: setlist as object,
        profileHash: setlist.profileHash,
        expiresAt:   new Date(Date.now() + 6 * 60 * 60 * 1000),
      },
    });

    await prisma.event.update({
      where: { id: eventId },
      data:  { status: "SETLIST_GENERATED" },
    });

    return setlist;
  }
}
