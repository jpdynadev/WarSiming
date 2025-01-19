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
        <main>{children}</main>
      </body>
    </html>
  );
}
