"use client";
import { useLang, UI } from "./lang-context";
import { Logo } from "@/components/ui/logo";

function Wordmark() {
  return (
    <a href="#top" className="brand" aria-label="Cia. Sinfônica — Produção Musical">
      <Logo variant="light" width={96} />
    </a>
  );
}

const HREF_MAP: Record<string, string> = {
  "O desafio": "/#experience", "The challenge": "/#experience",
  "Como funciona": "/#how", "How it works": "/#how",
  "A jornada": "/#timeline", "The journey": "/#timeline",
  "Personalização": "/#engine", "Personalization": "/#engine",
  "O ateliê": "/#atelier", "The atelier": "/#atelier",
  "Nossa orquestra": "/#ensemble", "Our ensemble": "/#ensemble",
};

export function Footer() {
  const { lang } = useLang();
  const u = UI[lang].footer;
  const services = lang === "pt"
    ? [["Estúdio de Curadoria", "/studio"], ["Nossa história", "/historia"], ["Pacotes", "/#packages"]]
    : [["Curation Studio", "/studio"], ["Our story", "/historia"], ["Packages", "/#packages"]];

  return (
    <footer className="footer dark">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Wordmark />
            <p className="footer-tag">{u.tag}</p>
            <nav style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 20 }} aria-label={lang === "pt" ? "Serviços" : "Services"}>
              {services.map(([label, href]) => (
                <a key={href} href={href} style={{ fontSize: 13.5, color: "var(--gold-soft)" }}>{label}</a>
              ))}
            </nav>
          </div>
          <div className="footer-cols">
            {u.cols.map(([h, items]) => (
              <div key={h} className="footer-col">
                <h4>{h}</h4>
                {items.map((it) => <a key={it} href={HREF_MAP[it] ?? "#"}>{it}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Cia. Sinfônica · Produção Musical</span>
          <span className="footer-legal">
            <a href="#">{u.privacy}</a>
            <a href="#">{u.terms}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
