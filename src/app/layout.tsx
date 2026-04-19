import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notice-to-Rescue | Medicaid Notice Agent",
  description:
    "A frontend-only Medicaid notice rescue demo that identifies coverage blockers and prepares next-step packets.",
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
