import type { Question } from "../../../types/quiz.types.js";

export const block3Questions: Question[] = [
  {
    id: "B3Q1",
    block: 3,
    question: "Que idioma você prefere para as músicas?",
    type: "multi_choice",
    options: [
      { value: "portuguese",     label: "Português (prioridade)", weight: { lang: 1.5 } },
      { value: "english",        label: "Inglês",                 weight: { lang: 1.0 } },
      { value: "spanish",        label: "Espanhol",               weight: { lang: 0.8 } },
      { value: "instrumental",   label: "Instrumental (sem letra)",weight: { lang: 1.0 } },
      { value: "no_preference",  label: "Sem preferência de idioma" },
    ],
  },
  {
    id: "B3Q2",
    block: 3,
    question: "Qual era musical mais representa você?",
    type: "single_choice",
    options: [
      { value: "50s_60s",          label: "Anos 50 e 60 — clássicos atemporais" },
      { value: "70s_80s",          label: "Anos 70 e 80 — rock, soul, disco" },
      { value: "90s_00s",          label: "Anos 90 e 2000 — pop e rock que marcaram época" },
      { value: "2010s",            label: "Anos 2010 — pop moderno" },
      { value: "current",          label: "Atual — o que está nas paradas hoje" },
      { value: "classic_timeless", label: "Clássico/Erudito — sem época específica" },
    ],
  },
  {
    id: "B3Q3",
    block: 3,
    question: "Que clima emocional você quer criar em cada fase?",
    type: "matrix",
    matrix: {
      rows: [
        "Chegada dos convidados",
        "Entrada dos noivos/festejado",
        "Jantar/Coquetel",
        "Festa/Dança",
        "Encerramento",
      ],
      columns: [
        { value: "romantic",   label: "Romântico" },
        { value: "joyful",     label: "Alegre" },
        { value: "elegant",    label: "Elegante" },
        { value: "emotional",  label: "Emocionante" },
        { value: "energetic",  label: "Energético" },
      ],
    },
  },
];
