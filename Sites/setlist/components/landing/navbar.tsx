"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Music2 } from "lucide-react";

const links = [
  { href: "/servicos", label: "Serviços" },
  { href: "/portfolio", label: "Portfólio" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-xl font-serif text-white tracking-wide"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Setlist
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-white/70 hover:text-white transition-colors tracking-wide"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/app"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/diagnostico"
              className="text-sm px-4 py-2 rounded-full gradient-gold text-white font-medium hover:opacity-90 transition-opacity"
            >
              Começar agora
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white/80 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#1A1A1A] border-t border-white/10 px-4 pb-6 pt-4 space-y-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-white/70 hover:text-white transition-colors py-1"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/diagnostico"
            className="block mt-4 text-center px-4 py-3 rounded-full gradient-gold text-white font-medium"
            onClick={() => setOpen(false)}
          >
            Começar agora — é gratuito
          </Link>
        </div>
      )}
    </header>
  );
}
