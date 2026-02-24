"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ModeSwitcher } from "@/components/mode-switcher";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { ChatView } from "@/components/chat/chat-view";
import { Header } from "@/components/layout/header";
import { SeedButton } from "@/components/seed-button";
import { History } from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<"dashboard" | "chat">("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const customers = useQuery(api.customers.list);

  const needsSeed = customers !== undefined && customers.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex justify-center pt-[1rem] pb-[0.5rem] relative max-w-[90rem] mx-auto px-[clamp(1rem,3vw,3rem)] w-full">
        {mode === "chat" && (
          <div className="absolute left-[clamp(1rem,3vw,3rem)] top-[50%] -translate-y-[50%]">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center gap-[0.5rem] px-[0.75rem] py-[0.5rem] bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-all text-[0.8125rem] font-medium"
            >
              <History style={{ width: "1rem", height: "1rem" }} />
              <span>Historia</span>
            </button>
          </div>
        )}
        <ModeSwitcher mode={mode} onModeChange={setMode} />
      </div>

      <main className="flex-1 w-full max-w-[90rem] mx-auto px-[clamp(1rem,3vw,3rem)]">
        {needsSeed && <SeedButton />}

        <AnimatePresence mode="wait">
          {mode === "dashboard" ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <DashboardView />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ChatView isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
