import type { Question } from "../../../types/quiz.types.js";

export const block2Questions: Question[] = [
  {
    id: "B2Q1",
    block: 2,
    question: "Onde será realizada a cerimônia?",
    type: "single_choice",
    trigger: {
      field: "B0Q1",
      includes: ["wedding", "civil_wedding", "engagement", "graduation"],
    },
    options: [
      { value: "catholic_church",  label: "Igreja Católica",                    tags: ["religious","classical","sacred"] },
      { value: "evangelical_church",label: "Igreja Evangélica / Protestante",   tags: ["gospel","christian_pop","worship"] },
      { value: "other_temple",     label: "Outro templo religioso",             tags: ["religious","neutral_sacred"] },
      { value: "outdoor",          label: "Ao ar livre (jardim, praia, campo)", tags: ["acoustic","romantic","light"] },
      { value: "civil_registry",   label: "Cartório / Cerimônia Civil",         tags: ["minimal","elegant","short"] },
      { value: "event_hall",       label: "Salão de eventos / Espaço fechado",  tags: ["versatile"] },
      { value: "historic_venue",   label: "Espaço histórico / Casarão / Museu", tags: ["classical","elegant","instrumental"] },
      { value: "other",            label: "Outro" },
    ],
  },
  {
    id: "B2Q2",
    block: 2,
    question: "A cerimônia tem orientação religiosa?",
    type: "single_choice",
    trigger: {
      field: "B2Q1",
      includes: ["catholic_church", "evangelical_church", "other_temple"],
    },
    options: [
      { value: "fully_religious", label: "Sim, totalmente religiosa — músicas devem ser sacras/litúrgicas" },
      { value: "mixed",           label: "Mista — abertura para músicas religiosas e seculares" },
      { value: "symbolic",        label: "Simbólica — ambiente espiritual, mas sem obrigatoriedade litúrgica" },
      { value: "secular",         label: "Não religiosa, apesar do local" },
    ],
  },
  {
    id: "B2Q3",
    block: 2,
    question: "Onde será a festa / recepção?",
    type: "single_choice",
    options: [
      { value: "same_venue",      label: "No mesmo local da cerimônia" },
      { value: "rooftop_bar",     label: "Rooftop / Bar / Restaurante" },
      { value: "event_hall",      label: "Salão de festas / Buffet" },
      { value: "outdoor_party",   label: "Área externa / Tenda / Campo" },
      { value: "beach_club",      label: "Beach club / Clube" },
      { value: "private_house",   label: "Casa particular / Chácara / Sítio" },
      { value: "hotel_ballroom",  label: "Hotel / Espaço de luxo" },
    ],
  },
  {
    id: "B2Q4",
    block: 2,
    question: "Há alguma restrição sonora no local?",
    type: "single_choice",
    options: [
      { value: "none",           label: "Sem restrições — liberdade total de volume" },
      { value: "after_midnight", label: "Música ao vivo ou alta somente até meia-noite" },
      { value: "acoustic_only",  label: "Local exige acústico / instrumental (ex: igreja, museu)" },
      { value: "strict",         label: "Restrições severas de volume o tempo todo" },
    ],
  },
];
