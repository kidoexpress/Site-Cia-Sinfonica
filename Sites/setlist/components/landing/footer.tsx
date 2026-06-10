"use client";
import { useLang, UI } from "./lang-context";
import { Mark } from "./cs-icons";

function Wordmark() {
  return (
    <a href="#top" className="brand" aria-label="Cia. Sinfônica">
      <Mark s={30} color="var(--on-dark)" />
      <span className="brand-text" style={{ color: "var(--on-dark)" }}>
        <strong>Cia. Sinfônica</strong>
        <em>Produção Musical</em>
      </span>
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
