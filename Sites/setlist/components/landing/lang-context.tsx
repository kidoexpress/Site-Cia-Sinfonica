"use client";
import { createContext, useContext, useState, useEffect } from "react";

type Lang = "pt" | "en";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export const LangContext = createContext<LangContextType>({ lang: "pt", setLang: () => {} });
export function useLang() { return useContext(LangContext); }

export function pick<T>(field: { pt: T; en: T } | T | null | undefined, lang: Lang): T {
  if (field == null) return "" as T;
  if (typeof field !== "object" || Array.isArray(field)) return field as T;
  const f = field as { pt: T; en: T };
  return f[lang] ?? f.pt ?? f.en;
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cs_lang") as Lang | null;
      if (stored === "en" || stored === "pt") setLangState(stored);
    } catch {}
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try { localStorage.setItem("cs_lang", l); } catch {}
    document.documentElement.lang = l === "pt" ? "pt-BR" : "en";
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const UI = {
  pt: {
    nav: { experience: "Experiência", how: "Como funciona", journey: "A jornada", ensemble: "A orquestra", atelier: "Ateliê", packages: "Pacotes", cta: "Iniciar consultoria" },
    hero: {
      eyebrow: "Consultoria musical para casamentos de alto padrão",
      title: ["Cada momento inesquecível", "merece a trilha sonora certa."] as [string, string],
      sub: "Ajudamos casais a desenhar a experiência musical do seu casamento — composta, curada e executada ao vivo, com precisão absoluta.",
      cta1: "Criar minha experiência musical", cta2: "Ver como funciona",
      foot: "Orquestras ao vivo · Arranjos exclusivos · Brasil e exterior", scroll: "Rolar",
    },
    problem: {
      eyebrow: "O desafio",
      title: "Escolher a música é a parte mais difícil de acertar no grande dia.",
      lead: "Um casamento é uma sequência de momentos insubstituíveis. Cada um carrega a própria emoção, o próprio tempo, o próprio público. Transformamos essa escolha avassaladora em um único programa, pensado nos mínimos detalhes.",
    },
    how: { eyebrow: "Como funciona", title: "Três passos para uma trilha sonora que parece inevitável." },
    timeline: {
      eyebrow: "A jornada da cerimônia", title: "Uma jornada horizontal pelo seu grande dia.",
      lead: "Selecione qualquer momento para revelar a direção musical que comporíamos para ele.",
      stylesLabel: "Estilos musicais recomendados",
    },
    perso: {
      eyebrow: "Motor de personalização", title: "O seu gosto, traduzido em um programa.",
      lead: "Cada casal recebe um estúdio privativo. Defina o seu registro emocional, escolha a instrumentação e veja as recomendações se reajustarem em tempo real — como um bom produto que antecipa exatamente o que você quer dizer.",
      points: ["Preferências musicais", "Perfil emocional", "Nível de formalidade", "Instrumentação", "Músicas recomendadas"],
      live: "Ao vivo", ready: "Programa 92% pronto",
      tabs: ["Preferências", "Perfil emocional", "Repertório"],
      formality: "Nível de formalidade", relaxed: "Descontraído", refined: "Refinado", blacktie: "Black tie",
      instrumentation: "Instrumentação", match: "compatível",
    },
    atelier: { eyebrow: "O ateliê", title: "Onde a música nasce.",
      lead: "Nossa casa de produção é parte estúdio, parte sala de ensaio — o espaço onde o seu programa é arranjado, refinado e ensaiado antes da chegada do primeiro convidado." },
    ensemble: { eyebrow: "A orquestra", title: "As pessoas por trás de cada nota.",
      lead: "Mais de 25 anos reunindo músicos, arranjadores e produtores sob o mesmo teto. Uma orquestra residente que ensaia, grava e se apresenta como uma só voz.",
      stageCap: "Apresentação ao vivo · orquestra completa à luz de velas",
      teamCap: "O time Cia. Sinfônica — 25 anos de produção musical" },
    packages: { eyebrow: "Pacotes de serviço", title: "Três formas de trabalhar com a gente.",
      lead: "Toda parceria começa com uma consultoria. A partir daí, escolha a profundidade de produção que o seu dia merece.",
      mostChosen: "Mais escolhido", beginPremium: "Começar pelo Premium", select: "Selecionar" },
    testi: { eyebrow: "Nas palavras deles", title: "Casais lembram como se sentiram.", prev: "Anterior", next: "Próximo" },
    finalcta: { eyebrow: "Comece", title: ["A trilha sonora", "vira a memória."] as [string, string],
      lead: "Conte-nos sobre o seu dia. Vamos desenhar a experiência musical que ninguém na sala vai esquecer.",
      cta1: "Iniciar minha consultoria", cta2: "Solicitar o portfólio" },
    footer: {
      tag: "Desenhando a experiência musical por trás de casamentos inesquecíveis — composta, curada e executada ao vivo.",
      cols: [
        ["Experiência", ["O desafio", "Como funciona", "A jornada", "Personalização"]],
        ["Empresa", ["O ateliê", "Nossa orquestra", "Imprensa", "Carreiras"]],
        ["Contato", ["Instagram", "Vimeo", "Fale conosco", "WhatsApp"]],
      ] as [string, string[]][],
      privacy: "Privacidade", terms: "Termos",
    },
  },
  en: {
    nav: { experience: "Experience", how: "How it works", journey: "The journey", ensemble: "The ensemble", atelier: "Atelier", packages: "Packages", cta: "Start a consultation" },
    hero: {
      eyebrow: "Luxury wedding music consultancy",
      title: ["Every unforgettable moment", "deserves the right soundtrack."] as [string, string],
      sub: "We help couples design the musical experience behind their wedding — composed, curated and performed live with absolute precision.",
      cta1: "Create my musical experience", cta2: "See how it works",
      foot: "Live ensembles · Bespoke arrangements · Brazil & abroad", scroll: "Scroll",
    },
    problem: {
      eyebrow: "The challenge",
      title: "Choosing the music is the hardest part of the day to get right.",
      lead: "A wedding is a sequence of irreplaceable moments. Each one carries its own emotion, its own timing, its own audience. We turn that overwhelming choice into a single, considered programme.",
    },
    how: { eyebrow: "How it works", title: "Three steps to a soundtrack that feels inevitable." },
    timeline: {
      eyebrow: "The ceremony journey", title: "A horizontal journey through your day.",
      lead: "Select any moment to reveal the musical direction we'd compose for it.",
      stylesLabel: "Recommended musical styles",
    },
    perso: {
      eyebrow: "Personalization engine", title: "Your taste, translated into a programme.",
      lead: "Every couple receives a private studio. Set your emotional register, choose your instrumentation, and watch recommendations re-tune in real time — the way a great product anticipates exactly what you mean.",
      points: ["Musical preferences", "Emotional profile", "Formality level", "Instrumentation", "Recommended songs"],
      live: "Live", ready: "Programme 92% ready",
      tabs: ["Preferences", "Emotional profile", "Repertoire"],
      formality: "Formality level", relaxed: "Relaxed", refined: "Refined", blacktie: "Black tie",
      instrumentation: "Instrumentation", match: "match",
    },
    atelier: { eyebrow: "The atelier", title: "Where the music is made.",
      lead: "Our production house is part studio, part rehearsal hall — the room where your programme is arranged, refined and rehearsed before a single guest arrives." },
    ensemble: { eyebrow: "The ensemble", title: "The people behind every note.",
      lead: "More than 25 years bringing musicians, arrangers and producers together under one roof. A resident ensemble that rehearses, records and performs as a single voice.",
      stageCap: "Live performance · full ensemble by candlelight",
      teamCap: "The Cia. Sinfônica team — 25 years of music production" },
    packages: { eyebrow: "Service packages", title: "Three ways to work with us.",
      lead: "Every engagement begins with a consultation. From there, choose the depth of production your day deserves.",
      mostChosen: "Most chosen", beginPremium: "Begin with Premium", select: "Select" },
    testi: { eyebrow: "In their words", title: "Couples remember how it felt.", prev: "Previous", next: "Next" },
    finalcta: { eyebrow: "Begin", title: ["The soundtrack", "becomes the memory."] as [string, string],
      lead: "Tell us about your day. We'll design the musical experience that no one in the room will forget.",
      cta1: "Start your consultation", cta2: "Request the brochure" },
    footer: {
      tag: "Designing the musical experience behind unforgettable weddings — composed, curated and performed live.",
      cols: [
        ["Experience", ["The challenge", "How it works", "The journey", "Personalization"]],
        ["Company", ["The atelier", "Our ensemble", "Press", "Careers"]],
        ["Connect", ["Instagram", "Vimeo", "Contact", "WhatsApp"]],
      ] as [string, string[]][],
      privacy: "Privacy", terms: "Terms",
    },
  },
};

export function LangToggle({ solid }: { solid?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`langtoggle${solid ? " langtoggle--solid" : ""}`} role="group" aria-label="Idioma / Language">
      <button className={lang === "pt" ? "on" : ""} onClick={() => setLang("pt")} aria-pressed={lang === "pt"}>PT</button>
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
    </div>
  );
}
