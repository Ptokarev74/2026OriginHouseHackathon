import React from "react";
import { AppShell } from "@/components/dashboard/AppShell";

export const metadata = {
  title: "Notice-to-Rescue Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
