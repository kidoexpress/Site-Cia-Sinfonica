// Regras musicais por tipo de local — usadas pelo SetlistBuilder para
// filtrar, priorizar e sugerir músicas curadas por contexto.

export interface VenueRule {
  allowedGenres?: string[];
  forbiddenGenres?: string[];
  requiredMinSpiritual?: number;
  texturePreference?: string;
  topSuggestions?: Record<string, string[]>;
}

export const VENUE_MUSIC_RULES: Record<string, VenueRule> = {
  catholic_church: {
    allowedGenres: ["classical", "gospel", "sacred_latin", "mpb_sacred"],
    forbiddenGenres: ["electronic", "sertanejo", "samba_pagode", "funk", "forro"],
    requiredMinSpiritual: 0.7,
    texturePreference: "full",
    topSuggestions: {
      entrance: [
        "Ave Maria (Schubert) - spotify:track:4RvWPyQ5RL0ao9LPZeSouE",
        "Canon in D (Pachelbel) - spotify:track:5rrDCRsLtDGiJZmHK5IQUB",
        "Air on the G String (Bach) - spotify:track:55W0t5sNLxCHZO3hiEn8sY",
        "Jesu Joy of Man's Desiring (Bach) - spotify:track:3dYD57gGFLMTDlk5RXWnWu",
        "Hallelujah Chorus (Handel) - spotify:track:7zAGfMvbFJ0BOiVp0E0wG9",
      ],
      ceremony: [
        "Panis Angelicus (Franck)",
        "Ave Verum Corpus (Mozart)",
        "Pie Jesu (Fauré)",
        "O Mio Babbino Caro (Puccini)",
        "Agnus Dei (Barber)",
      ],
    },
  },

  evangelical_church: {
    allowedGenres: ["gospel", "christian_pop", "worship", "ccm"],
    forbiddenGenres: ["electronic", "sertanejo", "samba_pagode", "funk", "forro"],
    requiredMinSpiritual: 0.8,
    topSuggestions: {
      entrance: [
        "Oceans (Hillsong United)",
        "Reckless Love (Cory Asbury)",
        "What a Beautiful Name (Hillsong Worship)",
        "Good Good Father (Chris Tomlin)",
        "In Christ Alone (Keith Getty)",
      ],
    },
  },

  outdoor: {
    allowedGenres: ["acoustic", "mpb", "bossa_nova", "folk", "indie", "pop_br", "pop_intl"],
    texturePreference: "warm",
    topSuggestions: {
      entrance: [
        "La Vie en Rose (Édith Piaf)",
        "O Que Será (Chico Buarque)",
        "Can't Help Falling in Love (Elvis Presley)",
        "A Sky Full of Stars (Coldplay) — versão acústica",
        "Everything (Michael Bublé)",
      ],
    },
  },

  hotel_ballroom: {
    allowedGenres: ["jazz", "classical", "lounge", "bossa_nova", "pop_intl", "mpb"],
    topSuggestions: {
      cocktail: [
        "Garota de Ipanema (João Gilberto)",
        "Fly Me to the Moon (Frank Sinatra)",
        "The Girl from Ipanema (Stan Getz)",
        "Come Away with Me (Norah Jones)",
        "Quando, Quando, Quando (Michael Bublé)",
      ],
    },
  },

  historic_venue: {
    allowedGenres: ["classical", "jazz", "lounge", "bossa_nova", "instrumental"],
    forbiddenGenres: ["funk", "electronic", "forro"],
    texturePreference: "grand",
  },

  beach_club: {
    allowedGenres: ["pop_br", "pop_intl", "electronic", "lounge", "reggae"],
    forbiddenGenres: ["classical", "gospel"],
    topSuggestions: {
      party: [
        "Então Vai (Thiaguinho)",
        "Blinding Lights (The Weeknd)",
        "Amor de Verão (Atitude 67)",
        "Savage Love (Jawsh 685)",
        "Benzema (Gusttavo Lima)",
      ],
    },
  },
};

/**
 * Retorna as sugestões curadas para um momento específico de um venue.
 */
export function getVenueSuggestions(venueType: string, moment: string): string[] {
  const rule = VENUE_MUSIC_RULES[venueType];
  return rule?.topSuggestions?.[moment] ?? [];
}

/**
 * Verifica se um gênero é permitido para determinado venue.
 * Retorna true se não há restrição explícita.
 */
export function isGenreAllowedForVenue(genre: string, venueType: string): boolean {
  const rule = VENUE_MUSIC_RULES[venueType];
  if (!rule) return true;
  if (rule.forbiddenGenres?.includes(genre)) return false;
  if (rule.allowedGenres && !rule.allowedGenres.includes(genre)) {
    // Se há lista de permitidos, apenas eles passam
    // (mas permite fallback se lista for vazia)
    return rule.allowedGenres.length === 0;
  }
  return true;
}
