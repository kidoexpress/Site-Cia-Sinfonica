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
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const historyLabel = lang === "pt" ? "História" : "Story";
  const links: [string, string][] = [
    [u.experience, "#experience"],
    [u.how, "#how"],
    [u.journey, "#timeline"],
    [u.ensemble, "#ensemble"],
    [u.packages, "#packages"],
    [historyLabel, "/historia"],
  ];

  return (
    <header className={`nav${scrolled ? " nav--solid" : ""}`}>
      <div className="nav-inner wrap">
        <Wordmark dark={!scrolled} />
        <nav className="nav-links" aria-label="Navegação principal">
          {links.map(([t, h]) => {
            const id = h.startsWith("#") ? h.slice(1) : "";
            const isActive = id !== "" && active === id;
            return (
              <a key={h} href={h} style={isActive ? { color: "var(--gold)" } : undefined}>{t}</a>
            );
          })}
        </nav>
        <div className="nav-right">
          <LangToggle solid={scrolled} />
          <a href="/studio" className="nav-cta">{u.cta} <Arrow s={14} /></a>
        </div>
      </div>
    </header>
  );
}
