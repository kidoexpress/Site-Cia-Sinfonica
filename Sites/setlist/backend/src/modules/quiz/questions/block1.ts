import type { Question } from "../../../types/quiz.types.js";

export const block1Questions: Question[] = [
  {
    id: "B1Q1",
    block: 1,
    question: "Qual é a sua faixa etária?",
    type: "single_choice",
    options: [
      { value: "18_25",   label: "18 a 25 anos" },
      { value: "26_35",   label: "26 a 35 anos" },
      { value: "36_45",   label: "36 a 45 anos" },
      { value: "46_60",   label: "46 a 60 anos" },
      { value: "60_plus", label: "Acima de 60 anos" },
    ],
  },
  {
    id: "B1Q2",
    block: 1,
    question: "Como você descreveria seu gosto musical no dia a dia?",
    type: "multi_choice",
    maxSelections: 3,
    options: [
      { value: "mpb",       label: "MPB / Bossa Nova" },
      { value: "sertanejo", label: "Sertanejo" },
      { value: "pagode",    label: "Pagode / Samba" },
      { value: "pop_br",    label: "Pop Brasileiro" },
      { value: "pop_intl",  label: "Pop Internacional" },
      { value: "rock",      label: "Rock / Indie" },
      { value: "classico",  label: "Música Clássica / Erudita" },
      { value: "jazz",      label: "Jazz / Blues / Soul" },
      { value: "eletronica",label: "Eletrônica / House" },
      { value: "gospel",    label: "Gospel / Música Cristã" },
      { value: "forro",     label: "Forró / Música Nordestina" },
      { value: "outros",    label: "Outros estilos" },
    ],
  },
  {
    id: "B1Q3",
    block: 1,
    question: "O quanto a música é importante para a atmosfera do seu evento?",
    type: "scale",
    scale: {
      min: 1,
      max: 10,
      labels: { 1: "Só precisa ter", 10: "É a alma do evento" },
    },
  },
  {
    id: "B1Q4",
    block: 1,
    question: "Como você imagina a trilha sonora do seu evento?",
    type: "single_choice",
    options: [
      { value: "emotional",   label: "Emocionante e significativa — cada música conta uma história" },
      { value: "elegant",     label: "Elegante e sofisticada — bem-selecionada, sem excessos" },
      { value: "fun",         label: "Animada e dançante — quero que todo mundo dance" },
      { value: "balanced",    label: "Equilibrada — momentos de emoção e momentos de festa" },
      { value: "background",  label: "Discreta — boa, mas sem ser o centro das atenções" },
    ],
  },
];
