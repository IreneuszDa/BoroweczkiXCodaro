"use client";

import { useRef, useLayoutEffect, useState } from "react";
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
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    useLayoutEffect(() => {
        const btn = buttonRefs.current.get(mode);
        const container = containerRef.current;
        if (btn && container) {
            const containerRect = container.getBoundingClientRect();
            const btnRect = btn.getBoundingClientRect();
            setIndicatorStyle({
                left: btnRect.left - containerRect.left,
                width: btnRect.width,
            });
        }
    }, [mode]);

    return (
        <div
            ref={containerRef}
            className="relative inline-flex items-center rounded-lg bg-muted/60 p-[0.1875rem] border border-border/30"
        >
            {/* Sliding indicator — measured from actual button sizes */}
            <motion.div
                className="absolute top-[0.1875rem] bottom-[0.1875rem] rounded-md bg-background shadow-sm border border-border/40"
                animate={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                }}
            />

            {modes.map((m) => (
                <Tooltip key={m.key}>
                    <TooltipTrigger asChild>
                        <button
                            ref={(el) => {
                                if (el) buttonRefs.current.set(m.key, el);
                            }}
                            onClick={() => onModeChange(m.key)}
                            className={`relative z-10 flex items-center gap-[0.375rem] rounded-md py-[0.375rem] px-[0.875rem] text-[0.8125rem] font-medium transition-colors duration-150 ${mode === m.key
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
