import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coverage-to-Care Rescue | Medicare Companion",
  description:
    "A frontend-only Medicare paperwork review prototype for possible coverage continuity signals, provider-fit review, and patient next steps.",
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
