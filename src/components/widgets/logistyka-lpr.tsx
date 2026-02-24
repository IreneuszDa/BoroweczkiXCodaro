"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { Fuel, HeartPulse, Wind } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function LogistykaLPR() {
    const units = useQuery(api.rescueUnits.list, {});

    // Filterm helicopters and high-value units
    const airUnits = units?.filter(u => u.type === "helicopter") || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col p-[1.25rem] bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-border/80 transition-all font-sans"
        >
            <div className="flex items-center justify-between mb-[1.5rem]">
                <div>
                    <h3 className="text-[0.875rem] font-semibold text-foreground flex items-center gap-[0.5rem]">
                        <Fuel className="w-[1rem] h-[1rem] text-muted-foreground" />
                        Logistyka LPR (Śmigłowce)
                    </h3>
                    <p className="text-[0.75rem] text-muted-foreground mt-[0.125rem]">Stan zasobów jednostek powietrznych</p>
                </div>
                <Badge variant="outline" className="text-[0.625rem] bg-indigo-500/10 text-indigo-500 border-indigo-200">
                    Aktywne: {airUnits.length}
                </Badge>
            </div>

            <div className="flex-1 overflow-auto space-y-[1.25rem] pr-2">
                {airUnits.length === 0 && (
                    <div className="text-[0.8125rem] text-muted-foreground text-center py-4">
                        Brak jednostek LPR w systemie.
                    </div>
                )}
                {airUnits.map(unit => (
                    <div key={unit._id} className="space-y-[0.75rem] p-3 rounded-lg border border-border/50 bg-muted/20">
                        <div className="flex justify-between items-center">
                            <span className="text-[0.8125rem] font-medium text-foreground">{unit.name}</span>
                            <Badge variant="secondary" className="text-[0.625rem]">
                                {unit.status.toUpperCase()}
                            </Badge>
                        </div>

                        <div className="space-y-[0.375rem]">
                            <div className="flex justify-between text-[0.6875rem] text-muted-foreground">
                                <span className="flex items-center gap-1"><Fuel className="w-3 h-3" /> Paliwo (JET A-1)</span>
                                <span>{unit.fuelLevel || 0}%</span>
                            </div>
                            <Progress value={unit.fuelLevel || 0} className="h-1.5" />
                        </div>

                        <div className="space-y-[0.375rem]">
                            <div className="flex justify-between text-[0.6875rem] text-muted-foreground">
                                <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> Tlen Medyczny</span>
                                <span>{unit.oxygenLevel || 0}%</span>
                            </div>
                            <Progress value={unit.oxygenLevel || 0} className="h-1.5 bg-muted [&>div]:bg-teal-500" />
                        </div>

                        <div className="space-y-[0.375rem]">
                            <div className="flex justify-between text-[0.6875rem] text-muted-foreground">
                                <span className="flex items-center gap-1"><HeartPulse className="w-3 h-3" /> Zestaw Trauma</span>
                                <span>{unit.medicalSupplies || 0}%</span>
                            </div>
                            <Progress value={unit.medicalSupplies || 0} className="h-1.5 bg-muted [&>div]:bg-red-500" />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
