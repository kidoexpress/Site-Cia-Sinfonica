import { describe, it, expect } from "vitest";
import { ProfileScorer } from "../src/services/scoring/ProfileScorer.js";
import type { QuizAnswers } from "../src/types/quiz.types.js";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const baseWeddingAnswers: QuizAnswers = {
  B0Q1: "wedding",
  B0Q2: "medium",
  B0Q3: "2024-11-15",
  B1Q1: "26_35",
  B1Q2: ["mpb", "jazz"],
  B1Q3: 9,
  B1Q4: "emotional",
};

const catholicChurchAnswers: QuizAnswers = {
  ...baseWeddingAnswers,
  B2Q1: "catholic_church",
  B2Q2: "fully_religious",
};

const evangelicalAnswers: QuizAnswers = {
  ...baseWeddingAnswers,
  B0Q1: "wedding",
  B2Q1: "evangelical_church",
  B2Q2: "fully_religious",
  B1Q2: ["gospel"],
};

const partyAnswers: QuizAnswers = {
  ...baseWeddingAnswers,
  B5_PARTY: ["throwback", "brazilian_party"],
  B5_COCKTAIL: "lounge_jazz",
};

const blacklistAnswers: QuizAnswers = {
  ...baseWeddingAnswers,
  B6Q1: ["no_funk", "no_sertanejo", "no_electronic"],
};

// ─── Testes ───────────────────────────────────────────────────────────────────

