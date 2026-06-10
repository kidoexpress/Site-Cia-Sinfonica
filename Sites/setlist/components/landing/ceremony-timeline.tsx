"use client";
import { useState } from "react";
import { useLang, UI, pick } from "./lang-context";
import { TIMELINE } from "./cs-data";
import { Reveal } from "./cs-reveal";
import { Play } from "./cs-icons";

export function CeremonyTimeline() {
  const { lang } = useLang();
  const u = UI[lang].timeline;
  const [active, setActive] = useState("bride");

  const cur = TIMELINE.find((t) => t.id === active) ?? TIMELINE[0];
  const idx = TIMELINE.findIndex((t) => t.id === active);

  return (
    <section className="section-pad timeline dark" id="timeline">
      <div className="wrap">
        <div className="tl-head">
          <Reveal><div className="eyebrow">{u.eyebrow}</div></Reveal>
          <Reveal delay={80} as="h2" className="display">{u.title}</Reveal>
          <Reveal delay={140}><p className="lead tl-lead">{u.lead}</p></Reveal>
        </div>

        <Reveal delay={120} className="tl-railwrap">
          <div className="tl-progress">
            <div className="tl-progress-fill" style={{ width: `${(idx / (TIMELINE.length - 1)) * 100}%` }} />
          </div>
          <div className="tl-rail" role="tablist" aria-label="Ceremony moments">
            {TIMELINE.map((t) => {
              const on = t.id === active;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={on}
                  className={`tl-node${on ? " on" : ""}`}
                  onClick={() => setActive(t.id)}
                >
                  <span className="tl-dot"><span className="tl-dot-i" /></span>
                  <span className="tl-node-time">{pick(t.time, lang)}</span>
                  <span className="tl-node-label">{pick(t.label, lang)}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={120} className="tl-panel" key={cur.id}>
          <div className="tl-panel-inner" key={cur.id}>
            <div className="tl-panel-l">
              <div className="tl-index">
                {String(idx + 1).padStart(2, "0")} <span>/ {String(TIMELINE.length).padStart(2, "0")}</span>
              </div>
              <h3 className="tl-panel-title">{pick(cur.label, lang)}</h3>
              <span className="tl-panel-time">{pick(cur.time, lang)}</span>
              <p className="tl-panel-desc">{pick(cur.desc, lang)}</p>
              <div className="tl-sample">
                <Play s={11} />
                <span>{pick(cur.sample, lang)}</span>
              </div>
            </div>
            <div className="tl-panel-r">
              <span className="tl-styles-label">{u.stylesLabel}</span>
              <div className="tl-styles">
                {pick(cur.styles, lang).map((s) => (
                  <span key={s} className="tl-chip">{s}</span>
                ))}
              </div>
              <div className="tl-eq" aria-hidden="true">
                {Array.from({ length: 28 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      animationDelay: `${(i % 7) * 0.12}s`,
                      height: `${18 + (Math.sin(i * 1.7) * 0.5 + 0.5) * 70}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
