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

export function Footer() {
  const { lang } = useLang();
  const u = UI[lang].footer;
  return (
    <footer className="footer dark">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Wordmark />
            <p className="footer-tag">{u.tag}</p>
          </div>
          <div className="footer-cols">
            {u.cols.map(([h, items]) => (
              <div key={h} className="footer-col">
                <h4>{h}</h4>
                {items.map((it) => <a key={it} href="#">{it}</a>)}
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
