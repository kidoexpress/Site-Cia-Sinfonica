"use client";
import Image from "next/image";
import { useLang, UI } from "./lang-context";
import { Arrow, Play } from "./cs-icons";

export function Hero() {
  const { lang } = useLang();
  const u = UI[lang].hero;

  return (
    <section className="hero" id="top">
      <div className="hero-media">
        <Image
          src="/hero-facade.png"
          alt="Fachada da Cia. Sinfônica — Produção Musical"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 38%" }}
        />
        <div className="hero-scrim" />
        <div className="hero-grain" />
      </div>

      <div className="hero-content wrap">
        <div className="hero-eyebrow">{u.eyebrow}</div>
        <h1 className="hero-title">
          {u.title[0]}<br />{u.title[1]}
        </h1>
        <p className="hero-sub">{u.sub}</p>
        <div className="hero-actions">
          <a href="/studio" className="btn btn--on-dark">{u.cta1} <Arrow /></a>
          <a href="#how" className="btn btn--on-dark-ghost"><Play /> {u.cta2}</a>
        </div>
      </div>

      <div className="hero-foot wrap">
        <span className="hero-foot-note">{u.foot}</span>
        <a href="#experience" className="scroll-cue" aria-label={u.scroll}>
          <span>{u.scroll}</span>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
            <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1"/>
            <circle className="cue-dot" cx="7" cy="6.5" r="1.6" fill="currentColor"/>
          </svg>
        </a>
      </div>
    </section>
  );
}
