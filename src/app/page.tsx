"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ModeSwitcher } from "@/components/mode-switcher";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { ChatView } from "@/components/chat/chat-view";
import { Header } from "@/components/layout/header";
import { SeedButton } from "@/components/seed-button";

export default function Home() {
  const [mode, setMode] = useState<"dashboard" | "chat">("dashboard");
  const customers = useQuery(api.customers.list);

  const needsSeed = customers !== undefined && customers.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex justify-center pt-1">
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
              <ChatView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
