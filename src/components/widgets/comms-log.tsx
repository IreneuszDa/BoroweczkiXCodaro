"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { RadioTower } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function CommsLog() {
    const logs = useQuery(api.communications.getLatest, { limit: 15 });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col p-[1.25rem] bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-border/80 transition-all font-sans h-[24rem]"
        >
            <div className="flex items-center justify-between mb-[1rem]">
                <div>
                    <h3 className="text-[0.875rem] font-semibold text-foreground flex items-center gap-[0.5rem]">
                        <RadioTower className="w-[1rem] h-[1rem] text-muted-foreground" />
                        Nasłuch Radiowy
                    </h3>
                    <p className="text-[0.75rem] text-muted-foreground mt-[0.125rem]">Ostatnie meldunki z terenu</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-[0.625rem] font-medium border border-red-500/20">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    REC
                </div>
            </div>

            <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="space-y-4">
                    {!logs && (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i}>
                                    <div className="skeleton h-4 w-1/3 mb-2 rounded" />
                                    <div className="skeleton h-3 w-full rounded" />
                                </div>
                            ))}
                        </div>
                    )}

                    {logs?.length === 0 && (
                        <div className="text-[0.8125rem] text-muted-foreground text-center py-8">
                            Brak aktywności radiowej. Cisza w eterze.
                        </div>
                    )}

                    {logs?.map((log, index) => {
                        const date = new Date(log.timestamp);
                        const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

                        let channelColor = "text-muted-foreground";
                        if (log.channel === "CH_1_EMERGENCY") channelColor = "text-red-500";
                        if (log.channel === "CH_3_AIR_TO_GROUND") channelColor = "text-blue-500";

                        return (
                            <div key={log._id}>
                                <div className="text-[0.8125rem]">
                                    <div className="flex items-baseline justify-between mb-1">
                                        <div className="flex flex-wrap items-baseline gap-2">
                                            <span className="font-semibold text-foreground">{log.unitName}</span>
                                            <span className={`text-[0.6875rem] font-mono ${channelColor}`}>
                                                [{log.channel.replace('CH_', '')}]
                                            </span>
                                        </div>
                                        <span className="text-[0.625rem] text-muted-foreground font-mono">
                                            {timeString}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        "{log.message}"
                                    </p>
                                </div>
                                {index < logs.length - 1 && <Separator className="mt-4" />}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </motion.div>
    );
}
