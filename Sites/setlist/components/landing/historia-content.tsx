"use client";
import Image from "next/image";
import { Reveal } from "./cs-reveal";
import { FaqPro, type FaqProItem } from "@/components/ui/faq-pro";

const MILESTONES = [
  { year: "1999", title: "Um quarteto de cordas", body: "Tudo começou com quatro músicos e a convicção de que toda cerimônia merecia mais do que uma playlist. As primeiras apresentações, em capelas e salões de São Paulo, definiram um princípio que nunca abandonamos: a música a serviço da emoção." },
  { year: "2006", title: "A primeira orquestra", body: "Conforme os convites cresciam, reunimos sopros, metais e percussão sob a mesma direção. Pela primeira vez, um casal pôde ouvir a entrada da noiva conduzida por uma orquestra completa, arranjada exclusivamente para o seu dia." },
  { year: "2013", title: "O ateliê de produção", body: "Abrimos nossa casa de produção — parte estúdio, parte sala de ensaio. Ali, cada programa passou a ser composto, arranjado e ensaiado antes da chegada do primeiro convidado, com a precisão de um set de gravação." },
  { year: "2019", title: "Curadoria como método", body: "Estruturamos a consultoria musical em um método: ouvir a história do casal, traduzir o sentimento em direção musical e desenhar cada momento da cerimônia ao segundo. A escolha avassaladora virou um único programa, inevitável." },
  { year: "2024", title: "O Estúdio de Curadoria", body: "Levamos o método para uma plataforma. O casal passa a construir o próprio perfil musical e a visualizar o repertório de cada momento em tempo real — antes mesmo da primeira consultoria presencial." },
];

const PILLARS = [
  { k: "Precisão", d: "Cada deixa cai no segundo certo. Transições, dinâmicas e silêncios são coreografados — e, ainda assim, nunca soam mecânicos." },
  { k: "Contenção", d: "Sabemos quando recuar. A melhor música de cerimônia serve ao momento sem competir com ele: presente, nunca exibida." },
  { k: "Inteligência emocional", d: "Lemos a história por trás de cada casal e construímos o som ao redor dela. A trilha não acompanha o dia — ela vira a memória." },
];

const STATS = [
  { value: "500+", label: "Eventos produzidos" },
  { value: "25+", label: "Anos de história" },
  { value: "30+", label: "Músicos residentes" },
  { value: "98%", label: "Satisfação dos casais" },
];

const FAQS: FaqProItem[] = [
  { id: "consultoria", question: "Como funciona a consultoria musical?", answer: "Começamos com uma conversa guiada de cerca de 30 minutos para entender a sua história, o espaço e o sentimento que vocês querem transmitir. A partir daí, montamos um programa completo com repertório, instrumentação e arranjos para cada momento." },
  { id: "religioso", question: "Vocês atendem casamentos religiosos?", answer: "Sim. Adaptamos o repertório para igrejas católicas, evangélicas e outras celebrações — sempre respeitando as orientações do celebrante quanto às músicas permitidas no espaço." },
  { id: "musicas", question: "É possível incluir músicas que nós escolhemos?", answer: "Absolutamente. Se vocês já têm músicas com significado especial, criamos arranjos exclusivos para elas, para qualquer formação que a nossa equipe for tocar." },
  { id: "formacao", question: "Qual é o tamanho mínimo e máximo da formação?", answer: "Trabalhamos desde duo (violino e piano) até orquestra completa com mais de 20 músicos. A formação é escolhida com base no espaço, na acústica e no orçamento." },
  { id: "antecedencia", question: "Com quanta antecedência devo contratar?", answer: "Recomendamos pelo menos 4 a 6 meses para garantir disponibilidade e tempo suficiente para os ensaios. Para datas em alta temporada (outubro a dezembro), 8 a 12 meses é o ideal." },
  { id: "estudio", question: "O que é o Estúdio de Curadoria?", answer: "É a nossa plataforma online onde o casal monta o perfil musical do evento e recebe sugestões de repertório para cada momento. Leva poucos minutos e dá ao nosso curador um ponto de partida preciso para a consultoria." },
  { id: "fora-sp", question: "Vocês atendem fora de São Paulo?", answer: "Sim. Realizamos produções em todo o Brasil e também no exterior. Há um acréscimo de cachê para eventos fora da Grande São Paulo, cotado caso a caso." },
];

