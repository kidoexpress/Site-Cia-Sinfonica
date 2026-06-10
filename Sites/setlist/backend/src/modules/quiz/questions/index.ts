import { block0Questions } from "./block0.js";
import { block1Questions } from "./block1.js";
import { block2Questions } from "./block2.js";
import { block3Questions } from "./block3.js";
import { block4Questions } from "./block4.js";
import { block5Questions } from "./block5.js";
import { block6Questions } from "./block6.js";
import { block7Questions } from "./block7.js";
import type { Question, QuizAnswers } from "../../../types/quiz.types.js";

export const BLOCK_LABELS: Record<number, string> = {
  0: "Sobre o Evento",
  1: "Seu Perfil Musical",
  2: "Local e Contexto",
  3: "Preferências Musicais",
  4: "Instrumentação",
  5: "Momentos do Evento",
  6: "Restrições",
  7: "Referências",
};

// Todas as perguntas em ordem
export const ALL_QUESTIONS: Question[] = [
  ...block0Questions,
  ...block1Questions,
  ...block2Questions,
  ...block3Questions,
  ...block4Questions,
  ...block5Questions,
  ...block6Questions,
  ...block7Questions,
];

/**
 * Avalia se uma pergunta deve ser exibida dado o estado atual das respostas.
 * Implementa a lógica condicional (triggers) entre perguntas.
 */
export function shouldShowQuestion(question: Question, answers: QuizAnswers): boolean {
  if (!question.trigger) return true;

  const { field, includes, excludes } = question.trigger;
  const value = answers[field];

  if (value === undefined || value === null) return false;

  // Normaliza para array de strings
  const rawArr = Array.isArray(value) ? value : [value];
  const valueArr = rawArr.map((v) => (typeof v === "string" ? v : String(v)));

  if (includes && includes.length > 0) {
    const hasMatch = valueArr.some((v) => includes.includes(v));
    if (!hasMatch) return false;
  }

  if (excludes && excludes.length > 0) {
    const hasExcluded = (valueArr as string[]).some((v) => excludes.includes(v));
    if (hasExcluded) return false;
  }

  return true;
}

/**
 * Retorna a próxima pergunta não respondida e visível,
 * dada a lista atual de respostas.
 */
export function getNextQuestion(answers: QuizAnswers): Question | null {
  for (const question of ALL_QUESTIONS) {
    if (!shouldShowQuestion(question, answers)) continue;
    if (!(question.id in answers)) return question;
  }
  return null; // quiz completo
}

/**
 * Calcula o progresso percentual do quiz.
 * Conta apenas perguntas visíveis.
 */
export function calculateProgress(answers: QuizAnswers): {
  answeredCount: number;
  totalVisible: number;
  percent: number;
  currentBlock: number;
  blockLabel: string;
} {
  const visible = ALL_QUESTIONS.filter((q) => shouldShowQuestion(q, answers));
  const answered = visible.filter((q) => q.id in answers);
  const percent = visible.length > 0 ? Math.round((answered.length / visible.length) * 100) : 0;

  const nextQ = getNextQuestion(answers);
  const currentBlock = nextQ?.block ?? 7;

  return {
    answeredCount: answered.length,
    totalVisible: visible.length,
    percent,
    currentBlock,
    blockLabel: BLOCK_LABELS[currentBlock] ?? "Finalizando",
  };
}
