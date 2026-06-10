import type {
  MusicProfileVector,
  GenreScores,
  MoodScores,
  InstrumentationProfile,
  MomentProfile,
} from "../../types/profile.types.js";
import type { QuizAnswers } from "../../types/quiz.types.js";

// ─── Mapa de gêneros da UI → dimensões do vetor ───────────────────────────────

const UI_GENRE_MAP: Record<string, Partial<GenreScores>> = {
  mpb:       { mpb: 0.9, bossa_nova: 0.4, lounge: 0.2 },
  pagode:    { samba_pagode: 0.9, mpb: 0.1 } as Partial<GenreScores>,
  sertanejo: { sertanejo: 0.9 },
  pop_br:    { pop_br: 0.9, mpb: 0.2 },
  pop_intl:  { pop_intl: 0.9 },
  rock:      { rock: 0.9 },
  classico:  { classical: 0.9 },
  jazz:      { jazz: 0.9, lounge: 0.5, bossa_nova: 0.3 },
  eletronica:{ electronic: 0.9 },
  gospel:    { gospel: 0.9 },
  forro:     { forro: 0.9 },
};

// ─── Regras por tipo de local ─────────────────────────────────────────────────

const VENUE_PRESETS: Record<string, {
  genres?: Partial<GenreScores>;
  mood?: Partial<MoodScores>;
  formality?: number;
  texture?: InstrumentationProfile["texture"];
}> = {
  catholic_church: {
    genres:   { classical: 0.9, gospel: 0.5, mpb: 0.2 },
    mood:     { spiritual: 0.9, elegant: 0.8, energetic: 0.0, joyful: 0.2 },
    formality: 0.9,
    texture:  "full",
  },
  evangelical_church: {
    genres: { gospel: 0.95, classical: 0.2 },
    mood:   { spiritual: 1.0, joyful: 0.7, elegant: 0.5 },
    formality: 0.7,
  },
  other_temple: {
    genres: { classical: 0.6, gospel: 0.5 },
    mood:   { spiritual: 0.8, elegant: 0.6 },
    formality: 0.8,
  },
  historic_venue: {
    genres: { classical: 0.7, jazz: 0.5, lounge: 0.4 },
    mood:   { elegant: 0.9 },
    formality: 0.9,
    texture: "grand",
  },
  hotel_ballroom: {
    genres: { jazz: 0.5, lounge: 0.6, bossa_nova: 0.4, classical: 0.3 },
    mood:   { elegant: 0.85 },
    formality: 0.85,
  },
  outdoor: {
    genres: { mpb: 0.6, bossa_nova: 0.5 },
    mood:   { romantic: 0.7, joyful: 0.5 },
    texture: "warm",
  },
  rooftop_bar: {
    genres: { lounge: 0.7, jazz: 0.5, pop_intl: 0.4 },
    mood:   { elegant: 0.6, joyful: 0.5 },
  },
  beach_club: {
    genres: { pop_intl: 0.6, electronic: 0.4, pop_br: 0.5 },
    mood:   { joyful: 0.8, energetic: 0.6 },
  },
  private_house: {
    genres: { mpb: 0.5, pagode: 0.4, sertanejo: 0.3 },
    mood:   { joyful: 0.7, romantic: 0.4 },
  },
};

// ─── ProfileScorer ────────────────────────────────────────────────────────────

export class ProfileScorer {
  static compute(answers: QuizAnswers): MusicProfileVector {
    const profile = this.initEmptyProfile();

    this.applyEventType(profile, answers);
    this.applyContractorProfile(profile, answers);
    this.applyVenueConstraints(profile, answers);
    this.applyMusicalPreferences(profile, answers);
    this.applyInstrumentation(profile, answers);
    this.applyMomentProfiles(profile, answers);
    this.applyTemporalAndLanguage(profile, answers);
    this.applyBlacklist(profile, answers);
    this.applySeeds(profile, answers);
    this.normalize(profile);

    return profile;
  }

  // ─── Init ──────────────────────────────────────────────────────────────────

