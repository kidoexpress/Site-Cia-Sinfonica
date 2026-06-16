import { LangProvider } from "@/components/landing/lang-context";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { HistoriaContent } from "@/components/landing/historia-content";

export const metadata = {
  title: "Nossa História — 25 anos de produção musical",
  description:
    "De um quarteto de cordas a uma orquestra residente: a história da Cia. Sinfônica, casa de produção musical para casamentos de alto padrão em São Paulo.",
};

export default function HistoriaPage() {
  return (
    <LangProvider>
      <div className="cs-root">
        <Navbar />
        <HistoriaContent />
        <Footer />
      </div>
    </LangProvider>
  );
}
