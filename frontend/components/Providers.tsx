"use client";

import { ThemeProvider } from "next-themes";
import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { LanguageProvider } from "@/lib/i18n/context";
import { AuthProvider } from "@/lib/auth/context";
import { WorkspaceProvider } from "@/lib/workspace/context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          <WorkspaceProvider>
            <CopilotKitProvider runtimeUrl="/api/copilotkit">
              {children}
            </CopilotKitProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
