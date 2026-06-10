"use client";
import { useLang, UI, pick } from "./lang-context";
import { PROBLEM_POINTS } from "./cs-data";
import { Reveal } from "./cs-reveal";

export function Problem() {
  const { lang } = useLang();
  const u = UI[lang].problem;
  return (
    <section className="section-pad" id="experience">
      <div className="wrap">
        <div className="prob-head">
          <Reveal><div className="eyebrow">{u.eyebrow}</div></Reveal>
          <Reveal delay={80} as="h2" className="display prob-title">{u.title}</Reveal>
          <Reveal delay={140}><p className="lead prob-lead">{u.lead}</p></Reveal>
        </div>
        <div className="prob-grid">
          {PROBLEM_POINTS.map((p, i) => (
            <Reveal key={p.k} delay={i * 80} className="prob-card">
              <span className="prob-k">{p.k}</span>
              <h3 className="prob-card-t">{pick(p.t, lang)}</h3>
              <p className="prob-card-d">{pick(p.d, lang)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
