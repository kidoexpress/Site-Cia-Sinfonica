// Tipos e dados compartilhados entre as 3 fases do Estúdio de Curadoria

export interface Phase1Data {
  name1: string;
  name2: string;
  eventDate: string;
  venueName: string;
  venueType: string;
  guestCount: string;
  ageRange: string;
  eventTone: string;
  genreWeights: Record<string, number>; // 0–5
  languagePref: string[];
  blacklist: string;
}

export interface MomentConfig {
  active: boolean;
  tone: string;
  songRequest: string;
}

export const VENUE_TYPES = [
  { value: "catholic_church",    label: "Igreja Católica",        icon: "⛪" },
  { value: "evangelical_church", label: "Igreja Evangélica",      icon: "✝️" },
  { value: "outdoor",            label: "Ao ar livre",            icon: "🌿" },
  { value: "event_hall",         label: "Salão de festas",        icon: "🏛️" },
  { value: "hotel_ballroom",     label: "Hotel / Espaço de luxo", icon: "✨" },
  { value: "private_house",      label: "Casa / Chácara / Sítio", icon: "🏡" },
  { value: "beach",              label: "Praia / Beach club",     icon: "🌊" },
  { value: "historic_venue",     label: "Espaço histórico",       icon: "🏰" },
];

export const TONES = [
  { value: "romantic_emotional", label: "Romântico e emocionante",   sub: "Cada música conta uma história" },
  { value: "elegant_refined",    label: "Elegante e sofisticado",    sub: "Bem-selecionado, sem excessos" },
  { value: "fun_danceable",      label: "Animado e dançante",        sub: "Quero que todo mundo dance" },
  { value: "balanced",           label: "Equilibrado",               sub: "Momentos de emoção e de festa" },
  { value: "intimate_small",     label: "Intimista e aconchegante",  sub: "Celebração pequena e significativa" },
];

export const GENRES = [
  { id: "mpb",        label: "MPB / Bossa Nova" },
  { id: "classical",  label: "Erudito / Clássico" },
  { id: "jazz",       label: "Jazz / Soul" },
  { id: "pop_br",     label: "Pop Brasileiro" },
  { id: "pop_intl",   label: "Pop Internacional" },
  { id: "sertanejo",  label: "Sertanejo" },
  { id: "pagode",     label: "Pagode / Samba" },
  { id: "gospel",     label: "Gospel / Cristão" },
  { id: "electronic", label: "Eletrônica" },
  { id: "forro",      label: "Forró" },
  { id: "rock",       label: "Rock" },
  { id: "lounge",     label: "Lounge / Ambiente" },
];

export const ALL_MOMENTS = [
  { id: "guest_arrival",  label: "Chegada dos convidados", icon: "👥", defaultOn: true },
  { id: "entrance_groom", label: "Entrada do noivo",       icon: "🤵", defaultOn: true },
  { id: "entrance_bride", label: "Entrada da noiva",       icon: "👰", defaultOn: true },
  { id: "vows",           label: "Votos e cerimônia",      icon: "💍", defaultOn: true },
  { id: "signing",        label: "Assinatura do registro", icon: "✍️", defaultOn: true },
  { id: "exit",           label: "Saída dos noivos",       icon: "🎊", defaultOn: true },
  { id: "cocktail",       label: "Coquetel",               icon: "🥂", defaultOn: true },
  { id: "dinner",         label: "Jantar",                 icon: "🍽️", defaultOn: false },
  { id: "first_dance",    label: "Primeira dança",         icon: "💃", defaultOn: true },
  { id: "parent_dance",   label: "Dança com os pais",      icon: "👨‍👩‍👧", defaultOn: false },
  { id: "party",          label: "Festa / Pista de dança", icon: "🎉", defaultOn: true },
  { id: "last_dance",     label: "Última música",          icon: "✨", defaultOn: false },
];

export const MOMENT_TONES: Record<string, { label: string; energy: number }[]> = {
  guest_arrival:  [{ label: "Lounge / Jazz", energy: 0.3 }, { label: "MPB acústica", energy: 0.2 }, { label: "Erudito suave", energy: 0.15 }],
  entrance_bride: [{ label: "Clássico emocionante", energy: 0.7 }, { label: "Cinematográfico", energy: 0.8 }, { label: "Pop com significado", energy: 0.6 }, { label: "Religioso / Sacro", energy: 0.4 }],
  vows:           [{ label: "Cordas suaves (ppp)", energy: 0.1 }, { label: "Piano solo", energy: 0.15 }, { label: "Silêncio musical", energy: 0.05 }],
  exit:           [{ label: "Triunfal / Metais", energy: 0.95 }, { label: "Alegre e animado", energy: 0.85 }, { label: "Pop celebratório", energy: 0.8 }],
  cocktail:       [{ label: "Jazz trio", energy: 0.4 }, { label: "Bossa Nova", energy: 0.3 }, { label: "Pop internacional leve", energy: 0.35 }],
  first_dance:    [{ label: "Balada íntima", energy: 0.4 }, { label: "Animado / surpresa", energy: 0.75 }, { label: "Clássico romântico", energy: 0.35 }],
  party:          [{ label: "Hits atuais", energy: 0.9 }, { label: "Flashback 80s/90s/2000s", energy: 0.85 }, { label: "Sertanejo", energy: 0.8 }, { label: "Pagode / Samba", energy: 0.85 }, { label: "Eletrônica", energy: 0.95 }],
};