export function HistoriaContent() {
  return (
    <main id="main-content">
      {/* HERO */}
      <section className="hist-hero">
        <div className="hist-hero-media">
          <Image src="/facade.webp" alt="O ateliê da Cia. Sinfônica" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 55%" }} />
          <div className="hist-hero-scrim" />
        </div>
        <div className="wrap hist-hero-inner">
          <div className="eyebrow" style={{ color: "var(--gold-soft)" }}>Nossa história</div>
          <h1 className="hist-hero-title">Vinte e cinco anos<br />afinando emoções.</h1>
          <p className="hist-hero-lead">
            A Cia. Sinfônica nasceu de uma ideia simples e teimosa: a de que a música de um casamento não se escolhe — se compõe. Esta é a história de como um pequeno quarteto virou uma casa de produção inteira.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="section-pad hist-intro">
        <div className="wrap">
          <Reveal as="p" className="hist-lead-big">
            Não somos uma banda de casamento. Somos diretores musicais — compositores, arranjadores e produtores que tratam cada cerimônia como uma estreia: única, ensaiada e executada ao vivo, com a precisão de um set de gravação e a alma de quem entende o que está em jogo.
          </Reveal>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section-pad hist-timeline dark" id="trajetoria">
        <div className="wrap">
          <div className="hist-section-head">
            <Reveal><div className="eyebrow">A trajetória</div></Reveal>
            <Reveal delay={80} as="h2" className="display">De quatro cordas a uma orquestra residente.</Reveal>
          </div>
          <div className="hist-tl">
            {MILESTONES.map((m, i) => (
              <Reveal key={m.year} delay={i * 80} className="hist-tl-item">
                <div className="hist-tl-year">{m.year}</div>
                <div className="hist-tl-body">
                  <span className="hist-tl-dot" />
                  <h3 className="hist-tl-title">{m.title}</h3>
                  <p className="hist-tl-text">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="section-pad hist-philo">
        <div className="wrap">
          <div className="hist-section-head">
            <Reveal><div className="eyebrow">A nossa linguagem</div></Reveal>
            <Reveal delay={80} as="h2" className="display">Três princípios que regem cada nota.</Reveal>
          </div>
          <div className="hist-philo-grid">
            {PILLARS.map((p, i) => (
              <Reveal key={p.k} delay={i * 90} className="hist-philo-card">
                <span className="hist-philo-k">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="hist-philo-t">{p.k}</h3>
                <p className="hist-philo-d">{p.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="hist-quote dark">
        <div className="wrap">
          <Reveal as="blockquote" className="hist-quote-text">
            &ldquo;Não escolhemos músicas. Entendemos o sentimento de um dia inteiro e construímos o som ao redor dele.&rdquo;
          </Reveal>
          <Reveal delay={120} className="hist-quote-by">Cia. Sinfônica · Produção Musical</Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="section-pad hist-stats">
        <div className="wrap">
          <div className="hist-stats-grid">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 70} className="hist-stat">
                <div className="hist-stat-value">{s.value}</div>
                <div className="hist-stat-label">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM IMAGE */}
      <section className="hist-team">
        <Reveal className="hist-team-fig" as="figure">
          <Image src="/team.webp" alt="O time da Cia. Sinfônica" fill sizes="100vw" loading="lazy" style={{ objectFit: "cover" }} />
          <figcaption>O time Cia. Sinfônica — 25 anos de produção musical sob o mesmo teto.</figcaption>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="section-pad hist-faq" id="faq">
        <div className="wrap">
          <div className="hist-section-head hist-faq-head">
            <Reveal><div className="eyebrow center">Perguntas frequentes</div></Reveal>
            <Reveal delay={80} as="h2" className="display">Tudo o que você precisa saber.</Reveal>
            <Reveal delay={140}><p className="lead" style={{ maxWidth: "44ch", margin: "0 auto" }}>Não encontrou a sua resposta? Fale com a nossa equipe — respondemos pessoalmente.</p></Reveal>
          </div>
          <Reveal delay={120}>
            <FaqPro items={FAQS} defaultOpenFirst />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="finalcta dark" id="contact">
        <div className="finalcta-grain" />
        <div className="wrap finalcta-inner">
          <Reveal><div className="eyebrow center">Comece</div></Reveal>
          <Reveal delay={90} as="h2" className="finalcta-title">A próxima história<br />pode ser a sua.</Reveal>
          <Reveal delay={170}><p className="lead finalcta-lead">Conte-nos sobre o seu dia. Vamos desenhar a experiência musical que ninguém na sala vai esquecer.</p></Reveal>
          <Reveal delay={240} className="finalcta-actions">
            <a href="/studio" className="btn btn--on-dark">Criar minha experiência musical</a>
            <a href="/#packages" className="btn btn--on-dark-ghost">Ver os pacotes</a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
