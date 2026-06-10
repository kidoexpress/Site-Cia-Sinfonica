const faqs = [
  {
    q: "Como funciona o processo de curadoria?",
    a: "Após o pagamento, você preenche um perfil musical detalhado com seus gostos, referências e os momentos do evento. Nosso curador usa essas informações para montar um repertório personalizado em até 5 dias úteis. Você então revisa, aprova ou pede ajustes — tudo pela plataforma.",
  },
  {
    q: "Preciso ter conta no Spotify?",
    a: "Para os planos Plus e Premium, sim — a playlist final é criada diretamente na sua conta do Spotify, facilitando o compartilhamento com o DJ ou banda. Para o plano Essencial, entregamos o repertório em PDF completo.",
  },
  {
    q: "E se eu não gostar de alguma música?",
    a: "Você pode aprovar ou rejeitar cada música individualmente, com um campo para explicar o motivo. O curador usa esse feedback para as revisões. O número de rodadas de revisão depende do seu plano.",
  },
  {
    q: "Quando preciso contratar para ter o repertório antes do evento?",
    a: "Recomendamos pelo menos 30 dias de antecedência para uma experiência tranquila. Para datas urgentes, temos o add-on de entrega expressa em 48h.",
  },
  {
    q: "Vocês trabalham com qualquer estilo musical?",
    a: "Sim! Trabalhamos com todos os estilos — MPB, sertanejo, pop, rock, eletrônico, internacional, clássico e muito mais. A curadoria é feita para refletir exatamente quem você é.",
  },
  {
    q: "O pagamento é seguro?",
    a: "Totalmente. Utilizamos o Stripe, o mesmo sistema de pagamentos usado por Airbnb, Shopify e milhões de empresas no mundo. Seus dados de cartão nunca passam pelos nossos servidores.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-medium">
            Dúvidas frequentes
          </span>
          <h2
            className="mt-3 text-4xl lg:text-5xl text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Perguntas frequentes
          </h2>
        </div>

        <div className="divide-y divide-[#F5E6D3]">
          {faqs.map((faq, i) => (
            <details key={i} className="group py-6 cursor-pointer list-none">
              <summary className="flex items-center justify-between gap-4 list-none select-none">
                <span
                  className="text-base font-medium text-[#1A1A1A] group-open:text-[#C9A96E] transition-colors"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {faq.q}
                </span>
                <span className="text-[#C9A96E] text-xl shrink-0 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm text-[#8A7F72] leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
