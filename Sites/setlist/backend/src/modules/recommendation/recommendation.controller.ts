import type { FastifyRequest, FastifyReply } from "fastify";
import { RecommendationService } from "./recommendation.service.js";
import { PinTrackSchema, SearchSchema } from "./recommendation.schema.js";

const service = new RecommendationService();

export const recommendationController = {
  // GET /api/recommendation/:eventId
  async getSetlist(
    req: FastifyRequest<{ Params: { eventId: string } }>,
    reply: FastifyReply
  ) {
    const setlist = await service.getSetlist(req.params.eventId);
    return reply.send(setlist);
  },

  // GET /api/recommendation/:eventId/:moment
  async getMoment(
    req: FastifyRequest<{ Params: { eventId: string; moment: string } }>,
    reply: FastifyReply
  ) {
    const { eventId, moment } = req.params;
    const data = await service.getMomentTracks(eventId, moment);
    return reply.send(data);
  },

  // POST /api/recommendation/:eventId/regenerate
  async regenerate(
    req: FastifyRequest<{ Params: { eventId: string }; Body: { moment: string } }>,
    reply: FastifyReply
  ) {
    const { eventId } = req.params;
    const { moment }  = req.body;
    const data = await service.regenerateMoment(eventId, moment);
    return reply.send(data);
  },

  // GET /api/recommendation/search/tracks?q=...
  async searchTracks(
    req: FastifyRequest<{ Querystring: { q: string; limit?: number } }>,
    reply: FastifyReply
  ) {
    const parsed = SearchSchema.safeParse(req.query);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Parâmetros inválidos" });
    }
    const result = await service.searchTracks(parsed.data.q, parsed.data.limit);
    return reply.send(result);
  },

  // GET /api/recommendation/search/artists?q=...
  async searchArtists(
    req: FastifyRequest<{ Querystring: { q: string } }>,
    reply: FastifyReply
  ) {
    const { q } = req.query;
    if (!q) return reply.status(400).send({ error: "Parâmetro 'q' obrigatório" });
    const result = await service.searchArtists(q);
    return reply.send(result);
  },

  // POST /api/recommendation/:eventId/pin
  async pinTrack(
    req: FastifyRequest<{ Params: { eventId: string }; Body: unknown }>,
    reply: FastifyReply
  ) {
    const parsed = PinTrackSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Dados inválidos", details: parsed.error.flatten() });
    }
    const result = await service.pinTrack(
      req.params.eventId,
      parsed.data.trackId,
      parsed.data.moment
    );
    return reply.send(result);
  },

  // DELETE /api/recommendation/:eventId/track/:trackId
  async removeTrack(
    req: FastifyRequest<{ Params: { eventId: string; trackId: string } }>,
    reply: FastifyReply
  ) {
    const { eventId, trackId } = req.params;
    const result = await service.removeTrack(eventId, trackId);
    return reply.send(result);
  },
};
