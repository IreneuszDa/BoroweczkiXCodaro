"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function SeedButton() {
    const seed = useMutation(api.seed.seed);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSeed = async () => {
        setLoading(true);
        await seed();
        setLoading(false);
        setDone(true);
    };

    if (done) return null;

    return (
        <motion.div
            className="flex justify-center py-[2rem]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
            <Button
                onClick={handleSeed}
                disabled={loading}
                variant="outline"
                className="gap-[0.5rem] text-[0.8125rem]"
            >
                <Database style={{ width: "0.875rem", height: "0.875rem" }} />
                {loading ? "Seeding data..." : "Initialize Demo Data"}
            </Button>
        </motion.div>
    );
}
