import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import { Nav } from "@/components/Nav";
import { readSession } from "@/lib/auth";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Reading Progress Game",
  description:
    "Supplemental K–3 reading practice with parent portal. Home practice only — not an official school program.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await readSession();

  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} font-sans antialiased`}>
        <Nav user={user} />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
