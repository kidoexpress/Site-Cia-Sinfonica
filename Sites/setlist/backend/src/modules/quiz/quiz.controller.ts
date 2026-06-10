import type { FastifyRequest, FastifyReply } from "fastify";
import { QuizService } from "./quiz.service.js";
import { StartQuizSchema, AnswerSchema } from "./quiz.schema.js";

const service = new QuizService();

export const quizController = {
  // POST /api/quiz/start
  async start(req: FastifyRequest, reply: FastifyReply) {
    const body = StartQuizSchema.safeParse(req.body);
    if (!body.success) {
      return reply.status(400).send({ error: "Parâmetros inválidos", details: body.error.flatten() });
    }

    const result = await service.startSession(body.data.eventId, body.data.userId);
    return reply.status(201).send(result);
  },

  // GET /api/quiz/:sessionId/next
  async next(req: FastifyRequest<{ Params: { sessionId: string } }>, reply: FastifyReply) {
    const { sessionId } = req.params;
    const progress = await service.getProgress(sessionId);
    return reply.send({
      sessionId,
      currentQuestion: progress.currentQuestion,
      answeredCount:   progress.answeredCount,
      totalVisible:    progress.totalVisible,
      percent:         progress.percent,
      currentBlock:    progress.currentBlock,
      blockLabel:      progress.blockLabel,
      isComplete:      progress.currentQuestion === null,
    });
  },

  // POST /api/quiz/:sessionId/answer
  async answer(req: FastifyRequest<{ Params: { sessionId: string } }>, reply: FastifyReply) {
    const { sessionId } = req.params;
    const body = AnswerSchema.safeParse(req.body);

    if (!body.success) {
      return reply.status(400).send({ error: "Resposta inválida", details: body.error.flatten() });
    }

    const result = await service.answerQuestion(
      sessionId,
      body.data.questionId,
      body.data.answer as import("../../types/quiz.types.js").AnswerValue
    );

    return reply.send(result);
  },

  // GET /api/quiz/:sessionId/progress
  async progress(req: FastifyRequest<{ Params: { sessionId: string } }>, reply: FastifyReply) {
    const { sessionId } = req.params;
    const result = await service.getProgress(sessionId);
    return reply.send(result);
  },

  // POST /api/quiz/:sessionId/complete
  async complete(req: FastifyRequest<{ Params: { sessionId: string } }>, reply: FastifyReply) {
    const { sessionId } = req.params;
    const result = await service.completeQuiz(sessionId);
    return reply.send(result);
  },

  // GET /api/quiz/:sessionId/result
  async result(req: FastifyRequest<{ Params: { sessionId: string } }>, reply: FastifyReply) {
    const { sessionId } = req.params;
    const result = await service.getResult(sessionId);
    return reply.send(result);
  },
};
