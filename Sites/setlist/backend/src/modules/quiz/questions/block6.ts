import type { Question } from "../../../types/quiz.types.js";

export const block6Questions: Question[] = [
  {
    id: "B6Q1",
    block: 6,
    question: "Há algum estilo ou gênero musical que você NÃO quer de jeito nenhum?",
    type: "multi_choice",
    options: [
      { value: "no_funk",      label: "Funk / Funk carioca" },
      { value: "no_sertanejo", label: "Sertanejo" },
      { value: "no_pagode",    label: "Pagode / Samba" },
      { value: "no_gospel",    label: "Gospel / Música religiosa" },
      { value: "no_electronic",label: "Música eletrônica / DJ" },
      { value: "no_forro",     label: "Forró" },
      { value: "no_classic",   label: "Música clássica / erudita" },
      { value: "no_rock",      label: "Rock" },
      { value: "none",         label: "Sem restrições de estilo" },
    ],
  },
  {
    id: "B6Q2",
    block: 6,
    question: "Há alguma música específica que NUNCA pode tocar no seu evento?",
    type: "text_with_search",
    placeholder: "Ex: 'Evidências', 'My Heart Will Go On'...",
    spotifySearch: true,
  },
  {
    id: "B6Q3",
    block: 6,
    question: "Há alguma consideração especial que o curador precisa saber?",
    type: "textarea",
    placeholder:
      "Ex: a família é muito religiosa e conservadora, queremos surpresa para o noivo, há convidados idosos que precisam de músicas reconhecíveis...",
    maxLength: 500,
  },
];
