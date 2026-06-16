"use client";
import { useState } from "react";
import { Music, AlertCircle } from "lucide-react";
import { PhaseHeader } from "./fields";
import type { Phase1Data } from "./types";
import type { MomentSuggestions, MusicSuggestion } from "@/app/api/suggest-music/route";

const MOOD_COLORS: Record<string, string> = {
  gentle: "#7EB8A4", emotional: "#B89D6B", triumphant: "#C4A35A",
  festive: "#E87040", intimate: "#8B9DC3",
};

const MOMENT_ICONS: Record<string, string> = {
  guest_arrival: "👥", entrance_groom: "🤵", entrance_bride: "👰",
  vows: "💍", signing: "✍️", exit: "🎊", cocktail: "🥂",
  dinner: "🍽️", first_dance: "💃", parent_dance: "👨‍👩‍👧",
  party: "🎉", last_dance: "✨",
};

type AiStatus = "idle" | "loading" | "success" | "error";

export function Phase3Results({ profile, aiStatus, aiResults, aiError, onBack }: {
  profile: Phase1Data | null;
  aiStatus: AiStatus;
  aiResults: MomentSuggestions[];
  aiError: string | null;
  onBack: () => void;
}) {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "120px clamp(20px, 4vw, 60px) 100px" }}>
      <PhaseHeader
        phase={0}
        title={
          aiStatus === "loading"
            ? "Consultando o curador…"
            : `O início do seu repertório${profile?.name1 ? `, ${profile.name1} & ${profile.name2}` : ""}.`
        }
        lead={
          aiStatus === "loading"
            ? "Estamos analisando o seu perfil para selecionar as melhores obras para cada momento."
            : "Sugestões geradas com base no seu perfil. Nosso curador refinará cada detalhe na consultoria."
        }
      />

      {aiStatus === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "60px 0" }}>
          <div style={{ position: "relative", width: 72, height: 72 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid var(--line-dark)" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "var(--gold)", animation: "spin 1s linear infinite" }} />
            <Music size={28} color="var(--gold)" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 17, fontWeight: 500, color: "var(--on-dark)" }}>Analisando o seu perfil musical…</p>
            <p style={{ fontSize: 14, color: "var(--on-dark-3)", marginTop: 8 }}>
              Nosso curador virtual está selecionando as melhores obras para cada momento.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Cerimônia", "Emoção", "Espaço", "Estilo"].map((label, i) => (
              <span key={label} style={{
                padding: "6px 14px", borderRadius: 100, fontSize: 12.5, fontWeight: 500,
                background: "rgba(184,157,107,.12)", border: "1px solid rgba(184,157,107,.2)",
                color: "var(--gold)", animation: `pulse 2s ease ${i * 0.3}s infinite`,
              }}>{label}</span>
            ))}
          </div>
        </div>
      )}

      {aiStatus === "error" && (
        <div style={{
          padding: "32px 36px", borderRadius: "var(--radius-lg)",
          border: "1px solid rgba(220,60,60,.25)", background: "rgba(220,60,60,.06)",
          display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 32,
        }}>
          <AlertCircle size={20} color="#E05555" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#E05555" }}>Não conseguimos gerar as sugestões agora.</p>
            <p style={{ fontSize: 13.5, color: "var(--on-dark-3)", marginTop: 6, lineHeight: 1.6 }}>
              Verifique a variável <code>ANTHROPIC_API_KEY</code> no <code>.env.local</code> e tente novamente.
              <br />Detalhe: {aiError}
            </p>
          </div>
        </div>
      )}

      {aiStatus === "success" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {aiResults.map((m) => <MomentCard key={m.momentId} data={m} />)}
        </div>
      )}

      {(aiStatus === "success" || aiStatus === "error") && (
        <div style={{
          marginTop: 56, padding: "36px 40px", borderRadius: "var(--radius-lg)",
          background: "linear-gradient(135deg, rgba(184,157,107,.12), rgba(184,157,107,.04))",
          border: "1px solid rgba(184,157,107,.25)",
        }}>
          <h3 style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>Pronto para o próximo passo?</h3>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--on-dark-2)", marginTop: 10, maxWidth: "44ch" }}>
            Leve este repertório para a consultoria — nossos diretores criam arranjos exclusivos e cuidam de toda a produção ao vivo.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <a href="/#contact" style={{
              height: 52, padding: "0 28px", borderRadius: 100, background: "var(--ivory)", color: "var(--ink)",
              display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 600, textDecoration: "none",
            }}>
              Iniciar consultoria com este repertório
            </a>
            <button onClick={onBack} style={{
              height: 52, padding: "0 24px", borderRadius: 100, border: "1px solid var(--line-dark)",
              background: "transparent", color: "var(--on-dark-2)", fontSize: 14, cursor: "pointer", fontFamily: "inherit",
            }}>
              ← Ajustar preferências
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MomentCard({ data }: { data: MomentSuggestions }) {
  return (
    <div style={{
      border: "1px solid var(--line-dark)", borderRadius: "var(--radius-lg)",
      background: "rgba(255,255,255,.025)", overflow: "hidden", animation: "fadeUp .5s var(--ease-out) both",
    }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line-dark)", display: "flex", alignItems: "flex-start", gap: 14 }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>{MOMENT_ICONS[data.momentId] ?? "🎵"}</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>{data.momentLabel}</h3>
          <p style={{ fontSize: 13.5, color: "var(--on-dark-3)", marginTop: 5, lineHeight: 1.55 }}>{data.curatorNote}</p>
        </div>
      </div>
      <div style={{ padding: "8px 0" }}>
        {data.suggestions.map((s, i) => <SuggestionRow key={i} s={s} rank={i + 1} last={i === data.suggestions.length - 1} />)}
      </div>
    </div>
  );
}

function SuggestionRow({ s, rank, last }: { s: MusicSuggestion; rank: number; last: boolean }) {
  const moodColor = MOOD_COLORS[s.mood] ?? "var(--gold)";
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ padding: "14px 20px", borderBottom: last ? "none" : "1px solid rgba(255,255,255,.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 24, fontSize: 12, fontWeight: 700, color: rank === 1 ? "var(--gold)" : "var(--on-dark-3)", flexShrink: 0, textAlign: "center" }}>
          {rank === 1 ? "★" : rank}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--on-dark)", letterSpacing: "-0.01em" }}>{s.title}</p>
            <span style={{
              fontSize: 11, padding: "2px 9px", borderRadius: 100, background: `${moodColor}22`, color: moodColor,
              fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", flexShrink: 0,
            }}>{s.mood}</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--on-dark-3)", marginTop: 3 }}>
            {s.artist} · <span style={{ color: "var(--on-dark-2)" }}>{s.style}</span>
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button onClick={() => setExpanded((e) => !e)} title="Por que esta música?"
            aria-label="Por que esta música?"
            style={{
              width: 30, height: 30, borderRadius: "50%", border: "1px solid var(--line-dark)", background: "transparent",
              color: "var(--on-dark-3)", cursor: "pointer", fontSize: 13, display: "grid", placeItems: "center", fontFamily: "inherit",
            }}>?</button>
          <a href={s.youtubeSearchUrl} target="_blank" rel="noopener noreferrer" title="Pesquisar no YouTube" aria-label="Pesquisar no YouTube"
            style={{ width: 34, height: 34, borderRadius: 8, background: "#FF0000", display: "grid", placeItems: "center" }}>
            <svg width="14" height="10" viewBox="0 0 24 17" fill="white" aria-hidden="true">
              <path d="M23.5 2.7A3 3 0 0 0 21.4.6C19.5 0 12 0 12 0S4.5 0 2.6.6A3 3 0 0 0 .5 2.7C0 4.6 0 8.5 0 8.5s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1C4.5 17 12 17 12 17s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 12.4 24 8.5 24 8.5s0-3.9-.5-5.8zM9.5 12.1V4.9l6.3 3.6-6.3 3.6z"/>
            </svg>
          </a>
          <a href={s.youtubeMusicUrl} target="_blank" rel="noopener noreferrer" title="Ouvir no YouTube Music" aria-label="Ouvir no YouTube Music"
            style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,.08)", border: "1px solid var(--line-dark)", display: "grid", placeItems: "center" }}>
            <Music size={13} color="var(--on-dark-2)" />
          </a>
        </div>
      </div>
      {expanded && (
        <div style={{
          marginTop: 12, marginLeft: 38, padding: "12px 16px", borderRadius: "var(--radius)",
          background: "rgba(184,157,107,.07)", border: "1px solid rgba(184,157,107,.15)",
        }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--on-dark-2)", fontStyle: "italic" }}>&ldquo;{s.why}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
