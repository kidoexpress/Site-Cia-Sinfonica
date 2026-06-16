"use client";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft } from "lucide-react";

interface StudioNavProps {
  phase: 1 | 2 | 3;
}

const LABELS = ["Perfil do casal", "Momentos do evento", "Seu repertório"];

export function StudioNav({ phase }: StudioNavProps) {
  const progress = ((phase - 1) / 2) * 100;

  return (
    <header
      style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 100,
        background: "rgba(15,17,21,.85)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--line-dark)",
      }}
    >
      <div
        style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)",
          height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
        }}
      >
        <a
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--on-dark-3)", fontSize: 13, fontWeight: 500, transition: "color .3s", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--on-dark)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--on-dark-3)")}
        >
          <ArrowLeft size={15} /> Voltar
        </a>

        <Logo variant="light" width={46} />

        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--on-dark-3)" }}>
          <span style={{ color: "var(--gold)", fontWeight: 600 }}>{phase}</span>
          <span>/</span>
          <span>3</span>
          <span style={{ marginLeft: 8, color: "var(--on-dark-2)", fontWeight: 500 }} className="studio-nav-label">
            {LABELS[phase - 1]}
          </span>
        </div>
      </div>

      <div style={{ height: 2, background: "var(--line-dark)" }}>
        <div
          style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg, var(--gold), var(--gold-soft))",
            transition: "width .7s cubic-bezier(.16,1,.3,1)",
          }}
        />
      </div>
    </header>
  );
}
