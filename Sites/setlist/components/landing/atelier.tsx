"use client";
import Image from "next/image";
import { useLang, UI } from "./lang-context";
import { Reveal } from "./cs-reveal";

export function Atelier() {
  const { lang } = useLang();
  const u = UI[lang].atelier;
  const facts = lang === "pt"
    ? [["São Paulo", "Casa de produção"], ["30+", "Músicos residentes"], ["Interno", "Arranjo e composição"]]
    : [["São Paulo", "Production house"], ["30+", "Resident musicians"], ["In-house", "Arrangement & scoring"]];

  return (
    <section className="atelier dark" id="atelier">
      <div className="atelier-media">
        <Image src="/facade.webp" alt="O ateliê da Cia. Sinfônica — estúdio de produção e sala de ensaio" fill style={{ objectFit: "cover", objectPosition: "center 60%" }} />
        <div className="atelier-scrim" />
      </div>
      <div className="wrap atelier-content">
        <Reveal className="atelier-card">
          <div className="eyebrow">{u.eyebrow}</div>
          <h2 className="display">{u.title}</h2>
          <p className="lead">{u.lead}</p>
          <div className="atelier-facts">
            {facts.map(([b, s]) => (
              <div key={s}><b>{b}</b><span>{s}</span></div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
