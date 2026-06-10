import type { Question } from "../../../types/quiz.types.js";

export const block0Questions: Question[] = [
  {
    id: "B0Q1",
    block: 0,
    question: "Qual é o tipo do seu evento?",
    type: "single_choice",
    required: true,
    options: [
      { value: "wedding",        label: "Casamento",          icon: "💍" },
      { value: "civil_wedding",  label: "Casamento Civil",    icon: "⚖️" },
      { value: "birthday_15",    label: "Festa de 15 Anos",   icon: "🎀" },
      { value: "birthday_adult", label: "Aniversário Adulto", icon: "🎂" },
      { value: "corporate",      label: "Evento Corporativo", icon: "🏢" },
      { value: "graduation",     label: "Formatura",          icon: "🎓" },
      { value: "engagement",     label: "Noivado",            icon: "💎" },
      { value: "other",          label: "Outro",              icon: "✨" },
    ],
  },
  {
    id: "B0Q2",
    block: 0,
    question: "Quantos convidados são esperados?",
    type: "single_choice",
    required: true,
    options: [
      { value: "intimate", label: "Até 30 pessoas",        weight: { intimate: 1.0 } },
      { value: "small",    label: "31 a 80 pessoas",       weight: { intimate: 0.6 } },
      { value: "medium",   label: "81 a 200 pessoas",      weight: { intimate: 0.2 } },
      { value: "large",    label: "Mais de 200 pessoas",   weight: { intimate: 0.0 } },
    ],
  },
  {
    id: "B0Q3",
    block: 0,
    question: "Qual a data prevista do evento?",
    type: "date",
    required: true,
  },
];
