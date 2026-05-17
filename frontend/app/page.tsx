"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth/context";
import AppShell from "@/components/AppShell";
import LoginPage from "@/components/LoginPage";
import OnboardingFlow from "@/components/OnboardingFlow";

const ONBOARDING_KEY = "agentshelf-onboarding-complete";

function isNewUser(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDING_KEY) !== "true";
}

export default function Home() {
  const { user, isHydrated } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const onboardingNeeded =
    isHydrated && Boolean(user) && !onboardingComplete && isNewUser();

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setOnboardingComplete(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <div className="h-10 w-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/10 animate-pulse" />
          <div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Loading AgentShelf
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Restoring your workspace...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (onboardingNeeded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return <AppShell />;
}
