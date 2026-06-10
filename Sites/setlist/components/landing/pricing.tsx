import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Essencial",
    price: "R$ 297",
    description: "Para quem quer um repertório bonito sem complicação.",
    features: [
      "Perfil musical completo",
      "1 repertório (até 40 músicas)",
      "1 rodada de revisão",
      "Entrega em PDF",
      "Suporte por e-mail",
    ],
    cta: "Escolher Essencial",
    href: "/checkout/essencial",
    highlighted: false,
  },
  {
    name: "Plus",
    price: "R$ 497",
    description: "O favorito dos casais que querem mais controle.",
    features: [
      "Tudo do Essencial",
      "3 rodadas de revisão",
      "Playlist no Spotify",
      "Chat com o curador",
      "Aprovação música por música",
    ],
    cta: "Escolher Plus",
    href: "/checkout/plus",
    highlighted: true,
    badge: "Mais popular",
  },
  {
    name: "Premium",
    price: "R$ 897",
    description: "Curadoria completa para quem não quer deixar nada ao acaso.",
    features: [
      "Tudo do Plus",
      "Repertório para todos os momentos",
      "Call de 30min com o curador",
      "Entrega expressa",
      "Versão impressa (design premium)",
    ],
    cta: "Escolher Premium",
    href: "/checkout/premium",
    highlighted: false,
  },
  {
    name: "Full Service",
    price: "Sob consulta",
    description: "Acompanhamento completo, do repertório ao dia do evento.",
    features: [
      "Tudo do Premium",
      "Acompanhamento no dia",
      "DJ/músico parceiro indicado",
      "Consultoria ilimitada",
      "Prioridade máxima",
    ],
    cta: "Falar com a equipe",
    href: "/contato",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="planos" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-medium">
            Planos e preços
          </span>
          <h2
            className="mt-3 text-4xl lg:text-5xl text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Escolha o seu plano
          </h2>
          <p className="mt-4 text-[#8A7F72] text-lg">
            Todos os planos incluem diagnóstico gratuito e pagamento seguro via Stripe.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 ${
                plan.highlighted
                  ? "gradient-hero text-white shadow-2xl scale-105 border-0"
                  : "bg-[#FAF7F2] border border-[#F5E6D3]"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-[#C9A96E] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-xl mb-1 ${
                    plan.highlighted ? "text-white" : "text-[#1A1A1A]"
                  }`}
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    plan.highlighted ? "text-white/65" : "text-[#8A7F72]"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span
                  className={`text-3xl font-bold ${
                    plan.highlighted ? "text-white" : "text-[#1A1A1A]"
                  }`}
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {plan.price}
                </span>
                {plan.price !== "Sob consulta" && (
                  <span
                    className={`text-sm ml-1 ${
                      plan.highlighted ? "text-white/50" : "text-[#8A7F72]"
                    }`}
                  >
                    / único
                  </span>
                )}
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        plan.highlighted ? "text-[#C9A96E]" : "text-[#C9A96E]"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.highlighted ? "text-white/80" : "text-[#3D3D3D]"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-3 rounded-full text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "gradient-gold text-white hover:opacity-90"
                    : "border-2 border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-white"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[#8A7F72] mt-10">
          Precisa de algo diferente?{" "}
          <Link href="/contato" className="text-[#C9A96E] hover:underline">
            Fale conosco
          </Link>{" "}
          e montamos uma proposta personalizada.
        </p>
      </div>
    </section>
  );
}