describe("ProfileScorer", () => {
  describe("normalização", () => {
    it("deve retornar vetor com todos os valores entre 0 e 1", () => {
      const profile = ProfileScorer.compute(baseWeddingAnswers);

      for (const [key, val] of Object.entries(profile.genres)) {
        expect(val, `genres.${key}`).toBeGreaterThanOrEqual(0);
        expect(val, `genres.${key}`).toBeLessThanOrEqual(1);
      }
      for (const [key, val] of Object.entries(profile.mood)) {
        expect(val, `mood.${key}`).toBeGreaterThanOrEqual(0);
        expect(val, `mood.${key}`).toBeLessThanOrEqual(1);
      }
      expect(profile.context.formality).toBeGreaterThanOrEqual(0);
      expect(profile.context.formality).toBeLessThanOrEqual(1);
    });
  });

  describe("casamento padrão", () => {
    it("deve ter mood.romantic alto para casamento", () => {
      const profile = ProfileScorer.compute(baseWeddingAnswers);
      expect(profile.mood.romantic).toBeGreaterThanOrEqual(0.7);
    });

    it("deve ter mood.emotional alto para intenção 'emotional'", () => {
      const profile = ProfileScorer.compute(baseWeddingAnswers);
      expect(profile.mood.emotional).toBeGreaterThan(0.7);
    });

    it("deve mapear gêneros MPB e jazz para as dimensões corretas", () => {
      const profile = ProfileScorer.compute(baseWeddingAnswers);
      expect(profile.genres.mpb).toBeGreaterThan(0.3);
      expect(profile.genres.jazz).toBeGreaterThan(0.3);
    });
  });

  describe("restrições de igreja católica", () => {
    it("deve aplicar spiritual alto para fully_religious", () => {
      const profile = ProfileScorer.compute(catholicChurchAnswers);
      expect(profile.mood.spiritual).toBeGreaterThanOrEqual(0.9);
    });

    it("deve zerar eletrônica para venue religioso com restrição estrita", () => {
      const profile = ProfileScorer.compute(catholicChurchAnswers);
      expect(profile.genres.electronic).toBe(0);
    });

    it("deve zerar funk para venue religioso com restrição estrita", () => {
      const profile = ProfileScorer.compute(catholicChurchAnswers);
      expect(profile.genres.funk).toBe(0);
    });

    it("deve definir religious_constraint como strict", () => {
      const profile = ProfileScorer.compute(catholicChurchAnswers);
      expect(profile.context.religious_constraint).toBe("strict");
    });

    it("deve aumentar classical e gospel para católico", () => {
      const profile = ProfileScorer.compute(catholicChurchAnswers);
      expect(profile.genres.classical).toBeGreaterThan(0.5);
    });
  });

  describe("igreja evangélica", () => {
    it("deve priorizar gospel quando evangélico + strict", () => {
      const profile = ProfileScorer.compute(evangelicalAnswers);
      expect(profile.genres.gospel).toBeGreaterThan(0.7);
    });

    it("deve ter spiritual alto para evangélico", () => {
      const profile = ProfileScorer.compute(evangelicalAnswers);
      expect(profile.mood.spiritual).toBeGreaterThanOrEqual(0.8);
    });
  });

  describe("blacklist de gêneros", () => {
    it("deve zerar gêneros vetados", () => {
      const profile = ProfileScorer.compute(blacklistAnswers);
      expect(profile.genres.funk).toBe(0);
      expect(profile.genres.sertanejo).toBe(0);
      expect(profile.genres.electronic).toBe(0);
    });

    it("deve adicionar gêneros vetados na blacklist", () => {
      const profile = ProfileScorer.compute(blacklistAnswers);
      expect(profile.blacklist.genres).toContain("funk");
      expect(profile.blacklist.genres).toContain("sertanejo");
      expect(profile.blacklist.genres).toContain("electronic");
    });

    it("não deve adicionar 'none' na blacklist", () => {
      const answers: QuizAnswers = { ...baseWeddingAnswers, B6Q1: ["none"] };
      const profile = ProfileScorer.compute(answers);
      expect(profile.blacklist.genres).not.toContain("none");
    });
  });

  describe("momentos do evento", () => {
    it("deve gerar perfil de momento 'party' com energy_level alto", () => {
      const profile = ProfileScorer.compute(partyAnswers);
      expect(profile.moments["party"]).toBeDefined();
      expect(profile.moments["party"].energy_level).toBeGreaterThan(0.7);
    });

    it("deve gerar genre_bias para lounge_jazz no coquetel", () => {
      const profile = ProfileScorer.compute(partyAnswers);
      expect(profile.moments["cocktail"]).toBeDefined();
      expect(profile.moments["cocktail"].genre_bias?.lounge).toBeGreaterThan(0.5);
    });

    it("deve gerar momentos de throwback com bias em pop_intl", () => {
      const profile = ProfileScorer.compute(partyAnswers);
      expect(profile.moments["party"]?.genre_bias?.pop_intl).toBeGreaterThan(0.5);
    });
  });

  describe("seeds e referências", () => {
    it("deve extrair playlistId correto de link do Spotify", () => {
      const answers: QuizAnswers = {
        ...baseWeddingAnswers,
        B7Q3: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
      };
      const profile = ProfileScorer.compute(answers);
      expect(profile.seeds.playlistIds).toContain("37i9dQZF1DX4sWSpwq3LiO");
    });

    it("deve extrair artistIds dos seeds do B7Q1", () => {
      const answers: QuizAnswers = {
        ...baseWeddingAnswers,
        B7Q1: [
          { spotifyId: "artist_abc123", artistName: "Chico Buarque", genres: ["mpb"], popularity: 80 },
        ],
      };
      const profile = ProfileScorer.compute(answers);
      expect(profile.seeds.artistIds).toContain("artist_abc123");
    });
  });

  describe("preferências temporais", () => {
    it("deve mapear faixa etária 26_35 para eras 90s/2010s", () => {
      const profile = ProfileScorer.compute(baseWeddingAnswers); // B1Q1: "26_35"
      expect(profile.temporal.era_preference).toContain("90s_00s");
    });

    it("deve incluir era selecionada em B3Q2", () => {
      const answers: QuizAnswers = { ...baseWeddingAnswers, B3Q2: "50s_60s" };
      const profile = ProfileScorer.compute(answers);
      expect(profile.temporal.era_preference).toContain("50s_60s");
    });
  });

  describe("corporate event", () => {
    it("deve ter formality alto para evento corporativo com hotel", () => {
      const answers: QuizAnswers = {
        B0Q1: "corporate",
        B0Q2: "large",
        B2Q3: "hotel_ballroom",
        B1Q4: "elegant",
      };
      const profile = ProfileScorer.compute(answers);
      expect(profile.mood.elegant).toBeGreaterThan(0.7);
    });
  });
});
