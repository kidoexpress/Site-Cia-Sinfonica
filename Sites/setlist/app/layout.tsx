import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Setlist — Curadoria Musical para Casamentos e Festas",
  description:
    "Repertório musical personalizado para o dia mais especial da sua vida. Casamentos, aniversários, formaturas e eventos corporativos.",
  keywords: ["curadoria musical", "repertório casamento", "músicas casamento", "DJ casamento"],
  openGraph: {
    title: "Setlist — Curadoria Musical para Casamentos e Festas",
    description: "Seu casamento merece uma trilha sonora tão única quanto vocês.",
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