  private static initEmptyProfile(): MusicProfileVector {
    return {
      genres: {
        mpb: 0.3, bossa_nova: 0.2, samba_pagode: 0.1, sertanejo: 0.1,
        pop_br: 0.2, pop_intl: 0.2, rock: 0.1, classical: 0.2,
        jazz: 0.2, gospel: 0.0, forro: 0.0, electronic: 0.0,
        lounge: 0.2, funk: 0.0,
      },
      mood: {
        romantic: 0.5, energetic: 0.3, emotional: 0.4,
        elegant: 0.4, joyful: 0.4, spiritual: 0.0,
      },
      instrumentation: {
        has_vocals: true,
        vocal_gender: "mixed",
        ensemble_size: "small_group",
        preferred_instruments: [],
        texture: "warm",
      },
      context: {
        venue_type: "event_hall",
        religious_constraint: "none",
        sound_restriction: "none",
        event_size: "medium",
        formality: 0.5,
      },
      temporal: {
        era_preference: [],
        language_preference: ["portuguese"],
      },
      moments: {},
      blacklist: { genres: [], trackIds: [], artistIds: [] },
      seeds: { artistIds: [], trackIds: [], playlistIds: [] },
    };
  }

  // ─── Event type baseline ──────────────────────────────────────────────────

  private static applyEventType(p: MusicProfileVector, a: QuizAnswers) {
    const type = a["B0Q1"] as string | undefined;

    const presets: Record<string, Partial<MusicProfileVector["mood"]>> = {
      wedding:        { romantic: 0.85, emotional: 0.8, elegant: 0.75 },
      civil_wedding:  { romantic: 0.8,  emotional: 0.7, elegant: 0.6  },
      birthday_15:    { joyful: 0.8,    energetic: 0.5, romantic: 0.5 },
      birthday_adult: { joyful: 0.7,    energetic: 0.6 },
      corporate:      { elegant: 0.8,   joyful: 0.3 },
      graduation:     { joyful: 0.85,   emotional: 0.7, energetic: 0.6 },
      engagement:     { romantic: 0.9,  emotional: 0.75, elegant: 0.6 },
    };

    if (type && presets[type]) {
      Object.assign(p.mood, presets[type]);
    }

    // Tamanho do evento
    const size = a["B0Q2"] as string | undefined;
    if (size) p.context.event_size = size as typeof p.context.event_size;
  }

  // ─── Contractor profile ───────────────────────────────────────────────────

  private static applyContractorProfile(p: MusicProfileVector, a: QuizAnswers) {
    // Idade → era preference implícita
    const age = a["B1Q1"] as string | undefined;
    const ageEraMap: Record<string, string[]> = {
      "18_25":   ["current", "2010s"],
      "26_35":   ["current", "2010s", "90s_00s"],
      "36_45":   ["90s_00s", "2010s"],
      "46_60":   ["70s_80s", "90s_00s"],
      "60_plus": ["50s_60s", "70s_80s"],
    };
    if (age && ageEraMap[age]) {
      p.temporal.era_preference.push(...ageEraMap[age]);
    }

    // Gêneros do dia a dia
    const genres = a["B1Q2"] as string[] | undefined;
    if (genres) {
      for (const g of genres) {
        const mapping = UI_GENRE_MAP[g];
        if (mapping) {
          for (const [dim, val] of Object.entries(mapping)) {
            (p.genres as Record<string, number>)[dim] =
              Math.min(1, ((p.genres as Record<string, number>)[dim] ?? 0) + (val as number) * 0.5);
          }
        }
      }
    }

    // Intenção da trilha
    const intention = a["B1Q4"] as string | undefined;
    const intentionMap: Record<string, Partial<MoodScores>> = {
      emotional:  { emotional: 0.9, romantic: 0.7 },
      elegant:    { elegant: 0.9 },
      fun:        { energetic: 0.85, joyful: 0.9 },
      balanced:   { emotional: 0.6, joyful: 0.6, energetic: 0.5 },
      background: { energetic: 0.2, joyful: 0.3, elegant: 0.5 },
    };
    if (intention && intentionMap[intention]) {
      Object.assign(p.mood, intentionMap[intention]);
    }
  }

  // ─── Venue constraints ────────────────────────────────────────────────────

