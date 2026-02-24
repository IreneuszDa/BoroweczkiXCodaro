"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { AlertTriangle, Users, Target, ShieldAlert } from "lucide-react";

export function StatsCards() {
    const incStats = useQuery(api.incidents.getStats);
    const unitStats = useQuery(api.rescueUnits.getStats);

    const cards = [
        {
            title: "Aktywne Zgłoszenia",
            value: incStats ? incStats.active.toString() : "-",
            change: incStats ? `${incStats.critical} krytycznych` : "",
            trend: incStats && incStats.critical > 0 ? "down" : "up",
            icon: AlertTriangle,
            iconClass: "text-[#ff5c00] bg-[#ff5c00]/10",
        },
        {
            title: "Zespoły w Akcji",
            value: unitStats ? unitStats.deployed.toString() : "-",
            change: "Zadysponowane",
            trend: "up",
            icon: Target,
            iconClass: "text-blue-500 bg-blue-500/10",
        },
        {
            title: "Zasoby Bazy",
            value: unitStats ? unitStats.available.toString() : "-",
            change: "Gotowe do akcji",
            trend: "up",
            icon: Users,
            iconClass: "text-green-500 bg-green-500/10",
        },
        {
            title: "Całkowite Zgłoszenia",
            value: incStats ? incStats.total.toString() : "-",
            change: incStats ? `${incStats.resolved} rozwiązanych` : "",
            trend: "up",
            icon: ShieldAlert,
            iconClass: "text-foreground bg-muted",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1rem]">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col p-[1.25rem] bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-border/80 transition-all group"
                >
                    <div className="flex items-center justify-between mb-[1rem]">
                        <h3 className="text-[0.8125rem] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{card.title}</h3>
                        <div className={`p-[0.5rem] rounded-lg ${card.iconClass} transition-colors`}>
                            <card.icon style={{ width: "1rem", height: "1rem" }} />
                        </div>
                    </div>
                    <div>
                        <div className="text-[1.5rem] font-semibold tracking-tight text-foreground">{card.value}</div>
                        <div className="flex items-center gap-[0.375rem] mt-[0.25rem]">
                            <span className={`text-[0.75rem] font-medium leading-none ${card.trend === "down" ? "text-[#ff5c00]" : "text-muted-foreground"}`}>
                                {card.change}
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
