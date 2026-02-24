"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Phone, Mail, Calendar, MessageSquare } from "lucide-react";

const typeIcons: Record<string, typeof Phone> = {
    call: Phone,
    email: Mail,
    meeting: Calendar,
    chat: MessageSquare,
};

const typeColors: Record<string, string> = {
    call: "bg-blue-50 text-blue-600",
    email: "bg-emerald-50 text-emerald-600",
    meeting: "bg-amber-50 text-amber-600",
    chat: "bg-purple-50 text-purple-600",
};

export function ActivityFeed() {
    const interactions = useQuery(api.interactions.listRecent, { limit: 5 });

    if (!interactions) {
        return (
            <Card className="border-border/50 shadow-sm">
                <CardContent className="p-[1.25rem]">
                    <div className="skeleton h-[12rem] rounded-lg" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-[0.5rem] px-[1.25rem] pt-[1.25rem]">
                <CardTitle className="text-[0.875rem] font-semibold">
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="px-[1.25rem] pb-[1.25rem]">
                <div className="space-y-[0.625rem]">
                    {interactions.map((interaction, index) => {
                        const Icon = typeIcons[interaction.type] ?? MessageSquare;
                        const color = typeColors[interaction.type] ?? typeColors.chat;

                        return (
                            <motion.div
                                key={interaction._id}
                                className="flex items-start gap-[0.625rem] group cursor-pointer"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: index * 0.06,
                                    duration: 0.3,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                            >
                                <div
                                    className={`flex-shrink-0 p-[0.375rem] rounded-lg ${color} transition-transform duration-200 group-hover:scale-110`}
                                >
                                    <Icon style={{ width: "0.75rem", height: "0.75rem" }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[0.75rem] font-medium truncate group-hover:text-primary transition-colors">
                                        {interaction.customerName}
                                    </p>
                                    <p className="text-[0.6875rem] text-muted-foreground truncate">
                                        {interaction.notes}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
