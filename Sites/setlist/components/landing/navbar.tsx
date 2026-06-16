"use client";
import { useState, useEffect } from "react";
import { useLang, UI, LangToggle } from "./lang-context";
import { Arrow } from "./cs-icons";
import { Logo } from "@/components/ui/logo";

function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#top" className="brand" aria-label="Cia. Sinfônica — Produção Musical">
      <Logo variant={dark ? "light" : "dark"} width={58} priority />
    </a>
  );
}

export function Navbar() {
  const { lang } = useLang();
  const u = UI[lang].nav;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: [string, string][] = [
    [u.experience, "#experience"],
    [u.how, "#how"],
    [u.journey, "#timeline"],
    [u.ensemble, "#ensemble"],
    [u.atelier, "#atelier"],
    [u.packages, "#packages"],
  ];

  return (
    <header className={`nav${scrolled ? " nav--solid" : ""}`}>
      <div className="nav-inner wrap">
        <Wordmark dark={!scrolled} />
        <nav className="nav-links">
          {links.map(([t, h]) => <a key={h} href={h}>{t}</a>)}
        </nav>
        <div className="nav-right">
          <LangToggle solid={scrolled} />
          <a href="/studio" className="nav-cta">{u.cta} <Arrow s={14} /></a>
        </div>
      </div>
    </header>
  );
}
