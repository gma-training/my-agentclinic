import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
