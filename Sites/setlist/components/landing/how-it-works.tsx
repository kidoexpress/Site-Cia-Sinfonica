"use client";
import { useLang, UI, pick } from "./lang-context";
import { STEPS } from "./cs-data";
import { Reveal } from "./cs-reveal";

export function HowItWorks() {
  const { lang } = useLang();
  const u = UI[lang].how;
  return (
    <section className="section-pad how" id="how">
      <div className="wrap">
        <div className="how-head">
          <Reveal><div className="eyebrow">{u.eyebrow}</div></Reveal>
          <Reveal delay={80} as="h2" className="display">{u.title}</Reveal>
        </div>
        <div className="how-grid">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 110} className="how-card">
              <div className="how-card-top">
                <span className="how-n">{s.n}</span>
                <span className="how-meta">{pick(s.meta, lang)}</span>
              </div>
              <h3 className="how-t">{pick(s.t, lang)}</h3>
              <p className="how-d">{pick(s.d, lang)}</p>
              <div className="how-line" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
