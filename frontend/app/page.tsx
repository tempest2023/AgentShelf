"use client";

import { useAuth } from "@/lib/auth/context";
import AppShell from "@/components/AppShell";
import LoginPage from "@/components/LoginPage";

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return <AppShell />;
}
