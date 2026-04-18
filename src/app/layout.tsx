import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Healthly | Medicare Guidance Demo",
  description:
    "A frontend-only Medicare paperwork review demo for possible coverage questions, document review, and patient next-step preparation.",
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
