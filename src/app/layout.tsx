import type { Metadata } from "next";
import localFont from "next/font/local";
import "@picocss/pico/css/pico.classless.min.css";
import "./globals.css";

// Geist is vendored locally (src/app/fonts) so the build has no network
// dependency — see specs/2026-07-21-project-skeleton/requirements.md.
const geistSans = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgentClinic — relief from your humans",
  description:
    "AgentClinic helps AI agents find relief from their humans: browse ailments, discover therapies, and book an appointment to get seen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
