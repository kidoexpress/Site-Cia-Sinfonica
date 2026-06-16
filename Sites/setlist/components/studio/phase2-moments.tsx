"use client";
import { useState } from "react";
import { MomentConfig, ALL_MOMENTS, MOMENT_TONES } from "./types";
import { PhaseHeader } from "./fields";

export interface ActiveMoment {
  id: string;
  label: string;
  tone: string;
  songRequest: string;
}

export function Phase2Moments({ onNext, onBack }: {
  onNext: (data: Record<string, MomentConfig>, activeList: ActiveMoment[]) => void;
  onBack: () => void;
}) {
  const [moments, setMoments] = useState<Record<string, MomentConfig>>(
    Object.fromEntries(ALL_MOMENTS.map((m) => [m.id, { active: m.defaultOn, tone: "", songRequest: "" }]))
  );
  const [expanded, setExpanded] = useState<string | null>("entrance_bride");
  const [submitting, setSubmitting] = useState(false);

  const toggle = (id: string) =>
    setMoments((prev) => ({ ...prev, [id]: { ...prev[id], active: !prev[id].active } }));

  const setMomentProp = (id: string, key: keyof MomentConfig, val: string | boolean) =>
    setMoments((prev) => ({ ...prev, [id]: { ...prev[id], [key]: val } }));

  const activeCount = Object.values(moments).filter((m) => m.active).length;

  const handleNext = () => {
    if (activeCount === 0 || submitting) return;
    setSubmitting(true);
    const activeList: ActiveMoment[] = ALL_MOMENTS
      .filter((m) => moments[m.id]?.active)
      .map((m) => ({
        id: m.id,
        label: m.label,
        tone: moments[m.id].tone,
        songRequest: moments[m.id].songRequest,
      }));
    onNext(moments, activeList);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "120px clamp(20px, 4vw, 60px) 80px" }}>
      <PhaseHeader
        phase={2}
        title="Quais momentos precisam de música?"
        lead="Ative os momentos do seu evento e, para cada um, nos diga o clima desejado — e se já tem uma música em mente."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 48 }}>
        {ALL_MOMENTS.map((m) => {
          const cfg = moments[m.id];
          const tones = MOMENT_TONES[m.id] ?? [];
          const isOpen = expanded === m.id && cfg.active;

          return (
            <div key={m.id} style={{
              border: `1px solid ${cfg.active && isOpen ? "var(--gold)" : "var(--line-dark)"}`,
              borderRadius: "var(--radius)", overflow: "hidden",
              background: cfg.active ? "rgba(255,255,255,.03)" : "transparent", transition: "all .3s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", cursor: "pointer" }}
                onClick={() => { toggle(m.id); if (!cfg.active) setExpanded(m.id); }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  border: `1.5px solid ${cfg.active ? "var(--gold)" : "var(--line-dark)"}`,
                  background: cfg.active ? "var(--gold)" : "transparent",
                  display: "grid", placeItems: "center", transition: "all .25s",
                }}>
                  {cfg.active && <span style={{ fontSize: 11, color: "var(--charcoal)", fontWeight: 800 }}>✓</span>}
                </div>
                <span style={{ fontSize: 20 }}>{m.icon}</span>
                <span style={{ flex: 1, fontSize: 15.5, fontWeight: cfg.active ? 600 : 400, color: cfg.active ? "var(--on-dark)" : "var(--on-dark-3)", transition: "all .25s" }}>
                  {m.label}
                </span>
                {cfg.active && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(isOpen ? null : m.id); }}
                    style={{ background: "none", border: "none", color: "var(--on-dark-3)", cursor: "pointer", fontSize: 13, padding: "4px 8px", fontFamily: "inherit" }}
                  >
                    {isOpen ? "Recolher ↑" : "Configurar →"}
                  </button>
                )}
              </div>

              {isOpen && (
                <div style={{ padding: "0 18px 22px", borderTop: "1px solid var(--line-dark)" }}>
                  {tones.length > 0 && (
                    <div style={{ marginTop: 18 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--on-dark-3)", marginBottom: 12 }}>
                        Clima desejado
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {tones.map((t) => {
                          const on = cfg.tone === t.label;
                          return (
                            <button key={t.label} onClick={() => setMomentProp(m.id, "tone", on ? "" : t.label)}
                              style={{
                                padding: "8px 16px", borderRadius: 100, fontSize: 13, fontWeight: 500,
                                border: `1px solid ${on ? "var(--gold)" : "var(--line-dark)"}`,
                                background: on ? "var(--gold-faint)" : "transparent",
                                color: on ? "var(--on-dark)" : "var(--on-dark-2)", cursor: "pointer", transition: "all .25s", fontFamily: "inherit",
                              }}
                            >
                              {t.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: 18 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--on-dark-3)", marginBottom: 10 }}>
                      Já tem uma música em mente? (opcional)
                    </p>
                    <input
                      type="text" value={cfg.songRequest}
                      onChange={(e) => setMomentProp(m.id, "songRequest", e.target.value)}
                      placeholder={`Ex: "A Thousand Years", "Evidências", "Canon in D"...`}
                      style={{
                        width: "100%", height: 46, padding: "0 14px", borderRadius: "var(--radius)",
                        border: "1px solid var(--line-dark)", background: "rgba(255,255,255,.04)",
                        color: "var(--on-dark)", fontSize: 14, fontFamily: "inherit", outline: "none",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--line-dark)")}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <p style={{ fontSize: 14, color: "var(--on-dark-3)" }}>
          <span style={{ color: "var(--gold)", fontWeight: 600 }}>{activeCount}</span> momentos selecionados
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onBack}
            style={{ height: 52, padding: "0 24px", borderRadius: 100, border: "1px solid var(--line-dark)", background: "transparent", color: "var(--on-dark-2)", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
            ← Voltar
          </button>
          <button onClick={handleNext} disabled={activeCount === 0 || submitting}
            style={{
              height: 52, padding: "0 32px", borderRadius: 100,
              background: activeCount > 0 ? "var(--ivory)" : "rgba(255,255,255,.1)",
              color: activeCount > 0 ? "var(--ink)" : "var(--on-dark-3)",
              fontSize: 15, fontWeight: 600, border: "none",
              cursor: activeCount > 0 && !submitting ? "pointer" : "not-allowed",
              transition: "all .35s", fontFamily: "inherit",
              display: "inline-flex", alignItems: "center", gap: 10,
            }}>
            {submitting ? (
              <>
                <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(15,17,21,.3)", borderTopColor: "var(--ink)", display: "inline-block", animation: "spin .7s linear infinite" }} />
                Consultando o curador...
              </>
            ) : "Ver sugestões de repertório →"}
          </button>
        </div>
      </div>
    </div>
  );
}
