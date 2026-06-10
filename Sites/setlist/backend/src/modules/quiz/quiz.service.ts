import { prisma } from "../../db/prisma.js";
import {
  getNextQuestion,
  calculateProgress,
} from "./questions/index.js";
import { ProfileScorer } from "../../services/scoring/ProfileScorer.js";
import { SetlistBuilder } from "../../services/recommendation/SetlistBuilder.js";
import type { QuizAnswers, AnswerValue } from "../../types/quiz.types.js";

export class QuizService {
  // ─── Inicia uma nova sessão de quiz ───────────────────────────────────────

  async startSession(eventId?: string, userId?: string) {
    const session = await prisma.quizSession.create({
      data: {
        eventId: eventId ?? null,
        userId:  userId  ?? null,
        answers: {},
        status:  "IN_PROGRESS",
      },
    });

    const firstQuestion = getNextQuestion({});
    const progress      = calculateProgress({});

    return {
      sessionId:       session.id,
      currentQuestion: firstQuestion,
      ...progress,
    };
  }

  // ─── Registra uma resposta e retorna a próxima pergunta ───────────────────

  async answerQuestion(
    sessionId: string,
    questionId: string,
    answer: AnswerValue
  ) {
    const session = await prisma.quizSession.findUniqueOrThrow({
      where: { id: sessionId },
    });

    if (session.status !== "IN_PROGRESS") {
      throw new Error("Quiz já foi finalizado ou abandonado.");
    }

    const answers: QuizAnswers = {
      ...(session.answers as QuizAnswers),
      [questionId]: answer,
    };

    const nextQuestion = getNextQuestion(answers);
    const progress     = calculateProgress(answers);
    const isComplete   = nextQuestion === null;

    await prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        answers:         answers as object,
        currentBlock:    progress.currentBlock,
        currentQuestion: nextQuestion?.id ?? null,
        status:          isComplete ? "COMPLETED" : "IN_PROGRESS",
        completedAt:     isComplete ? new Date() : null,
      },
    });

    return {
      sessionId,
      nextQuestion,
      isComplete,
      ...progress,
    };
  }

  // ─── Retorna progresso atual ───────────────────────────────────────────────

  async getProgress(sessionId: string) {
    const session = await prisma.quizSession.findUniqueOrThrow({
      where: { id: sessionId },
    });

    const answers  = session.answers as QuizAnswers;
    const progress = calculateProgress(answers);
    const next     = getNextQuestion(answers);

    return {
      sessionId,
      status:   session.status,
      answers,
      currentQuestion: next,
      ...progress,
    };
  }

  // ─── Finaliza quiz: gera ProfileVector + Setlist ──────────────────────────

  async completeQuiz(sessionId: string) {
    const session = await prisma.quizSession.findUniqueOrThrow({
      where: { id: sessionId },
      include: { event: true },
    });

    const answers = session.answers as QuizAnswers;
    const profile = ProfileScorer.compute(answers);

    // Atualiza sessão com o vetor calculado
    await prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        profileVector: profile as object,
        status:        "COMPLETED",
        completedAt:   new Date(),
      },
    });

    // Atualiza status do evento se vinculado
    if (session.eventId) {
      await prisma.event.update({
        where: { id: session.eventId },
        data: { status: "QUIZ_COMPLETE" },
      });
    }

    // Dispara geração assíncrona do setlist (fire and forget)
    if (session.eventId && session.event) {
      const eventType = session.event.type.toLowerCase();
      const builder   = new SetlistBuilder();

      builder
        .buildFullSetlist(session.eventId, eventType, profile)
        .then(async (setlist) => {
          // Salva no cache
          await prisma.recommendationCache.upsert({
            where:  { eventId: session.eventId! },
            update: {
              setlistJson:  setlist as object,
              profileHash:  setlist.profileHash,
              generatedAt:  new Date(),
              expiresAt:    new Date(Date.now() + 6 * 60 * 60 * 1000),
            },
            create: {
              eventId:     session.eventId!,
              setlistJson: setlist as object,
              profileHash: setlist.profileHash,
              expiresAt:   new Date(Date.now() + 6 * 60 * 60 * 1000),
            },
          });

          await prisma.event.update({
            where: { id: session.eventId! },
            data:  { status: "SETLIST_GENERATED" },
          });
        })
        .catch(console.error);
    }

    return {
      sessionId,
      profileVector: profile,
      status: "COMPLETED",
      message: "Quiz concluído! Seu repertório está sendo gerado...",
    };
  }

  // ─── Resultado final: ProfileVector + Setlist ─────────────────────────────

  async getResult(sessionId: string) {
    const session = await prisma.quizSession.findUniqueOrThrow({
      where: { id: sessionId },
    });

    if (session.status !== "COMPLETED") {
      throw new Error("Quiz ainda não foi concluído.");
    }

    let setlist = null;
    if (session.eventId) {
      const cache = await prisma.recommendationCache.findUnique({
        where: { eventId: session.eventId },
      });
      setlist = cache?.setlistJson ?? null;
    }

    return {
      sessionId,
      profileVector: session.profileVector,
      setlist,
      status: session.status,
    };
  }
}
