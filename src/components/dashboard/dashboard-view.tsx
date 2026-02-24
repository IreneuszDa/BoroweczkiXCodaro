"use client";


import { motion } from "framer-motion";
import { OperationalMap } from "@/components/widgets/operational-map";
import { LeadsTable } from "@/components/widgets/leads-table";
import { SalesFunnel } from "@/components/widgets/sales-funnel";
import { StatsCards } from "@/components/widgets/stats-cards";
import { ActivityFeed } from "@/components/widgets/activity-feed";

import { LogistykaLPR } from "@/components/widgets/logistyka-lpr";
import { CommsLog } from "@/components/widgets/comms-log";

const stagger = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
};

export function DashboardView() {
    return (
        <motion.div
            className="py-[1.5rem] space-y-[1.25rem] pb-24"
            variants={stagger}
            initial="hidden"
            animate="show"
        >
            {/* Stats Cards Row */}
            <motion.div variants={item}>
                <StatsCards />
            </motion.div>

            {/* Map + Telemetry Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-[1.25rem]">
                <motion.div variants={item} className="lg:col-span-3">
                    <OperationalMap />
                </motion.div>
                <motion.div variants={item} className="lg:col-span-2 flex flex-col gap-[1.25rem]">
                    <SalesFunnel />
                    <LogistykaLPR />
                </motion.div>
            </div>

            {/* Incidents + Comms + Alerts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1.25rem]">
                <motion.div variants={item} className="lg:col-span-2">
                    <LeadsTable />
                </motion.div>
                <motion.div variants={item} className="space-y-[1.25rem]">
                    <ActivityFeed />
                    <CommsLog />
                </motion.div>
            </div>
        </motion.div>
    );
}
