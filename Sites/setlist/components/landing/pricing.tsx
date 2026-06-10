"use client";
import { useLang, UI, pick } from "./lang-context";
import { PACKAGES } from "./cs-data";
import { Reveal } from "./cs-reveal";
import { Check, Arrow } from "./cs-icons";

export function Pricing() {
  const { lang } = useLang();
  const u = UI[lang].packages;
  return (
    <section className="section-pad packages" id="packages">
      <div className="wrap">
        <div className="pk-head">
          <Reveal><div className="eyebrow center">{u.eyebrow}</div></Reveal>
          <Reveal delay={80} as="h2" className="display">{u.title}</Reveal>
          <Reveal delay={140}><p className="lead pk-lead">{u.lead}</p></Reveal>
        </div>
        <div className="pk-grid">
          {PACKAGES.map((p, i) => (
            <Reveal key={i} delay={i * 100} className={`pk-card${p.featured ? " pk-card--feat" : ""}`}>
              {p.featured && <span className="pk-badge">{u.mostChosen}</span>}
              <div className="pk-top">
                <h3 className="pk-name">{pick(p.name, lang)}</h3>
                <div className="pk-tier">{pick(p.price, lang)}</div>
                <p className="pk-tagline">{pick(p.tagline, lang)}</p>
              </div>
              <div className="pk-price">{pick(p.priceNote, lang)}</div>
              <a href="#contact" className={`btn ${p.featured ? "btn--on-dark" : "btn--ghost"} pk-btn`}>
                {p.featured ? u.beginPremium : u.select} <Arrow />
              </a>
              <ul className="pk-feat">
                {pick(p.feat, lang).map((f) => (
                  <li key={f}><Check s={14} /><span>{f}</span></li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
