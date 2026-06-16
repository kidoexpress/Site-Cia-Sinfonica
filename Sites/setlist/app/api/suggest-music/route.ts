import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

// ─── Tipos do frontend ──────────────────────────────────────────────────────
interface MomentRequest {
  id: string;
  label: string;
  tone: string;
  songRequest?: string;
}

interface SuggestionRequest {
  profile: {
    name1: string;
    name2: string;
    venueType: string;
    eventTone: string;
    guestCount: string;
    ageRange: string;
    languagePref: string[];
    blacklist: string;
    genreWeights: Record<string, number>;
  };
  moments: MomentRequest[];
}

export interface MusicSuggestion {
  title: string;
  artist: string;
  style: string;
  why: string;
  mood: "gentle" | "emotional" | "triumphant" | "festive" | "intimate";
  youtubeSearchUrl: string;
  youtubeMusicUrl: string;
}

export interface MomentSuggestions {
  momentId: string;
  momentLabel: string;
  curatorNote: string;
  suggestions: MusicSuggestion[];
}

// ─── Contexto para o prompt ─────────────────────────────────────────────────
const VENUE_CONTEXT: Record<string, string> = {
  catholic_church:    "Igreja Católica — preferir músicas sacras ou clássicas respeitosas; evitar músicas seculares muito populares",
  evangelical_church: "Igreja Evangélica — gospel, louvor contemporâneo e hinos são bem-vindos; erudito com letra cristã também",
  outdoor:            "Ao ar livre — música projeta menos, preferir formações que soem bem no ambiente aberto",
  event_hall:         "Salão de festas — acústica controlada, qualquer estilo funciona bem",
  hotel_ballroom:     "Hotel de luxo — elegância é fundamental; repertório sofisticado e bem-selecionado",
  private_house:      "Casa/chácara — intimidade, formações menores, som ambiente aconchegante",
  beach:              "Praia/beach club — leveza, alegria, bossa nova e reggae suave funcionam muito bem",
  historic_venue:     "Espaço histórico — erudito e clássico valorizam o ambiente; evitar músicas muito modernas",
};

const TONE_CONTEXT: Record<string, string> = {
  romantic_emotional: "Foco em emoção e beleza — músicas que provocam lágrimas e arrepios; narrativa musical forte",
  elegant_refined:    "Sofisticação acima de tudo — erudito, jazz, arranjos exclusivos; nada genérico",
  fun_danceable:      "Animação é prioridade — hits dançantes, energia alta, o casal quer festa",
  balanced:           "Mistura de emoção nos momentos-chave e festa na recepção",
  intimate_small:     "Celebração pequena e significativa — músicas pessoais, conexão emocional, escala menor",
};

function buildPrompt(req: SuggestionRequest): string {
  const topGenres =
    Object.entries(req.profile.genreWeights)
      .filter(([, w]) => w >= 3)
      .sort(([, a], [, b]) => b - a)
      .map(([g, w]) => `${g} (${w}/5)`)
      .join(", ") || "sem preferência forte de gênero";

  const venueCtx = VENUE_CONTEXT[req.profile.venueType] ?? req.profile.venueType;
  const toneCtx = TONE_CONTEXT[req.profile.eventTone] ?? req.profile.eventTone;
  const blacklist = req.profile.blacklist
    ? `\nMÚSICAS PROIBIDAS (nunca sugerir): ${req.profile.blacklist}`
    : "";
  const langPref = req.profile.languagePref.length
    ? `\nPreferência de idioma: ${req.profile.languagePref.join(", ")}`
    : "";

  const momentsList = req.moments
    .map(
      (m) =>
        `- ${m.label} (id: ${m.id})${m.tone ? ` | clima desejado: "${m.tone}"` : ""}${m.songRequest ? ` | pedido específico do casal: "${m.songRequest}"` : ""}`
    )
    .join("\n");

  return `Você é um diretor musical especialista em casamentos de alto padrão da Cia. Sinfônica. Crie sugestões de repertório personalizadas para o casamento de ${req.profile.name1} e ${req.profile.name2}.

PERFIL DO CASAL:
- Local: ${venueCtx}
- Tom geral do evento: ${toneCtx}
- Número de convidados: ${req.profile.guestCount || "não informado"}
- Faixa etária do casal: ${req.profile.ageRange || "não informada"}
- Gêneros favoritos: ${topGenres}${langPref}${blacklist}

MOMENTOS DO EVENTO PARA MUSICAR:
${momentsList}

INSTRUÇÕES:
Para cada momento listado, sugira exatamente 3 músicas. Para cada música forneça:
1. Título exato da música (use nomes reais — nunca invente títulos)
2. Artista / compositor original
3. Estilo/formação recomendada (ex: "Quarteto de cordas", "Piano solo", "Voz e violão")
4. Por que essa música funciona neste momento específico para este casal (1-2 frases personalizadas)
5. Energia: "gentle", "emotional", "triumphant", "festive" ou "intimate"

Se o casal pediu uma música específica para um momento, inclua-a como primeira sugestão (ajuste o estilo para a formação certa). Respeite rigorosamente as músicas proibidas. Prefira obras consagradas e adequadas a cada contexto (especialmente restrições religiosas).`;
}

// ─── Schema de saída estruturada ────────────────────────────────────────────
const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    moments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          momentId: { type: "string" },
          momentLabel: { type: "string" },
          curatorNote: { type: "string" },
          suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                artist: { type: "string" },
                style: { type: "string" },
                why: { type: "string" },
                mood: { type: "string", enum: ["gentle", "emotional", "triumphant", "festive", "intimate"] },
              },
              required: ["title", "artist", "style", "why", "mood"],
              additionalProperties: false,
            },
          },
        },
        required: ["momentId", "momentLabel", "curatorNote", "suggestions"],
        additionalProperties: false,
      },
    },
  },
  required: ["moments"],
  additionalProperties: false,
} as const;

interface RawMoment {
  momentId: string;
  momentLabel: string;
  curatorNote: string;
  suggestions: Omit<MusicSuggestion, "youtubeSearchUrl" | "youtubeMusicUrl">[];
}

export async function POST(req: NextRequest) {
  try {
    const body: SuggestionRequest = await req.json();

    if (!body.profile || !body.moments?.length) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY não configurada no servidor (.env.local)." },
        { status: 500 }
      );
    }

    const prompt = buildPrompt(body);

    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: OUTPUT_SCHEMA },
      },
      messages: [{ role: "user", content: prompt }],
    });

    // Com output_config.format, o primeiro bloco de texto é JSON válido.
    const rawText = message.content.find((b) => b.type === "text");
    if (!rawText || rawText.type !== "text") {
      throw new Error("Resposta sem conteúdo de texto");
    }

    const parsed = JSON.parse(rawText.text) as { moments: RawMoment[] };

    const enriched: MomentSuggestions[] = parsed.moments.map((m) => ({
      ...m,
      suggestions: m.suggestions.map((s) => {
        const query = encodeURIComponent(`${s.title} ${s.artist}`);
        return {
          ...s,
          mood: s.mood as MusicSuggestion["mood"],
          youtubeSearchUrl: `https://www.youtube.com/results?search_query=${query}`,
          youtubeMusicUrl: `https://music.youtube.com/search?q=${query}`,
        };
      }),
    }));

    return NextResponse.json({ moments: enriched });
  } catch (err) {
    console.error("[suggest-music]", err);
    const detail = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: "Erro ao gerar sugestões", detail }, { status: 500 });
  }
}
