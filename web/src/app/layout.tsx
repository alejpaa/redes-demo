import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISO/IEC 22237 Data Center Platform",
  description: "Demo profesional de monitoreo y cumplimiento ISO/IEC 22237 con Next.js.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
