import { Heart, Cake, GraduationCap, Briefcase } from "lucide-react";

const types = [
  {
    icon: Heart,
    label: "Casamento",
    description: "Da cerimônia ao último dance, cada momento com a música certa.",
    accent: "#C9A96E",
  },
  {
    icon: Cake,
    label: "Aniversário",
    description: "Festas de 15 anos, 30, 50 — comemorações que ficam na memória.",
    accent: "#B8906A",
  },
  {
    icon: GraduationCap,
    label: "Formatura",
    description: "O fim de um ciclo merece uma trilha à altura da conquista.",
    accent: "#A8854F",
  },
  {
    icon: Briefcase,
    label: "Corporativo",
    description: "Eventos de empresa com curadoria elegante e profissional.",
    accent: "#977650",
  },
];

export function EventTypes() {
  return (
    <section className="py-24 lg:py-28" style={{ background: "#FAF7F2" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-medium">
            Para cada celebração
          </span>
          <h2
            className="mt-3 text-4xl lg:text-5xl text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Qual é o seu evento?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {types.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.label}
                className="group p-8 bg-white rounded-2xl border border-[#F5E6D3] hover:border-[#C9A96E] hover:shadow-lg transition-all cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${t.accent}18` }}
                >
                  <Icon className="w-6 h-6" style={{ color: t.accent }} />
                </div>
                <h3
                  className="text-lg text-[#1A1A1A] mb-2"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {t.label}
                </h3>
                <p className="text-sm text-[#8A7F72] leading-relaxed">
                  {t.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
