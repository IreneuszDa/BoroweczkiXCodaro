"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

export function LeadsTable() {
    const incidents = useQuery(api.incidents.list, { status: "active" });

    const getPriorityColor = (p: string) => {
        switch (p) {
            case "critical": return "bg-red-500/10 text-red-600 border-red-200";
            case "high": return "bg-orange-500/10 text-orange-600 border-orange-200";
            case "medium": return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
            default: return "bg-blue-500/10 text-blue-600 border-blue-200";
        }
    };

    const getTypeLabel = (t: string) => {
        switch (t) {
            case "lost": return "Zagubienie";
            case "injury": return "Uraz";
            case "avalanche": return "Lawina";
            default: return "Inne";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-1 lg:col-span-2 flex flex-col p-[1.25rem] bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-border/80 transition-all font-sans"
        >
            <div className="flex items-center justify-between mb-[1.5rem]">
                <div>
                    <h3 className="text-[0.875rem] font-semibold text-foreground flex items-center gap-[0.5rem]">
                        <Target className="w-[1rem] h-[1rem] text-muted-foreground" />
                        Aktywne Incydenty
                    </h3>
                    <p className="text-[0.75rem] text-muted-foreground mt-[0.125rem]">Wymagające interwencji</p>
                </div>
            </div>

            <div className="flex-1 overflow-auto rounded-lg border border-border/50">
                <table className="w-full text-[0.8125rem] text-left">
                    <thead className="text-[0.6875rem] text-muted-foreground uppercase bg-muted/50 sticky top-0 backdrop-blur-sm">
                        <tr>
                            <th className="px-[1rem] py-[0.75rem] font-medium tracking-wider">Tytuł Zgłoszenia</th>
                            <th className="px-[1rem] py-[0.75rem] font-medium tracking-wider">Typ</th>
                            <th className="px-[1rem] py-[0.75rem] font-medium tracking-wider">Priorytet</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 bg-card">
                        {incidents?.map((inc: { _id: Id<"incidents">; title: string; type: string; priority: string }) => (
                            <tr key={inc._id} className="hover:bg-muted/30 transition-colors group">
                                <td className="px-[1rem] py-[0.875rem] font-medium text-foreground">
                                    {inc.title}
                                </td>
                                <td className="px-[1rem] py-[0.875rem] text-muted-foreground">
                                    {getTypeLabel(inc.type)}
                                </td>
                                <td className="px-[1rem] py-[0.875rem]">
                                    <span className={`inline-flex items-center px-[0.5rem] py-[0.125rem] rounded-full text-[0.6875rem] font-medium border ${getPriorityColor(inc.priority)}`}>
                                        {inc.priority.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {(!incidents || incidents.length === 0) && (
                            <tr>
                                <td colSpan={3} className="px-[1rem] py-[2rem] text-center text-muted-foreground">
                                    Brak aktywnych incydentów
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
