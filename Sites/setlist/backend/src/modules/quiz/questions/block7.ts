import type { Question } from "../../../types/quiz.types.js";

export const block7Questions: Question[] = [
  {
    id: "B7Q1",
    block: 7,
    question: "Quais artistas ou bandas mais representam o som que você quer no evento?",
    type: "artist_search",
    maxSelections: 10,
    spotifySearch: true,
    placeholder: "Busque artistas no Spotify...",
  },
  {
    id: "B7Q2",
    block: 7,
    question: "Há alguma música específica que você DEFINITIVAMENTE quer no repertório?",
    type: "track_search",
    maxSelections: 10,
    spotifySearch: true,
    youtubeSearch: true,
    placeholder: "Busque músicas...",
  },
  {
    id: "B7Q3",
    block: 7,
    question: "Você tem alguma playlist do Spotify que represente o que quer?",
    type: "text",
    placeholder: "Cole o link da playlist aqui",
    validation: "spotify_playlist_url",
  },
  {
    id: "B7Q4",
    block: 7,
    question: "Algum filme, série ou novela cuja trilha sonora você ama?",
    type: "text",
    placeholder: "Ex: La La Land, Before Sunrise, Diários de Motocicleta...",
  },
];
