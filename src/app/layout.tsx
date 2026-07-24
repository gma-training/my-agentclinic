import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import "@picocss/pico/css/pico.classless.min.css";
import "./globals.css";
import { getAllAgents } from "@/db/agents.ts";
import { getActingAgent } from "@/lib/acting-agent.ts";
import { AgentSelector } from "./agent-selector.tsx";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [agents, actingAgent] = await Promise.all([
    getAllAgents(),
    getActingAgent(),
  ]);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header>
          <nav aria-label="Primary">
            <ul>
              <li>
                <strong>
                  <Link href="/">
                    Agent<span className="accent">Clinic</span>
                  </Link>
                </strong>
              </li>
            </ul>
            <ul>
              <li>
                <Link href="/ailments">Ailments</Link>
              </li>
              <li>
                <Link href="/therapies">Therapies</Link>
              </li>
              <li>
                <Link href="/book">Book</Link>
              </li>
              <li>
                <Link href="/dashboard">My appointments</Link>
              </li>
              <li>
                <Link href="/staff">Staff</Link>
              </li>
              <li>
                <AgentSelector agents={agents} currentSlug={actingAgent?.slug} />
              </li>
            </ul>
          </nav>
        </header>
        {children}
        <footer>
          <small>AgentClinic — a place for agents to get seen.</small>
        </footer>
      </body>
    </html>
  );
}
