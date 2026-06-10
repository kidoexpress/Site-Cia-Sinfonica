import type { FastifyInstance } from "fastify";
import { quizController } from "./quiz.controller.js";

export async function quizRoutes(fastify: FastifyInstance) {
  // Inicia nova sessão de quiz
  fastify.post("/start", quizController.start);

  // Por sessão
  fastify.get("/:sessionId/next",     quizController.next);
  fastify.post("/:sessionId/answer",  quizController.answer);
  fastify.get("/:sessionId/progress", quizController.progress);
  fastify.post("/:sessionId/complete",quizController.complete);
  fastify.get("/:sessionId/result",   quizController.result);
}
