"use client";

import { motion } from "framer-motion";
import { RevenueChart } from "@/components/widgets/revenue-chart";
import { LeadsTable } from "@/components/widgets/leads-table";
import { SalesFunnel } from "@/components/widgets/sales-funnel";
import { TaskCalendar } from "@/components/widgets/task-calendar";
import { ActivityFeed } from "@/components/widgets/activity-feed";

const widgetMap: Record<string, React.ComponentType> = {
    "revenue-chart": RevenueChart,
    "leads-table": LeadsTable,
    "sales-funnel": SalesFunnel,
    "task-calendar": TaskCalendar,
    "activity-stats": ActivityFeed,
};

interface WidgetRendererProps {
    widgetType: string;
}

export function WidgetRenderer({ widgetType }: WidgetRendererProps) {
    const Widget = widgetMap[widgetType];

    if (!Widget) return null;

    return (
        <motion.div
            className="w-full max-w-[32rem]"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            <Widget />
        </motion.div>
    );
}
