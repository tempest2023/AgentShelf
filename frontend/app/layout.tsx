import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@copilotkit/react-core/v2/styles.css";
import Providers from "@/components/Providers";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgentShelf - AI Commerce Channel Manager",
  description:
    "Help e-commerce brands make their products understandable, comparable, and recommendable in ChatGPT, Google AI Mode, and Perplexity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
