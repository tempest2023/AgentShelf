"use client";

import { Store, Zap } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "geo", label: "GEO Readiness" },
  { id: "channels", label: "AI Commerce Channels" },
  { id: "launch", label: "Commercial Launch Pack" },
];

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-blue-400">
            <Store className="w-5 h-5" />
            <span className="font-semibold text-base tracking-tight">AgentShelf</span>
          </div>
          <span className="text-zinc-600 text-sm hidden sm:inline">|</span>
          <span className="text-zinc-500 text-sm hidden sm:inline">AI Commerce Channel Manager</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
            <Zap className="w-3 h-3" />
            <span>Demo Mode</span>
          </div>
        </div>
      </div>

      <nav className="flex px-6 gap-1 -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
