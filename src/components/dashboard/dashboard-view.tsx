"use client";


import { motion } from "framer-motion";
import { RevenueChart } from "@/components/widgets/revenue-chart";
import { LeadsTable } from "@/components/widgets/leads-table";
import { SalesFunnel } from "@/components/widgets/sales-funnel";
import { StatsCards } from "@/components/widgets/stats-cards";
import { ActivityFeed } from "@/components/widgets/activity-feed";
import { TaskCalendar } from "@/components/widgets/task-calendar";

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
            className="py-[1.5rem] space-y-[1.25rem]"
            variants={stagger}
            initial="hidden"
            animate="show"
        >
            {/* Stats Cards Row */}
            <motion.div variants={item}>
                <StatsCards />
            </motion.div>

            {/* Revenue + Funnel Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-[1.25rem]">
                <motion.div variants={item} className="lg:col-span-3">
                    <RevenueChart />
                </motion.div>
                <motion.div variants={item} className="lg:col-span-2">
                    <SalesFunnel />
                </motion.div>
            </div>

            {/* Leads + Calendar + Activity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1.25rem]">
                <motion.div variants={item} className="lg:col-span-2">
                    <LeadsTable />
                </motion.div>
                <motion.div variants={item} className="space-y-[1.25rem]">
                    <TaskCalendar />
                    <ActivityFeed />
                </motion.div>
            </div>
        </motion.div>
    );
}
