// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "./context/AuthContext"; // <-- Import

export const metadata: Metadata = {
  title: "Warhammer 40k Battle Simulator",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the entire app in AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
