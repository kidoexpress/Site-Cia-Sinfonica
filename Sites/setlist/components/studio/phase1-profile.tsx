"use client";
import { useState } from "react";
import { Phase1Data, VENUE_TYPES, TONES, GENRES } from "./types";
import { FieldGroup, StudioInput, StudioSelect, PhaseHeader } from "./fields";

export function Phase1Profile({ onNext }: { onNext: (data: Phase1Data) => void }) {
  const [data, setData] = useState<Phase1Data>({
    name1: "", name2: "", eventDate: "", venueName: "", venueType: "",
    guestCount: "", ageRange: "", eventTone: "",
    genreWeights: Object.fromEntries(GENRES.map((g) => [g.id, 0])),
    languagePref: [], blacklist: "",
  });

  const set = (key: keyof Phase1Data, val: unknown) => setData((prev) => ({ ...prev, [key]: val }));
  const setGenre = (id: string, val: number) =>
    setData((prev) => ({ ...prev, genreWeights: { ...prev.genreWeights, [id]: val } }));

  const canProceed = data.name1 && data.name2 && data.venueType && data.eventTone;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "120px clamp(20px, 4vw, 60px) 80px" }}>
      <PhaseHeader
        phase={1}
        title="Conte sobre vocês."
        lead="Quanto mais soubermos sobre o casal e o evento, mais preciso será o repertório que montaremos."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <FieldGroup label="O casal">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <StudioInput label="Nome 1" value={data.name1} onChange={(v) => set("name1", v)} placeholder="Helena" />
            <StudioInput label="Nome 2" value={data.name2} onChange={(v) => set("name2", v)} placeholder="Marcos" />
          </div>
        </FieldGroup>

        <FieldGroup label="O evento">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <StudioInput label="Data" value={data.eventDate} onChange={(v) => set("eventDate", v)} type="date" />
            <StudioInput label="Nome do espaço" value={data.venueName} onChange={(v) => set("venueName", v)} placeholder="Grand Hyatt São Paulo" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
            <StudioSelect
              label="Número de convidados" value={data.guestCount} onChange={(v) => set("guestCount", v)}
              options={[
                { value: "intimate", label: "Até 30 pessoas" },
                { value: "small", label: "31 a 80 pessoas" },
                { value: "medium", label: "81 a 200 pessoas" },
                { value: "large", label: "Mais de 200 pessoas" },
              ]}
            />
            <StudioSelect
              label="Faixa etária dos noivos" value={data.ageRange} onChange={(v) => set("ageRange", v)}
              options={[
                { value: "18_25", label: "18 a 25 anos" },
                { value: "26_35", label: "26 a 35 anos" },
                { value: "36_45", label: "36 a 45 anos" },
                { value: "46_60", label: "46 a 60 anos" },
              ]}
            />
          </div>
        </FieldGroup>

        <FieldGroup label="Tipo de local da cerimônia">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
            {VENUE_TYPES.map((v) => {
              const on = data.venueType === v.value;
              return (
                <button key={v.value} onClick={() => set("venueType", v.value)}
                  style={{
                    padding: "16px 14px", borderRadius: "var(--radius)",
                    border: `1px solid ${on ? "var(--gold)" : "var(--line-dark)"}`,
                    background: on ? "var(--gold-faint)" : "rgba(255,255,255,.03)",
                    color: on ? "var(--on-dark)" : "var(--on-dark-2)",
                    cursor: "pointer", textAlign: "left", transition: "all .25s",
                    display: "flex", flexDirection: "column", gap: 8, fontFamily: "inherit",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{v.icon}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.3 }}>{v.label}</span>
                </button>
              );
            })}
          </div>
        </FieldGroup>

        <FieldGroup label="Como você imagina a trilha sonora?">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {TONES.map((t) => {
              const on = data.eventTone === t.value;
              return (
                <button key={t.value} onClick={() => set("eventTone", t.value)}
                  style={{
                    padding: "18px 20px", borderRadius: "var(--radius)",
                    border: `1px solid ${on ? "var(--gold)" : "var(--line-dark)"}`,
                    background: on ? "var(--gold-faint)" : "rgba(255,255,255,.03)",
                    cursor: "pointer", textAlign: "left", transition: "all .25s",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, fontFamily: "inherit",
                  }}
                >
                  <div>
                    <p style={{ fontSize: 15.5, fontWeight: 600, color: "var(--on-dark)", letterSpacing: "-0.01em" }}>{t.label}</p>
                    <p style={{ fontSize: 13.5, color: "var(--on-dark-3)", marginTop: 4 }}>{t.sub}</p>
                  </div>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    border: `1.5px solid ${on ? "var(--gold)" : "var(--line-dark)"}`,
                    background: on ? "var(--gold)" : "transparent", flexShrink: 0, transition: "all .25s",
                  }} />
                </button>
              );
            })}
          </div>
        </FieldGroup>

        <FieldGroup label="Quanto você curte cada estilo?" sub="0 = não quero · 5 = essencial">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {GENRES.map((g) => (
              <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 14, color: "var(--on-dark-2)", minWidth: 170 }}>{g.label}</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="range" min={0} max={5} step={1} value={data.genreWeights[g.id]}
                    onChange={(e) => setGenre(g.id, Number(e.target.value))}
                    style={{ flex: 1, accentColor: "var(--gold)", cursor: "pointer" }}
                  />
                  <span style={{ width: 28, textAlign: "center", fontSize: 14, fontWeight: 600, color: data.genreWeights[g.id] > 0 ? "var(--gold)" : "var(--on-dark-3)" }}>
                    {data.genreWeights[g.id]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </FieldGroup>

        <FieldGroup label="Preferência de idioma">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { value: "portuguese", label: "Português" },
              { value: "english", label: "Inglês" },
              { value: "spanish", label: "Espanhol" },
              { value: "instrumental", label: "Instrumental (sem letra)" },
              { value: "any", label: "Sem preferência" },
            ].map((l) => {
              const on = data.languagePref.includes(l.value);
              return (
                <button key={l.value}
                  onClick={() => set("languagePref", on ? data.languagePref.filter((x) => x !== l.value) : [...data.languagePref, l.value])}
                  style={{
                    padding: "10px 18px", borderRadius: 100, fontSize: 13.5, fontWeight: 500,
                    border: `1px solid ${on ? "var(--gold)" : "var(--line-dark)"}`,
                    background: on ? "var(--gold-faint)" : "transparent",
                    color: on ? "var(--on-dark)" : "var(--on-dark-2)", cursor: "pointer", transition: "all .25s", fontFamily: "inherit",
                  }}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </FieldGroup>

        <FieldGroup label="Tem alguma música que definitivamente NÃO pode tocar?" sub="Opcional — separe por vírgula">
          <textarea
            value={data.blacklist} onChange={(e) => set("blacklist", e.target.value)}
            placeholder="Ex: Evidências, My Heart Will Go On, Ai Se Eu Te Pego..."
            rows={3}
            style={{
              width: "100%", padding: "14px 18px", borderRadius: "var(--radius)",
              border: "1px solid var(--line-dark)", background: "rgba(255,255,255,.04)",
              color: "var(--on-dark)", fontSize: 14.5, resize: "vertical", fontFamily: "inherit",
              outline: "none", transition: "border-color .3s", lineHeight: 1.6,
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--line-dark)")}
          />
        </FieldGroup>

        <button
          onClick={() => canProceed && onNext(data)}
          disabled={!canProceed}
          style={{
            alignSelf: "flex-start", height: 54, padding: "0 32px", borderRadius: 100,
            background: canProceed ? "var(--ivory)" : "rgba(255,255,255,.1)",
            color: canProceed ? "var(--ink)" : "var(--on-dark-3)",
            fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", border: "none",
            cursor: canProceed ? "pointer" : "not-allowed", transition: "all .35s", fontFamily: "inherit",
          }}
        >
          Próximo → Momentos do evento
        </button>
      </div>
    </div>
  );
}
