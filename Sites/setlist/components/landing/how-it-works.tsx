import { ClipboardList, Music2, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Você preenche seu perfil musical",
    description:
      "Em menos de 10 minutos, nos conte sobre seus gostos, os momentos especiais do evento e o que definitivamente não pode tocar.",
    detail: "Formulário guiado · Sem jargão técnico · 100% gratuito",
  },
  {
    icon: Music2,
    number: "02",
    title: "Nosso curador monta seu repertório",
    description:
      "Com base no seu perfil, nosso curador seleciona cada música com cuidado — gênero, energia, letra e timing perfeitos para cada momento.",
    detail: "Curadoria humana · Powered by Spotify · Entrega em até 5 dias",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "Você aprova, ajusta e recebe a playlist",
    description:
      "Revise música por música, peça alterações e aprove o repertório final. Receba em PDF e como playlist no Spotify.",
    detail: "Aprovação online · Revisões inclusas · Entrega no Spotify",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-medium">
            Como funciona
          </span>
          <h2
            className="mt-3 text-4xl lg:text-5xl text-[#1A1A1A] leading-tight"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Simples como deve ser
          </h2>
          <p className="mt-4 text-[#8A7F72] text-lg leading-relaxed">
            Da primeira conversa até a playlist final, cuidamos de cada detalhe
            para que você só precise se preocupar em aproveitar.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative group">
                {/* Connector line (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+3rem)] right-[-3rem] h-px border-t-2 border-dashed border-[#C9A96E]/30" />
                )}

                <div className="flex flex-col items-center text-center">
                  {/* Icon circle */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#FAF7F2] border-2 border-[#F5E6D3] flex items-center justify-center group-hover:border-[#C9A96E] transition-colors">
                      <Icon className="w-8 h-8 text-[#C9A96E]" />
                    </div>
                    <span
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full gradient-gold text-white text-xs font-bold flex items-center justify-center"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {i + 1}
                    </span>
                  </div>

                  <h3
                    className="text-xl text-[#1A1A1A] mb-3"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[#8A7F72] leading-relaxed mb-4 text-sm">
                    {step.description}
                  </p>
                  <p className="text-xs text-[#C9A96E] font-medium tracking-wide">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
