"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, TrendingUp, Target, DollarSign, ArrowUp, ArrowDown } from "lucide-react";

export function StatsCards() {
    const stats = useQuery(api.customers.getStats);
    const metrics = useQuery(api.metrics.getAggregated);

    if (!stats || !metrics) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[1rem]">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton h-[7rem] rounded-xl" />
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: "Total Revenue",
            value: `$${(metrics.totalRevenue / 1000).toFixed(0)}k`,
            change: metrics.revenueGrowth,
            icon: DollarSign,
            gradient: "from-emerald-500/10 to-emerald-500/5",
            iconColor: "text-emerald-600",
        },
        {
            title: "Total Customers",
            value: stats.total.toString(),
            change: 12,
            icon: Users,
            gradient: "from-blue-500/10 to-blue-500/5",
            iconColor: "text-blue-600",
        },
        {
            title: "Active Leads",
            value: stats.leads.toString(),
            change: 8,
            icon: Target,
            gradient: "from-amber-500/10 to-amber-500/5",
            iconColor: "text-amber-600",
        },
        {
            title: "Conversions",
            value: metrics.totalConversions.toString(),
            change: metrics.revenueGrowth > 0 ? 5 : -3,
            icon: TrendingUp,
            gradient: "from-purple-500/10 to-purple-500/5",
            iconColor: "text-purple-600",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1rem]">
            {cards.map((card) => (
                <motion.div
                    key={card.title}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                    <Card className="relative overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50`}
                        />
                        <CardContent className="relative p-[1rem]">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[0.6875rem] font-medium text-muted-foreground uppercase tracking-wider">
                                        {card.title}
                                    </p>
                                    <p className="text-[1.5rem] font-bold tracking-tight mt-[0.25rem]">
                                        {card.value}
                                    </p>
                                </div>
                                <div className={`p-[0.375rem] rounded-lg bg-white/80 ${card.iconColor}`}>
                                    <card.icon style={{ width: "1rem", height: "1rem" }} />
                                </div>
                            </div>
                            <div className="flex items-center mt-[0.5rem] gap-[0.25rem]">
                                {card.change >= 0 ? (
                                    <ArrowUp
                                        className="text-emerald-500"
                                        style={{ width: "0.75rem", height: "0.75rem" }}
                                    />
                                ) : (
                                    <ArrowDown
                                        className="text-red-500"
                                        style={{ width: "0.75rem", height: "0.75rem" }}
                                    />
                                )}
                                <span
                                    className={`text-[0.6875rem] font-medium ${card.change >= 0 ? "text-emerald-600" : "text-red-500"
                                        }`}
                                >
                                    {Math.abs(card.change)}%
                                </span>
                                <span className="text-[0.6875rem] text-muted-foreground">
                                    vs last period
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
