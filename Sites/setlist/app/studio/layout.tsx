import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estúdio de Curadoria | Cia. Sinfônica",
  description: "Monte o repertório do seu casamento com base no seu perfil musical.",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cs-root" style={{ minHeight: "100svh", background: "var(--charcoal)", color: "var(--on-dark)" }}>
      {children}
    </div>
  );
}
