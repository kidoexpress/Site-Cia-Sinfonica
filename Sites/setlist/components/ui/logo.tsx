import Image from "next/image";

interface LogoProps {
  /** "light" = versão branca para fundo escuro | "dark" = versão preta para fundo claro */
  variant?: "light" | "dark";
  /** Largura em px. Altura é calculada pela proporção real (1240×1210 ≈ 1.025). */
  width?: number;
  className?: string;
  priority?: boolean;
}

export function Logo({ variant = "light", width = 120, className = "", priority = false }: LogoProps) {
  const src = variant === "light" ? "/logo-light.webp" : "/logo-dark.webp";
  return (
    <Image
      src={src}
      alt="Cia. Sinfônica — Produção Musical"
      width={width}
      height={Math.round(width / 1.025)}
      className={className}
      priority={priority}
      style={{ objectFit: "contain", width: "auto", height: width / 1.025 }}
    />
  );
}
