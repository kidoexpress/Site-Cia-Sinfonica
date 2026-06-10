import type { FastifyInstance } from "fastify";
import { recommendationController } from "./recommendation.controller.js";

export async function recommendationRoutes(fastify: FastifyInstance) {
  // Busca (sem eventId) — ordem importa: vem antes das rotas com params
  fastify.get("/search/tracks",  recommendationController.searchTracks);
  fastify.get("/search/artists", recommendationController.searchArtists);

  // Por evento
  fastify.get("/:eventId",                          recommendationController.getSetlist);
  fastify.get("/:eventId/:moment",                  recommendationController.getMoment);
  fastify.post("/:eventId/regenerate",              recommendationController.regenerate);
  fastify.post("/:eventId/pin",                     recommendationController.pinTrack);
  fastify.delete("/:eventId/track/:trackId",        recommendationController.removeTrack);
}
