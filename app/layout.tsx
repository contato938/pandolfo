import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRM Multi-Filial",
  description: "Executive dashboard for multi-branch CRM",
};

import { ClientLayout } from "@/components/layout/client-layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Em dev, algumas ferramentas/extensões (ex: overlays do editor) podem injetar atributos no DOM
    // antes da hidratação e causar warnings ruidosos de hydration mismatch.
    <html lang="es-PY" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.className} min-h-screen bg-background antialiased text-foreground`}
      >
        <ClientLayout>
            {children}
        </ClientLayout>
      </body>
    </html>
  );
}
