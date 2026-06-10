import type { FastifyRequest, FastifyReply } from "fastify";
import { randomBytes } from "crypto";
import { prisma } from "../../db/prisma.js";
import { SpotifyRecommender } from "../../services/spotify/SpotifyRecommender.js";

const spotify = new SpotifyRecommender();

export const spotifyController = {
  // GET /api/spotify/auth-url?userId=...
  async getAuthUrl(
    req: FastifyRequest<{ Querystring: { userId: string } }>,
    reply: FastifyReply
  ) {
    const state = randomBytes(16).toString("hex");
    // Em produção: persistir state no Redis associado ao userId
    const url = spotify.getAuthUrl(state);
    return reply.send({ url, state });
  },

  // GET /api/spotify/callback?code=...&state=...
  async callback(
    req: FastifyRequest<{ Querystring: { code: string; state: string; userId?: string } }>,
    reply: FastifyReply
  ) {
    const { code, userId } = req.query;

    if (!code) {
      return reply.status(400).send({ error: "Código de autorização não fornecido." });
    }

    const tokens = await spotify.exchangeCode(code);

    // Busca o userId do Spotify com o access token
    // Em produção: usar um cliente Spotify auxiliar autenticado
    // Por ora, exige userId como query param
    if (userId) {
      const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);
      await prisma.spotifyOAuthToken.upsert({
        where:  { userId },
        update: {
          accessToken:  tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt,
        },
        create: {
          userId,
          accessToken:   tokens.accessToken,
          refreshToken:  tokens.refreshToken,
          expiresAt,
          spotifyUserId: "pending", // atualizado na próxima chamada
        },
      });
    }

    // Redireciona para o frontend
    return reply.redirect(`${process.env.FRONTEND_URL}/app?spotify=connected`);
  },

  // POST /api/spotify/create-playlist/:eventId
  async createPlaylist(
    req: FastifyRequest<{
      Params: { eventId: string };
      Body: { userId: string; trackUris: string[] };
    }>,
    reply: FastifyReply
  ) {
    const { eventId } = req.params;
    const { userId, trackUris } = req.body;

    const tokenRecord = await prisma.spotifyOAuthToken.findUnique({
      where: { userId },
    });

    if (!tokenRecord) {
      return reply.status(401).send({
        error: "Conta Spotify não conectada.",
        authUrl: spotify.getAuthUrl(randomBytes(8).toString("hex")),
      });
    }

    const event = await prisma.event.findUniqueOrThrow({ where: { id: eventId } });
    const playlistUrl = await spotify.createPlaylistForUser(
      tokenRecord.spotifyUserId,
      tokenRecord.accessToken,
      event.name,
      trackUris
    );

    return reply.send({ playlistUrl });
  },
};
