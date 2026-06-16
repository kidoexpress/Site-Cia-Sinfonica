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
  title: "Cia. Sinfônica — Consultoria Musical para Casamentos de Alto Padrão",
  description:
    "Ajudamos casais a desenhar a experiência musical do seu casamento — composta, curada e executada ao vivo, com precisão absoluta.",
  keywords: ["consultoria musical casamento", "orquestra casamento", "curadoria musical casamento", "música cerimônia"],
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Cia. Sinfônica — Consultoria Musical para Casamentos",
    description: "Cada momento inesquecível merece a trilha sonora certa.",
    type: "website",
  },
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
