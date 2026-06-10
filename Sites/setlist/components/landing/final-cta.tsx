"use client";
import { useLang, UI } from "./lang-context";
import { Reveal } from "./cs-reveal";
import { Arrow } from "./cs-icons";

export function FinalCTA() {
  const { lang } = useLang();
  const u = UI[lang].finalcta;
  return (
    <section className="finalcta dark" id="contact">
      <div className="finalcta-grain" />
      <div className="wrap finalcta-inner">
        <Reveal><div className="eyebrow center">{u.eyebrow}</div></Reveal>
        <Reveal delay={90} as="h2" className="finalcta-title">{u.title[0]}<br />{u.title[1]}</Reveal>
        <Reveal delay={170}><p className="lead finalcta-lead">{u.lead}</p></Reveal>
        <Reveal delay={240} className="finalcta-actions">
          <a href="#" className="btn btn--on-dark">{u.cta1} <Arrow /></a>
          <a href="#" className="btn btn--on-dark-ghost">{u.cta2}</a>
        </Reveal>
      </div>
    </section>
  );
}
