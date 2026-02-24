"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const STAGES = [
    { name: "Awareness", key: "leads", color: "oklch(0.55 0.18 265)" },
    { name: "Interest", key: "prospects", color: "oklch(0.52 0.16 265)" },
    { name: "Decision", key: "active", color: "oklch(0.48 0.15 265)" },
    { name: "Close", key: "conversions", color: "oklch(0.42 0.16 265)" },
];

export function SalesFunnel() {
    const stats = useQuery(api.customers.getStats);
    const metrics = useQuery(api.metrics.getAggregated);

    if (!stats || !metrics) {
        return (
            <Card className="border-border/50 shadow-sm">
                <CardContent className="p-[1.25rem]">
                    <div className="skeleton h-[18rem] rounded-lg" />
                </CardContent>
            </Card>
        );
    }

    const values = [
        stats.leads + stats.prospects + stats.active,
        stats.prospects + stats.active,
        stats.active,
        metrics.totalConversions,
    ];

    const maxValue = Math.max(...values, 1);

    return (
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-[0.5rem] px-[1.25rem] pt-[1.25rem]">
                <CardTitle className="text-[0.875rem] font-semibold">
                    Sales Funnel
                </CardTitle>
                <p className="text-[0.75rem] text-muted-foreground">
                    Pipeline stages overview
                </p>
            </CardHeader>
            <CardContent className="px-[1.25rem] pb-[1.25rem]">
                <div className="space-y-[0.875rem]">
                    {STAGES.map((stage, index) => {
                        const width = Math.max((values[index] / maxValue) * 100, 15);
                        return (
                            <div key={stage.name} className="space-y-[0.25rem]">
                                <div className="flex items-center justify-between">
                                    <span className="text-[0.75rem] font-medium text-foreground/80">
                                        {stage.name}
                                    </span>
                                    <span className="text-[0.75rem] font-semibold">
                                        {values[index]}
                                    </span>
                                </div>
                                <div className="relative h-[2rem] bg-secondary/60 rounded-lg overflow-hidden">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 rounded-lg"
                                        style={{
                                            background: `linear-gradient(90deg, ${stage.color}, ${stage.color}dd)`,
                                        }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${width}%` }}
                                        transition={{
                                            delay: index * 0.12,
                                            duration: 0.8,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center px-[0.5rem]">
                                        <span className="text-[0.625rem] font-medium text-white/90 drop-shadow-sm">
                                            {Math.round((values[index] / maxValue) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-[1rem] pt-[0.75rem] border-t border-border/50">
                    <div className="flex items-center justify-between text-[0.6875rem]">
                        <span className="text-muted-foreground">Conversion Rate</span>
                        <span className="font-semibold text-emerald-600">
                            {values[0] > 0
                                ? ((values[3] / values[0]) * 100).toFixed(1)
                                : 0}
                            %
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
