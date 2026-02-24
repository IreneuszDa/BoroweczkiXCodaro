"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

function getDaysInWeek() {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);

    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        days.push(d);
    }
    return days;
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function TaskCalendar() {
    const metrics = useQuery(api.metrics.getAll);

    const days = getDaysInWeek();
    const today = new Date().toISOString().split("T")[0];

    const tasksByDate = new Map<string, number>();
    if (metrics) {
        for (const m of metrics) {
            tasksByDate.set(m.date, m.tasks);
        }
    }

    return (
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-[0.5rem] px-[1.25rem] pt-[1.25rem]">
                <CardTitle className="text-[0.875rem] font-semibold">
                    This Week
                </CardTitle>
                <p className="text-[0.75rem] text-muted-foreground">
                    Tasks by day
                </p>
            </CardHeader>
            <CardContent className="px-[1.25rem] pb-[1.25rem]">
                <div className="grid grid-cols-7 gap-[0.375rem]">
                    {days.map((day, index) => {
                        const dateStr = day.toISOString().split("T")[0];
                        const tasks = tasksByDate.get(dateStr) ?? 0;
                        const isToday = dateStr === today;

                        return (
                            <motion.div
                                key={dateStr}
                                className={`flex flex-col items-center gap-[0.25rem] p-[0.375rem] rounded-lg cursor-pointer transition-all duration-200 ${isToday
                                        ? "bg-primary/10 ring-1 ring-primary/20"
                                        : "hover:bg-accent"
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <span
                                    className={`text-[0.625rem] font-medium ${isToday ? "text-primary" : "text-muted-foreground"
                                        }`}
                                >
                                    {DAY_NAMES[index]}
                                </span>
                                <span
                                    className={`text-[0.8125rem] font-semibold ${isToday ? "text-primary" : ""
                                        }`}
                                >
                                    {day.getDate()}
                                </span>
                                {tasks > 0 && (
                                    <div className="flex gap-[0.125rem]">
                                        {[...Array(Math.min(tasks, 3))].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-[0.25rem] h-[0.25rem] rounded-full bg-primary/60"
                                            />
                                        ))}
                                        {tasks > 3 && (
                                            <span className="text-[0.5rem] text-muted-foreground">
                                                +{tasks - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
