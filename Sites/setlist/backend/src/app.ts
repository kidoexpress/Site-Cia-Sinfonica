import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { env } from "./config/env.js";
import { quizRoutes } from "./modules/quiz/quiz.routes.js";
import { recommendationRoutes } from "./modules/recommendation/recommendation.routes.js";
import { spotifyRoutes } from "./modules/spotify/spotify.routes.js";

const fastify = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "warn" : "info",
    transport:
      env.NODE_ENV !== "production"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
  },
});

// ─── Plugins ──────────────────────────────────────────────────────────────────

await fastify.register(cors, {
  origin:      env.FRONTEND_URL,
  credentials: true,
});

await fastify.register(helmet);

await fastify.register(rateLimit, {
  max:      100,
  timeWindow: "1 minute",
});

// ─── Rotas ────────────────────────────────────────────────────────────────────

await fastify.register(quizRoutes,           { prefix: "/api/quiz" });
await fastify.register(recommendationRoutes, { prefix: "/api/recommendation" });
await fastify.register(spotifyRoutes,        { prefix: "/api/spotify" });

// Health check
fastify.get("/health", async () => ({
  status:    "ok",
  timestamp: new Date().toISOString(),
  version:   "0.1.0",
}));

// ─── Error handler global ─────────────────────────────────────────────────────

fastify.setErrorHandler((error, _req, reply) => {
  fastify.log.error(error);

  if (error.name === "PrismaClientKnownRequestError") {
    if ((error as unknown as { code?: string }).code === "P2025") {
      return reply.status(404).send({ error: "Recurso não encontrado." });
    }
  }

  const statusCode = error.statusCode ?? 500;
  return reply.status(statusCode).send({
    error: statusCode < 500 ? error.message : "Erro interno do servidor.",
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────

const start = async () => {
  try {
    await fastify.listen({ port: env.PORT, host: "0.0.0.0" });
    console.log(`\n🎵  Setlist Backend rodando em http://localhost:${env.PORT}\n`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
