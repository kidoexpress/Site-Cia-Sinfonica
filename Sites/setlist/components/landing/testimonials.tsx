"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Fernanda & André",
    event: "Casamento · São Paulo",
    initials: "FA",
    color: "#C9A96E",
    rating: 5,
    quote:
      "Chorei quando ouvi o repertório pela primeira vez. Cada música era perfeita para o momento — era como se o curador nos conhecesse de verdade. A cerimônia ficou exatamente como sonhamos.",
  },
  {
    name: "Camila Rodrigues",
    event: "Festa de 30 anos · Rio de Janeiro",
    initials: "CR",
    color: "#A8854F",
    rating: 5,
    quote:
      "Nunca imaginei que montar um playlist poderia ser tão especial. O processo foi incrível: as perguntas me fizeram pensar em memórias que eu tinha esquecido. A festa foi um sucesso total.",
  },
  {
    name: "Lucas & Beatriz",
    event: "Casamento · Belo Horizonte",
    initials: "LB",
    color: "#977650",
    rating: 5,
    quote:
      "Contratamos o plano Plus e foi o melhor investimento do casamento. O curador sugeriu músicas que nem estavam na nossa lista mas ficaram perfeitas. Até hoje os convidados perguntam sobre a playlist.",
  },
  {
    name: "Marina Alves",
    event: "Formatura de Medicina · Curitiba",
    initials: "MA",
    color: "#B8906A",
    rating: 5,
    quote:
      "Seis anos de faculdade mereciam uma festa à altura. O repertório capturou exatamente o espírito da nossa turma — desde a cerimônia solene até a festa que durou até de manhã.",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="py-24 lg:py-32" style={{ background: "#FAF7F2" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-medium">
            Depoimentos
          </span>
          <h2
            className="mt-3 text-4xl lg:text-5xl text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Quem confiou, se emocionou
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-10 lg:p-14 shadow-sm border border-[#F5E6D3] text-center">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-8">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#C9A96E] text-[#C9A96E]" />
              ))}
            </div>

            {/* Quote */}
            <blockquote
              className="text-xl lg:text-2xl text-[#1A1A1A] leading-relaxed mb-8 text-balance"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            {/* Avatar + name */}
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: t.color }}
              >
                {t.initials}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#1A1A1A]">{t.name}</p>
                <p className="text-xs text-[#8A7F72]">{t.event}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-[#F5E6D3] bg-white flex items-center justify-center hover:border-[#C9A96E] transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4 text-[#8A7F72]" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-6 bg-[#C9A96E]" : "w-2 bg-[#F5E6D3]"
                  }`}
                  aria-label={`Depoimento ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-[#F5E6D3] bg-white flex items-center justify-center hover:border-[#C9A96E] transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight className="w-4 h-4 text-[#8A7F72]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