  private static applyVenueConstraints(p: MusicProfileVector, a: QuizAnswers) {
    const ceremonyVenue = a["B2Q1"] as string | undefined;
    const partyVenue    = a["B2Q3"] as string | undefined;
    const religious     = a["B2Q2"] as string | undefined;
    const soundRestrict = a["B2Q4"] as string | undefined;

    if (ceremonyVenue) {
      p.context.ceremony_venue = ceremonyVenue;
      p.context.venue_type = ceremonyVenue;

      const preset = VENUE_PRESETS[ceremonyVenue];
      if (preset) {
        if (preset.genres) {
          for (const [k, v] of Object.entries(preset.genres)) {
            (p.genres as Record<string, number>)[k] = Math.min(
              1,
              ((p.genres as Record<string, number>)[k] ?? 0) * 0.3 + (v as number) * 0.7
            );
          }
        }
        if (preset.mood) Object.assign(p.mood, preset.mood);
        if (preset.formality) p.context.formality = preset.formality;
        if (preset.texture) p.instrumentation.texture = preset.texture;
      }
    }

    if (partyVenue) {
      p.context.party_venue = partyVenue;
    }

    // Restrição religiosa
    if (religious === "fully_religious") {
      p.context.religious_constraint = "strict";
      p.genres.electronic = 0;
      p.genres.funk = 0;
      p.genres.samba_pagode = 0;
      p.mood.spiritual = Math.max(p.mood.spiritual, 0.9);
    } else if (religious === "mixed" || religious === "symbolic") {
      p.context.religious_constraint = "mixed";
    } else {
      p.context.religious_constraint = "none";
    }

    // Restrição sonora
    if (soundRestrict === "acoustic_only" || soundRestrict === "strict") {
      p.context.sound_restriction = "strict";
      p.genres.electronic = 0;
      p.instrumentation.ensemble_size = "small_group";
    } else if (soundRestrict === "after_midnight") {
      p.context.sound_restriction = "moderate";
    }
  }

  // ─── Musical preferences ──────────────────────────────────────────────────

  private static applyMusicalPreferences(p: MusicProfileVector, a: QuizAnswers) {
    // Clima emocional por fase (matrix B3Q3)
    const matrix = a["B3Q3"] as Record<string, string> | undefined;
    if (matrix) {
      const momentKeyMap: Record<string, string> = {
        "Chegada dos convidados":       "guest_arrival",
        "Entrada dos noivos/festejado": "entrance",
        "Jantar/Coquetel":              "cocktail",
        "Festa/Dança":                  "party",
        "Encerramento":                 "closing",
      };
      for (const [row, mood] of Object.entries(matrix)) {
        const key = momentKeyMap[row];
        if (!key) continue;
        const energyMap: Record<string, number> = {
          romantic:  0.3,
          joyful:    0.5,
          elegant:   0.3,
          emotional: 0.35,
          energetic: 0.8,
        };
        if (!p.moments[key]) {
          p.moments[key] = {
            moment: key,
            energy_level: energyMap[mood] ?? 0.4,
            mood_primary: mood,
          };
        }
      }
    }
  }

  // ─── Instrumentation ──────────────────────────────────────────────────────

  private static applyInstrumentation(p: MusicProfileVector, a: QuizAnswers) {
    const ceremonyInstr = a["B4Q1"] as string | undefined;
    const vocalPref     = a["B4Q3"] as string | undefined;
    const texture       = a["B4Q4"] as string | undefined;

    const instrMap: Record<string, Partial<InstrumentationProfile>> = {
      string_quartet:        { ensemble_size: "small_group", preferred_instruments: ["strings"], has_vocals: false },
      piano_solo:            { ensemble_size: "solo",        preferred_instruments: ["piano"],   has_vocals: false },
      piano_violin:          { ensemble_size: "duo",         preferred_instruments: ["piano","strings"] },
      acoustic_guitar:       { ensemble_size: "solo",        preferred_instruments: ["guitar"],  has_vocals: false },
      acoustic_guitar_voice: { ensemble_size: "duo",         preferred_instruments: ["guitar"],  has_vocals: true },
      harp:                  { ensemble_size: "solo",        preferred_instruments: ["harp"],    has_vocals: false },
      choir:                 { ensemble_size: "orchestra",   has_vocals: true },
      full_band:             { ensemble_size: "full_band",   has_vocals: true },
    };

    if (ceremonyInstr && instrMap[ceremonyInstr]) {
      Object.assign(p.instrumentation, instrMap[ceremonyInstr]);
    }

    if (vocalPref) {
      if (vocalPref === "solo_female")        p.instrumentation.vocal_gender = "female";
      else if (vocalPref === "solo_male")     p.instrumentation.vocal_gender = "male";
      else if (vocalPref === "duet")          p.instrumentation.vocal_gender = "mixed";
      else if (vocalPref === "instrumental_only") p.instrumentation.has_vocals = false;
    }

    if (texture) {
      const textureMap: Record<string, InstrumentationProfile["texture"]> = {
        sparse_minimal:  "minimal",
        warm_intimate:   "warm",
        full_rich:       "full",
        grand_orchestral:"grand",
      };
      if (textureMap[texture]) p.instrumentation.texture = textureMap[texture];
    }
  }

