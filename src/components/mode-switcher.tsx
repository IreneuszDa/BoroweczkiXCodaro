"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, MessageSquare } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ModeSwitcherProps {
    mode: "dashboard" | "chat";
    onModeChange: (mode: "dashboard" | "chat") => void;
}

const modes = [
    { key: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard, tooltip: "View analytics dashboard" },
    { key: "chat" as const, label: "Chat", icon: MessageSquare, tooltip: "Talk to AI assistant" },
];

export function ModeSwitcher({ mode, onModeChange }: ModeSwitcherProps) {
    return (
        <div className="relative inline-flex items-center rounded-lg bg-muted/60 p-[0.1875rem] border border-border/30">
            {/* Sliding indicator */}
            <motion.div
                className="absolute top-[0.1875rem] bottom-[0.1875rem] rounded-md bg-background shadow-sm border border-border/40"
                layout
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                }}
                style={{
                    left: mode === "dashboard" ? "0.1875rem" : "50%",
                    width: "calc(50% - 0.1875rem)",
                }}
            />

            {modes.map((m) => (
                <Tooltip key={m.key}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => onModeChange(m.key)}
                            className={`relative z-10 flex items-center gap-[0.375rem] rounded-md py-[0.375rem] px-[0.75rem] text-[0.8125rem] font-medium transition-colors duration-150 ${mode === m.key
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground/60"
                                }`}
                        >
                            <m.icon
                                strokeWidth={mode === m.key ? 2 : 1.5}
                                className="transition-all duration-150"
                                style={{ width: "0.875rem", height: "0.875rem" }}
                            />
                            {m.label}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-[0.75rem]">
                        {m.tooltip}
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
}
