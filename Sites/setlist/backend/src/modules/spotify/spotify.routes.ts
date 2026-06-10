import type { FastifyInstance } from "fastify";
import { spotifyController } from "./spotify.controller.js";

export async function spotifyRoutes(fastify: FastifyInstance) {
  fastify.get("/auth-url",                    spotifyController.getAuthUrl);
  fastify.get("/callback",                    spotifyController.callback);
  fastify.post("/create-playlist/:eventId",   spotifyController.createPlaylist);
}