  // ─── Moment-specific profiles ─────────────────────────────────────────────

  private static applyMomentProfiles(p: MusicProfileVector, a: QuizAnswers) {
    // Entrada
    const entrance = a["B5_ENTRANCE"] as string | undefined;
    if (entrance && entrance !== "no_first_dance") {
      const energyMap: Record<string, number> = {
        classic_romantic: 0.25, modern_pop: 0.4, cinematic: 0.6,
        surprising: 0.5, religious: 0.2, custom: 0.35,
      };
      p.moments["entrance"] = {
        moment: "entrance",
        energy_level: energyMap[entrance] ?? 0.3,
        mood_primary: entrance === "classic_romantic" ? "romantic" : "emotional",
      };
    }

    // Primeiro dance
    const firstDance = a["B5_FIRST_DANCE"] as string | undefined;
    if (firstDance && firstDance !== "no_first_dance") {
      const energyMap: Record<string, number> = {
        intimate_slow: 0.2, joyful_dance: 0.7, emotional_ballad: 0.3, classic_waltz: 0.3,
      };
      p.moments["first_dance"] = {
        moment: "first_dance",
        energy_level: energyMap[firstDance] ?? 0.3,
        mood_primary: firstDance === "joyful_dance" ? "joyful" : "romantic",
      };
    }

    // Coquetel
    const cocktail = a["B5_COCKTAIL"] as string | undefined;
    if (cocktail) {
      const genreBias: Record<string, Partial<GenreScores>> = {
        lounge_jazz:       { lounge: 0.8, jazz: 0.7 },
        mpb_acoustic:      { mpb: 0.9, bossa_nova: 0.4 },
        bossa_nova:        { bossa_nova: 0.9, jazz: 0.3 },
        light_pop:         { pop_intl: 0.6, pop_br: 0.5 },
        classical_strings: { classical: 0.9 },
        upbeat:            { pop_br: 0.7, sertanejo: 0.5 },
      };
      p.moments["cocktail"] = {
        moment: "cocktail",
        energy_level: cocktail === "upbeat" ? 0.65 : 0.35,
        mood_primary: cocktail === "upbeat" ? "joyful" : "elegant",
        genre_bias: genreBias[cocktail],
      };
    }

    // Jantar
    const dinner = a["B5_DINNER"] as string | undefined;
    if (dinner) {
      p.moments["dinner"] = {
        moment: "dinner",
        energy_level: dinner === "same_as_party" ? 0.7 : 0.3,
        mood_primary: "elegant",
        genre_bias: dinner === "jazz_bossa" ? { jazz: 0.7, bossa_nova: 0.7 } : undefined,
      };
    }

    // Festa
    const party = a["B5_PARTY"] as string[] | undefined;
    if (party && party.length > 0) {
      const genreBias: Partial<GenreScores> = {};
      const partyGenreMap: Record<string, Partial<GenreScores>> = {
        hit_parade:       { pop_br: 0.7, pop_intl: 0.6 },
        throwback:        { pop_intl: 0.7, pop_br: 0.5, rock: 0.4 },
        brazilian_party:  { samba_pagode: 0.9, mpb: 0.4 },
        sertanejo_univ:   { sertanejo: 0.9 },
        electronic_dance: { electronic: 0.9 },
        international_pop:{ pop_intl: 0.9 },
        forro_nordestino: { forro: 0.9 },
        rock_classics:    { rock: 0.9 },
      };
      for (const style of party) {
        const bias = partyGenreMap[style];
        if (bias) {
          for (const [k, v] of Object.entries(bias)) {
            (genreBias as Record<string, number>)[k] = Math.max(
              (genreBias as Record<string, number>)[k] ?? 0,
              v as number
            );
          }
        }
      }
      p.moments["party"] = {
        moment: "party",
        energy_level: 0.85,
        mood_primary: "energetic",
        mood_secondary: "joyful",
        genre_bias: genreBias,
      };
    }

    // Encerramento
    const closing = a["B5_CLOSING"] as string | undefined;
    if (closing) {
      const energyMap: Record<string, number> = {
        emotional_ballad: 0.3, high_energy: 0.95, meaningful_song: 0.4,
        sentimental_classic: 0.5, religious_closing: 0.25,
      };
      p.moments["closing"] = {
        moment: "closing",
        energy_level: energyMap[closing] ?? 0.5,
        mood_primary: closing === "high_energy" ? "energetic" : "emotional",
      };
    }
  }

