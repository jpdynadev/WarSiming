// app/layout.tsx (Next.js 13+)
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warhammer 40k Battle Simulator",
  // This is critical for responsive scaling on mobile
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