// Motor de sugestão local (sem API externa no MVP)
export const SUGGESTIONS_DB: Record<string, { title: string; artist: string; spotifyId?: string; youtubeId?: string; style: string }[]> = {
  "entrance_bride:clássico": [
    { title: "Canon in D Major", artist: "Johann Pachelbel", spotifyId: "2WbJYgRMzm0xK5GYmjhEGM", youtubeId: "NlprozGcs80", style: "Quarteto de cordas" },
    { title: "Spiegel im Spiegel", artist: "Arvo Pärt", spotifyId: "5NGtFXVpXSvwunEIGeviY3", youtubeId: "TJ6Mzvh3XCc", style: "Piano e violino" },
    { title: "Air on the G String", artist: "J.S. Bach", spotifyId: "3mKKkGKBBcV7kWVkmJbSBm", youtubeId: "GMkmQlfOJDk", style: "Orquestra de cordas" },
  ],
  "entrance_bride:cinematográfico": [
    { title: "A Thousand Years", artist: "Christina Perri", spotifyId: "34gCuhDGsG4bRPIf9bb02f", youtubeId: "rtOvBOTyX00", style: "Piano e cordas" },
    { title: "Marry Me", artist: "Train", spotifyId: "2kxxOBbpXDOK6FiknnSEDk", youtubeId: "WRlUMCTITCc", style: "Versão acústica" },
    { title: "All of Me", artist: "John Legend", spotifyId: "3U4isOIWM3VvDubwSI3y7a", youtubeId: "450p7goxZqg", style: "Piano solo" },
  ],
  "entrance_bride:pop": [
    { title: "A Thousand Years", artist: "Christina Perri", spotifyId: "34gCuhDGsG4bRPIf9bb02f", youtubeId: "rtOvBOTyX00", style: "Piano e cordas" },
    { title: "Perfect", artist: "Ed Sheeran", spotifyId: "0tgVpDi06FyKpA1z0VMD4v", youtubeId: "2Vv-BfVoq4g", style: "Orquestra de cordas" },
  ],
  "entrance_bride:religioso": [
    { title: "Ave Maria", artist: "Franz Schubert", spotifyId: "2WbJYgRMzm0xK5GYmjhEGM", youtubeId: "2H5Zx2nfFKM", style: "Voz e cordas" },
    { title: "Panis Angelicus", artist: "César Franck", spotifyId: "2WbJYgRMzm0xK5GYmjhEGM", youtubeId: "qY5Rc1ad7Bk", style: "Voz solo e órgão" },
  ],
  "vows:cordas": [
    { title: "Spiegel im Spiegel", artist: "Arvo Pärt", spotifyId: "5NGtFXVpXSvwunEIGeviY3", youtubeId: "TJ6Mzvh3XCc", style: "Cordas ppp" },
    { title: "Gymnopédie No. 1", artist: "Erik Satie", spotifyId: "5NGtFXVpXSvwunEIGeviY3", youtubeId: "S-Xm7s9eGxU", style: "Piano solo" },
  ],
  "vows:piano": [
    { title: "Gymnopédie No. 1", artist: "Erik Satie", spotifyId: "5NGtFXVpXSvwunEIGeviY3", youtubeId: "S-Xm7s9eGxU", style: "Piano solo" },
    { title: "River Flows in You", artist: "Yiruma", spotifyId: "3eYNQO9XwGEYTQA9eLgkOK", youtubeId: "7maJOI3QMu0", style: "Piano solo" },
  ],
  "first_dance:balada": [
    { title: "Thinking Out Loud", artist: "Ed Sheeran", spotifyId: "34d44pZx8nNKsHVhCNJfxR", youtubeId: "lp-EO5I60KA", style: "Versão acústica" },
    { title: "Perfect", artist: "Ed Sheeran", spotifyId: "0tgVpDi06FyKpA1z0VMD4v", youtubeId: "2Vv-BfVoq4g", style: "Orquestra de cordas" },
    { title: "Eu Sei Que Vou Te Amar", artist: "Tom Jobim & Vinícius de Moraes", spotifyId: "3IH4xBnBq50B8oGkIWZ1ow", youtubeId: "Sxvp52PL5GE", style: "Bossa Nova" },
  ],
  "first_dance:clássico": [
    { title: "At Last", artist: "Etta James", spotifyId: "49eHaUQB1Jht66Rr68xfdj", youtubeId: "S-cbOl96RFM", style: "Soul / Big Band" },
    { title: "Eu Sei Que Vou Te Amar", artist: "Tom Jobim & Vinícius de Moraes", spotifyId: "3IH4xBnBq50B8oGkIWZ1ow", youtubeId: "Sxvp52PL5GE", style: "Bossa Nova" },
  ],
  "cocktail:jazz": [
    { title: "The Girl from Ipanema", artist: "Stan Getz & João Gilberto", spotifyId: "6WoILmBMSgMElnp3dR0Ukt", youtubeId: "GKqBFq6NLXE", style: "Trio de jazz" },
    { title: "Garota de Ipanema", artist: "Tom Jobim", spotifyId: "3AA28KZvwAUcZuOPPJMuRu", youtubeId: "GKqBFq6NLXE", style: "Bossa Nova" },
    { title: "Fly Me to the Moon", artist: "Frank Sinatra", spotifyId: "5b2RITNFFgxKb5Feo50v3Gv", youtubeId: "ZEcqHA7dbwM", style: "Big Band" },
  ],
  "cocktail:bossa": [
    { title: "Garota de Ipanema", artist: "Tom Jobim", spotifyId: "3AA28KZvwAUcZuOPPJMuRu", youtubeId: "GKqBFq6NLXE", style: "Bossa Nova" },
    { title: "Wave", artist: "Antônio Carlos Jobim", spotifyId: "3IH4xBnBq50B8oGkIWZ1ow", youtubeId: "tV6G9nLfE9c", style: "Bossa Nova" },
  ],
  "exit:triunfal": [
    { title: "Ode to Joy (arr. para metais)", artist: "Beethoven", spotifyId: "2WbJYgRMzm0xK5GYmjhEGM", youtubeId: "04854XqcfBg", style: "Metais e cordas" },
    { title: "Trumpet Voluntary", artist: "Jeremiah Clarke", spotifyId: "2WbJYgRMzm0xK5GYmjhEGM", youtubeId: "N1NdAVilpwk", style: "Trompete e órgão" },
  ],
  "exit:alegre": [
    { title: "Signed, Sealed, Delivered", artist: "Stevie Wonder", spotifyId: "5O4erNlJ74PIF6kGol1gVm", youtubeId: "Cy8Tk5lf0Fc", style: "Soul / banda" },
    { title: "Marry You", artist: "Bruno Mars", spotifyId: "6SKwQghsR8AISlxhcwyA9R", youtubeId: "Hd_O--C4idc", style: "Pop celebratório" },
  ],
  "party:hits": [
    { title: "Levitating", artist: "Dua Lipa", spotifyId: "463CkQjx2Zk1yXoBuierM9", youtubeId: "TUVcZfQe-Kw", style: "Pop eletrônico" },
    { title: "Blinding Lights", artist: "The Weeknd", spotifyId: "0VjIjW4GlUZAMYd2vXMi3b", youtubeId: "4NRXx6U8ABQ", style: "Synth-pop" },
    { title: "Evidências", artist: "Chitãozinho & Xororó", spotifyId: "3ynv8cuf3wL5zGTGQ80QDV", youtubeId: "gdTXCMCGy-c", style: "Sertanejo" },
  ],
  "party:flashback": [
    { title: "September", artist: "Earth, Wind & Fire", spotifyId: "2grjqo0Frpf2okIBiifQKs", youtubeId: "Gs069dndIYk", style: "Funk / Disco" },
    { title: "Dancing Queen", artist: "ABBA", spotifyId: "0GjEhVFGZW8afUYGChl3z9", youtubeId: "xFrGuyw1V8s", style: "Pop dos anos 70" },
  ],
  "party:sertanejo": [
    { title: "Evidências", artist: "Chitãozinho & Xororó", spotifyId: "3ynv8cuf3wL5zGTGQ80QDV", youtubeId: "gdTXCMCGy-c", style: "Sertanejo" },
    { title: "Ai Se Eu Te Pego", artist: "Michel Teló", spotifyId: "5Lf1GqtVppDjmmtWzWbqfz", youtubeId: "hcm55lU9knw", style: "Sertanejo" },
  ],
  "party:pagode": [
    { title: "Tá Escrito", artist: "Grupo Revelação", spotifyId: "3IH4xBnBq50B8oGkIWZ1ow", youtubeId: "5qZ4dE3xUJk", style: "Pagode" },
    { title: "Deixa Acontecer", artist: "Grupo Revelação", spotifyId: "3IH4xBnBq50B8oGkIWZ1ow", youtubeId: "iAjCxBl9p_I", style: "Pagode" },
  ],
};

export function getSuggestionsForMoment(
  momentId: string,
  tone: string,
  profile: Phase1Data
): { title: string; artist: string; spotifyId?: string; youtubeId?: string; style: string }[] {
  const key = `${momentId}:${tone.toLowerCase().replace(/\s.+/, "")}`;
  const results = SUGGESTIONS_DB[key] ?? [];

  const blacklist = profile.blacklist
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return results.filter(
    (s) => !blacklist.some((b) => s.title.toLowerCase().includes(b) || s.artist.toLowerCase().includes(b))
  );
}