  // ─── Temporal e idioma ────────────────────────────────────────────────────

  private static applyTemporalAndLanguage(p: MusicProfileVector, a: QuizAnswers) {
    const era = a["B3Q2"] as string | undefined;
    if (era) p.temporal.era_preference.push(era);

    const langs = a["B3Q1"] as string[] | undefined;
    if (langs && !langs.includes("no_preference")) {
      p.temporal.language_preference = langs;
    }
  }

  // ─── Blacklist ────────────────────────────────────────────────────────────

  private static applyBlacklist(p: MusicProfileVector, a: QuizAnswers) {
    const genreVetos = a["B6Q1"] as string[] | undefined;
    if (genreVetos) {
      const vetoMap: Record<string, string> = {
        no_funk:       "funk",
        no_sertanejo:  "sertanejo",
        no_pagode:     "samba_pagode",
        no_gospel:     "gospel",
        no_electronic: "electronic",
        no_forro:      "forro",
        no_classic:    "classical",
        no_rock:       "rock",
      };
      for (const veto of genreVetos) {
        if (veto === "none") continue;
        const genre = vetoMap[veto];
        if (genre) {
          p.blacklist.genres.push(genre);
          (p.genres as Record<string, number>)[genre] = 0;
        }
      }
    }

    // Músicas vetadas (texto livre — IDs resolvidos pelo frontend via Spotify search)
    const trackVeto = a["B6Q2"];
    if (Array.isArray(trackVeto)) {
      for (const ref of trackVeto as Array<{ spotifyId: string }>) {
        if (ref?.spotifyId) p.blacklist.trackIds.push(ref.spotifyId);
      }
    }
  }

  // ─── Seeds ────────────────────────────────────────────────────────────────

  private static applySeeds(p: MusicProfileVector, a: QuizAnswers) {
    const artists = a["B7Q1"] as Array<{ spotifyId: string }> | undefined;
    if (artists) {
      p.seeds.artistIds = artists.map((a) => a.spotifyId).filter(Boolean);
    }

    const tracks = a["B7Q2"] as Array<{ spotifyId: string }> | undefined;
    if (tracks) {
      p.seeds.trackIds = tracks.map((t) => t.spotifyId).filter(Boolean);
    }

    const playlist = a["B7Q3"] as string | undefined;
    if (playlist) {
      const match = playlist.match(/playlist\/([A-Za-z0-9]+)/);
      if (match) p.seeds.playlistIds.push(match[1]);
    }

    const reference = a["B7Q4"] as string | undefined;
    if (reference) p.seeds.referenceText = reference;
  }

  // ─── Normalização final ───────────────────────────────────────────────────

  private static normalize(p: MusicProfileVector) {
    // Clamp genres
    for (const key of Object.keys(p.genres) as Array<keyof GenreScores>) {
      p.genres[key] = Math.max(0, Math.min(1, p.genres[key]));
    }
    // Clamp moods
    for (const key of Object.keys(p.mood) as Array<keyof MoodScores>) {
      p.mood[key] = Math.max(0, Math.min(1, p.mood[key]));
    }
    // Clamp formality
    p.context.formality = Math.max(0, Math.min(1, p.context.formality));
    // Deduplica era preference
    p.temporal.era_preference = [...new Set(p.temporal.era_preference)];
  }
}
