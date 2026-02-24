"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

export function RevenueChart() {
    const revenue = useQuery(api.metrics.getRevenue);

    if (!revenue) {
        return (
            <Card className="border-border/50 shadow-sm">
                <CardContent className="p-[1.25rem]">
                    <div className="skeleton h-[18rem] rounded-lg" />
                </CardContent>
            </Card>
        );
    }

    const formatted = revenue.map((r) => ({
        ...r,
        date: new Date(r.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
    }));

    return (
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-[0.5rem] px-[1.25rem] pt-[1.25rem]">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-[0.875rem] font-semibold">
                            Revenue Overview
                        </CardTitle>
                        <p className="text-[0.75rem] text-muted-foreground mt-[0.125rem]">
                            Last 30 days performance
                        </p>
                    </div>
                    <div className="flex items-center gap-[0.25rem] text-emerald-600 bg-emerald-50 px-[0.5rem] py-[0.1875rem] rounded-full">
                        <TrendingUp style={{ width: "0.75rem", height: "0.75rem" }} />
                        <span className="text-[0.6875rem] font-medium">+12.5%</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-[0.5rem] pb-[1rem]">
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart
                        data={formatted}
                        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="oklch(0.42 0.16 265)" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="oklch(0.42 0.16 265)" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="oklch(0.92 0.01 255)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: "oklch(0.55 0.03 260)" }}
                            axisLine={false}
                            tickLine={false}
                            dy={8}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: "oklch(0.55 0.03 260)" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                            dx={-4}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "white",
                                border: "none",
                                borderRadius: "0.5rem",
                                boxShadow: "0 0.25rem 1rem rgba(0,0,0,0.1)",
                                fontSize: "0.75rem",
                                padding: "0.5rem 0.75rem",
                            }}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            formatter={((value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]) as any}
                            labelStyle={{ fontSize: "0.6875rem", color: "oklch(0.55 0.03 260)" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="oklch(0.42 0.16 265)"
                            strokeWidth={2}
                            fill="url(#revenueGrad)"
                            animationDuration={1200}
                            animationEasing="ease-out"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
