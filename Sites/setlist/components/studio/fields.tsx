"use client";
import { ReactNode } from "react";

export function FieldGroup({ label, sub, children }: { label: string; sub?: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--on-dark-3)" }}>{label}</p>
        {sub && <p style={{ fontSize: 12.5, color: "var(--on-dark-3)", marginTop: 4 }}>{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function StudioInput({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--on-dark-3)" }}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 50, padding: "0 16px", borderRadius: "var(--radius)",
          border: "1px solid var(--line-dark)", background: "rgba(255,255,255,.04)",
          color: "var(--on-dark)", fontSize: 14.5, fontFamily: "inherit", outline: "none",
          transition: "border-color .3s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--line-dark)")}
      />
    </div>
  );
}

export function StudioSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--on-dark-3)" }}>{label}</label>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        style={{
          height: 50, padding: "0 16px", borderRadius: "var(--radius)",
          border: "1px solid var(--line-dark)", background: "rgba(255,255,255,.04)",
          color: value ? "var(--on-dark)" : "var(--on-dark-3)",
          fontSize: 14.5, fontFamily: "inherit", outline: "none", cursor: "pointer", appearance: "none",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--line-dark)")}
      >
        <option value="">Selecione...</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function PhaseHeader({ phase, title, lead }: { phase: number; title: string; lead: string }) {
  return (
    <div style={{ marginBottom: 52 }}>
      <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 22, height: 1, background: "var(--gold)", display: "inline-block" }} />
        {phase ? `Fase ${phase}` : "Sugestões personalizadas"}
      </span>
      <h1 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 16, color: "#fff" }}>
        {title}
      </h1>
      <p style={{ marginTop: 18, fontSize: 16.5, lineHeight: 1.65, color: "var(--on-dark-2)", maxWidth: "50ch" }}>{lead}</p>
    </div>
  );
}
