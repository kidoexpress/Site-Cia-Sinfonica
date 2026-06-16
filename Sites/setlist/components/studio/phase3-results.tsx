"use client";
import { useMemo } from "react";
import { Music, ExternalLink } from "lucide-react";
import { Phase1Data, MomentConfig, ALL_MOMENTS, getSuggestionsForMoment } from "./types";
import { PhaseHeader } from "./fields";

export function Phase3Results({ profile, moments, onBack }: {
  profile: Phase1Data;
  moments: Record<string, MomentConfig>;
  onBack: () => void;
}) {
  const results = useMemo(() => {
    const activeMoments = ALL_MOMENTS.filter((m) => moments[m.id]?.active);
    return activeMoments.map((m) => ({
      moment: m,
      config: moments[m.id],
      suggestions: getSuggestionsForMoment(m.id, moments[m.id].tone, profile),
      customRequest: moments[m.id].songRequest,
    }));
  }, [moments, profile]);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "120px clamp(20px, 4vw, 60px) 100px" }}>
      <PhaseHeader
        phase={0}
        title={`O início do seu repertório, ${profile.name1} & ${profile.name2}.`}
        lead="Com base no seu perfil, selecionamos sugestões para cada momento. Nosso curador irá refiná-las na consultoria."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {results.map(({ moment, config, suggestions, customRequest }) => (
          <div key={moment.id} style={{
            border: "1px solid var(--line-dark)", borderRadius: "var(--radius-lg)",
            background: "rgba(255,255,255,.025)", overflow: "hidden",
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line-dark)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 22 }}>{moment.icon}</span>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>{moment.label}</h3>
                {config.tone && <p style={{ fontSize: 12.5, color: "var(--gold)", marginTop: 3, fontWeight: 500 }}>{config.tone}</p>}
              </div>
            </div>

            <div style={{ padding: "16px 8px" }}>
              {customRequest && (
                <div style={{
                  margin: "0 16px 12px", padding: "12px 16px", borderRadius: "var(--radius)",
                  background: "var(--gold-faint)", border: "1px solid rgba(184,157,107,.3)",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <Music size={15} color="var(--gold)" />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold)" }}>Pedido do casal</p>
                    <p style={{ fontSize: 14, color: "var(--on-dark)", marginTop: 2 }}>&ldquo;{customRequest}&rdquo;</p>
                  </div>
                </div>
              )}

              {suggestions.length > 0 ? suggestions.map((s) => (
                <div key={s.title} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "13px 16px",
                  borderRadius: "var(--radius)", transition: "background .25s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.08)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Music size={14} color="var(--gold)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14.5, fontWeight: 500, color: "var(--on-dark)", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</p>
                    <p style={{ fontSize: 12.5, color: "var(--on-dark-3)", marginTop: 3 }}>{s.artist} · {s.style}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    {s.spotifyId && (
                      <a href={`https://open.spotify.com/track/${s.spotifyId}`} target="_blank" rel="noopener noreferrer"
                        style={{ width: 30, height: 30, borderRadius: "50%", background: "#1DB954", display: "grid", placeItems: "center" }} title="Ouvir no Spotify">
                        <ExternalLink size={13} color="#fff" />
                      </a>
                    )}
                    {s.youtubeId && (
                      <a href={`https://www.youtube.com/watch?v=${s.youtubeId}`} target="_blank" rel="noopener noreferrer"
                        style={{ width: 30, height: 30, borderRadius: "50%", background: "#FF0000", display: "grid", placeItems: "center" }} title="Ver no YouTube">
                        <ExternalLink size={13} color="#fff" />
                      </a>
                    )}
                  </div>
                </div>
              )) : (
                <p style={{ padding: "16px 20px", fontSize: 14, color: "var(--on-dark-3)", fontStyle: "italic" }}>
                  Nosso curador selecionará opções personalizadas para este momento na consultoria.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 56, padding: "36px 40px", borderRadius: "var(--radius-lg)",
        background: "linear-gradient(135deg, rgba(184,157,107,.12), rgba(184,157,107,.04))",
        border: "1px solid rgba(184,157,107,.25)",
        display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start",
      }}>
        <div>
          <h3 style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>Pronto para o próximo passo?</h3>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--on-dark-2)", marginTop: 10, maxWidth: "44ch" }}>
            Estas são sugestões iniciais. Na consultoria, um dos nossos diretores vai refinar cada detalhe com você — arranjos exclusivos, timing preciso e toda a produção ao vivo.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/#contact"
            style={{
              height: 52, padding: "0 28px", borderRadius: 100, background: "var(--ivory)", color: "var(--ink)",
              display: "flex", alignItems: "center", fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.01em", textDecoration: "none",
            }}
          >
            Iniciar consultoria com este repertório
          </a>
          <button onClick={onBack}
            style={{ height: 52, padding: "0 24px", borderRadius: 100, border: "1px solid var(--line-dark)", background: "transparent", color: "var(--on-dark-2)", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
            ← Ajustar preferências
          </button>
        </div>
      </div>
    </div>
  );
}
