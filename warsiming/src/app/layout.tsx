import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "War Gaming App",
  description: "A simple war gaming application built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>War Gaming App</h1>
        </header>
        <main>{children}</main>
        <footer>
          <p>© 2025 War Gaming App</p>
        </footer>
      </body>
    </html>
  );
}
