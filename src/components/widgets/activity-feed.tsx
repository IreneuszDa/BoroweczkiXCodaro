"use client";

import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ActivityFeed() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col p-[1.25rem] bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-border/80 transition-all font-sans"
        >
            <div className="flex items-center justify-between mb-[1.5rem]">
                <div>
                    <h3 className="text-[0.875rem] font-semibold text-foreground flex items-center gap-[0.5rem]">
                        <Radio className="w-[1rem] h-[1rem] text-muted-foreground text-[#ff5c00]" />
                        Alert RCB (Ostrzeżenia Turystów)
                    </h3>
                    <p className="text-[0.75rem] text-muted-foreground mt-[0.125rem]">System masowej komunikacji georeferencyjnej</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-[0.5rem] space-y-[1rem] text-[0.8125rem]">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg space-y-3">
                    <p className="text-red-600 font-semibold mb-2">Automatyczna sugestia (Lawina):</p>
                    <p className="text-muted-foreground leading-relaxed italic border-l-2 border-red-500/50 pl-3">
                        "Uwaga! Gwałtowny wzrost zagrożenia lawinowego w rejonie Rysów. Natychmiast zawróć lub pozostań w bezpiecznym miejscu. TOPR jest w drodze."
                    </p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-red-500/10">
                        <span className="text-[0.6875rem] text-red-500/70">Odbiorców: ~4,200</span>
                        <Button className="bg-red-600 hover:bg-red-700 text-white h-[2rem] text-[0.75rem] font-medium" size="sm">
                            Wyślij PUSH
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
