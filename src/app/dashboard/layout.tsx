import React from "react";
import { AppShell } from "@/components/dashboard/AppShell";

export const metadata = {
  title: "Coverage-to-Care Rescue Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
