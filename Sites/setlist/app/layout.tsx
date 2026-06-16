import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ciasinfonica.com.br"),
  title: {
    default: "Cia. Sinfônica — Consultoria Musical para Casamentos de Alto Padrão",
    template: "%s | Cia. Sinfônica",
  },
  description:
    "Diretores musicais especializados em casamentos de alto padrão. Repertório curado, arranjos exclusivos e produção ao vivo de ponta a ponta. São Paulo.",
  keywords: ["consultoria musical casamento", "orquestra casamento", "curadoria musical casamento", "música cerimônia", "Cia Sinfônica"],
  authors: [{ name: "Cia. Sinfônica" }],
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Cia. Sinfônica — Consultoria Musical para Casamentos",
    description: "Cada momento inesquecível merece a trilha sonora certa.",
    url: "https://ciasinfonica.com.br",
    siteName: "Cia. Sinfônica",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cia. Sinfônica — Consultoria Musical para Casamentos",
  },
  robots: { index: true, follow: true },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "Cia. Sinfônica",
  description: "Curadoria musical e produção ao vivo para casamentos e eventos de alto padrão",
  url: "https://ciasinfonica.com.br",
  address: { "@type": "PostalAddress", addressLocality: "São Paulo", addressRegion: "SP", addressCountry: "BR" },
  areaServed: "São Paulo, SP",
  priceRange: "R$6.800 – sob proposta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="cs-skip-link">Pular para o conteúdo</a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </body>
    </html>
  );
}
