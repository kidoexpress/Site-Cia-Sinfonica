"use client";
import Image from "next/image";
import { useLang, UI } from "./lang-context";
import { Reveal } from "./cs-reveal";

export function Ensemble() {
  const { lang } = useLang();
  const u = UI[lang].ensemble;
  return (
    <section className="section-pad ensemble" id="ensemble">
      <div className="wrap">
        <div className="ens-head">
          <Reveal><div className="eyebrow">{u.eyebrow}</div></Reveal>
          <Reveal delay={80} as="h2" className="display">{u.title}</Reveal>
          <Reveal delay={140}><p className="lead ens-lead">{u.lead}</p></Reveal>
        </div>
        <div className="ens-grid">
          <Reveal className="ens-fig ens-fig--lg" as="figure">
            <Image src="/stage.webp" alt="Cia. Sinfônica — apresentação ao vivo" fill sizes="(max-width:1080px) 100vw, 57vw" loading="lazy" style={{ objectFit: "cover" }} />
            <figcaption>{u.stageCap}</figcaption>
          </Reveal>
          <Reveal delay={120} className="ens-fig" as="figure">
            <Image src="/team.webp" alt="Time da Cia. Sinfônica" fill sizes="(max-width:1080px) 100vw, 43vw" loading="lazy" style={{ objectFit: "cover" }} />
            <figcaption>{u.teamCap}</figcaption>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
