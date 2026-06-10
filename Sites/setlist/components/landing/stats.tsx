"use client";
import { useLang, pick } from "./lang-context";
import { STATS } from "./cs-data";
import { Reveal } from "./cs-reveal";

export function Stats() {
  const { lang } = useLang();
  return (
    <section className="stats dark">
      <div className="wrap stats-inner">
        {STATS.map((s, i) => (
          <Reveal key={s.value} delay={i * 90} className="stat">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{pick(s.label, lang)}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
