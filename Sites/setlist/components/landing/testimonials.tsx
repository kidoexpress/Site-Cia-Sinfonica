"use client";
import { useState, useEffect, useCallback } from "react";
import { useLang, UI, pick } from "./lang-context";
import { TESTIMONIALS, TESTI_COLUMNS } from "./cs-data";
import { Reveal } from "./cs-reveal";
import { Star } from "./cs-icons";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

export function Testimonials() {
  const { lang } = useLang();
  const u = UI[lang].testi;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = TESTIMONIALS.length;
  const t = TESTIMONIALS[i];

  const go = useCallback((d: number) => setI((p) => (p + d + n) % n), [n]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((p) => (p + 1) % n), 6500);
    return () => clearInterval(id);
  }, [paused, n]);

  return (
    <section
      className="section-pad testi"
      id="testi"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="wrap">
        <div className="testi-head">
          <Reveal><div className="eyebrow">{u.eyebrow}</div></Reveal>
          <Reveal delay={80} as="h2" className="display">{u.title}</Reveal>
        </div>

        <Reveal delay={120} className="testi-stage">
          <div className="testi-quotemark" aria-hidden="true">&ldquo;</div>
          <div className="testi-main" key={i}>
            <div className="testi-stars" aria-label={`${t.rating} out of 5`}>
              {Array.from({ length: t.rating }).map((_, k) => <Star key={k} s={14} />)}
              <span className="testi-pkg">{pick(t.moment, lang)}</span>
            </div>
            <blockquote className="testi-quote">{pick(t.quote, lang)}</blockquote>
            <div className="testi-by">
              <div className="testi-avatar">{t.initials}</div>
              <div className="testi-byinfo">
                <div className="testi-name">{t.name}</div>
                <div className="testi-meta">{pick(t.meta, lang)}</div>
              </div>
            </div>
          </div>

          <div className="testi-controls">
            <div className="testi-nav">
              <button className="testi-arrow" onClick={() => go(-1)} aria-label={u.prev}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 8H4M7.5 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="testi-count">{String(i + 1).padStart(2, "0")} <i>/ {String(n).padStart(2, "0")}</i></span>
              <button className="testi-arrow" onClick={() => go(1)} aria-label={u.next}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h9M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160} className="testi-people">
          {TESTIMONIALS.map((p, k) => (
            <button key={p.name} className={`testi-person${k === i ? " on" : ""}`} onClick={() => setI(k)}>
              <span className="testi-person-av">{p.initials}</span>
              <span className="testi-person-info">
                <span className="testi-person-name">{p.name}</span>
                <span className="testi-person-meta">{pick(p.meta, lang)}</span>
              </span>
              <span className="testi-person-bar">
                <i style={{ animationPlayState: (k === i && !paused) ? "running" : "paused" }} />
              </span>
            </button>
          ))}
        </Reveal>

        <TestimonialsColumnsBlock />
      </div>
    </section>
  );
}

function TestimonialsColumnsBlock() {
  const { lang } = useLang();
  const cols = TESTI_COLUMNS.map((t) => ({
    text: pick(t.text, lang),
    name: t.name,
    role: pick(t.role, lang),
    initials: t.initials,
  }));
  const firstColumn = cols.slice(0, 3);
  const secondColumn = cols.slice(3, 6);
  const thirdColumn = cols.slice(6, 9);

  return (
    <Reveal delay={120} style={{ marginTop: "clamp(56px, 7vw, 96px)" }}>
      <div className="testi-cols-grid">
        <TestimonialsColumn testimonials={firstColumn} duration={15} />
        <TestimonialsColumn testimonials={secondColumn} className="testi-cols-col-2" duration={19} />
        <TestimonialsColumn testimonials={thirdColumn} className="testi-cols-col-3" duration={17} />
      </div>
    </Reveal>
  );
}
