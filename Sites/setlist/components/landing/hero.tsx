import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden">
      {/* Decorative orbs */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "#C9A96E" }}
      />
      <div
        className="absolute bottom-1/3 left-1/5 w-64 h-64 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: "#A8854F" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-pulse" />
            <span className="text-xs text-white/80 tracking-widest uppercase">
              Curadoria Musical Personalizada
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1] text-balance mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Seu casamento merece uma trilha sonora{" "}
            <em className="not-italic" style={{ color: "#C9A96E" }}>
              tão única quanto vocês.
            </em>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/65 leading-relaxed mb-10 max-w-xl">
            Curadoria musical artesanal para casamentos, aniversários e
            celebrações. Cada música escolhida com intenção, cada momento
            da sua festa com a emoção certa.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/diagnostico"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-full gradient-gold text-white font-medium text-base hover:opacity-90 transition-all hover:gap-3"
            >
              Quero meu repertório
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/25 text-white/80 hover:text-white hover:border-white/50 transition-all text-base"
            >
              <Play className="w-4 h-4 fill-current" />
              Ver como funciona
            </Link>
          </div>

          {/* Social proof strip */}
          <div className="mt-14 flex items-center gap-6 flex-wrap">
            <div className="flex -space-x-3">
              {["F", "A", "C", "M", "L"].map((initial, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center text-xs font-semibold text-white"
                  style={{
                    background: `hsl(${30 + i * 15}, 40%, ${40 + i * 5}%)`,
                  }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-sm font-medium">+240 casais felizes</p>
              <p className="text-white/50 text-xs">com nota média 4.9 / 5</p>
            </div>
            <div className="h-8 w-px bg-white/15 hidden sm:block" />
            <div className="hidden sm:block">
              <p className="text-white/50 text-xs uppercase tracking-widest">Desde 2020</p>
              <p className="text-white text-sm font-medium">São Paulo & Brasil</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[var(--brand-cream,#FAF7F2)] to-transparent" />
    </section>
  );
}
