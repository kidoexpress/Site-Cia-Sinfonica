import Link from "next/link";
import { Music2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="gradient-hero text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center">
                <Music2 className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-xl text-white"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Setlist
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Curadoria musical para celebrações que ficam na memória.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/></svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7s-.3-2-1.2-2.7c-1.2-1.2-2.4-1.2-3-1.3C16.6 3 12 3 12 3s-4.6 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.2v2c0 2 .3 4.2.3 4.2s.3 2 1.2 2.7c1.1 1.2 2.7 1.1 3.4 1.2C7.4 21.4 12 21.4 12 21.4s4.6 0 6.8-.3c.6-.1 1.9-.1 3-1.3.9-.7 1.2-2.7 1.2-2.7s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zm-13 6.7V9.3l5 2.2-5 2.2z"/></svg>
              </a>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-widest">
              Serviços
            </h4>
            <ul className="space-y-2.5 text-sm">
              {["Casamento", "Aniversário", "Formatura", "Corporativo"].map((s) => (
                <li key={s}>
                  <Link href="/servicos" className="hover:text-white transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-widest">
              Empresa
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Portfólio", href: "/portfolio" },
                { label: "Blog", href: "/blog" },
                { label: "Contato", href: "/contato" },
                { label: "Planos", href: "/#planos" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Conta */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-widest">
              Conta
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Entrar", href: "/app" },
                { label: "Diagnóstico gratuito", href: "/diagnostico" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Setlist. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacidade" className="hover:text-white transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-white transition-colors">
              Termos de uso
            </Link>
            {/* Stripe badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
              </svg>
              <span>Pagamento seguro</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
