"use client";

import { motion } from "framer-motion";
import { OperationalMap } from "@/components/widgets/operational-map";
import { LeadsTable } from "@/components/widgets/leads-table";
import { SalesFunnel } from "@/components/widgets/sales-funnel";
import { ActivityFeed } from "@/components/widgets/activity-feed";
import { LogistykaLPR } from "@/components/widgets/logistyka-lpr";
import { CommsLog } from "@/components/widgets/comms-log";

const widgetMap: Record<string, React.ComponentType> = {
    "operational-map": OperationalMap,
    "revenue-chart": OperationalMap, // fallback
    "leads-table": LeadsTable,
    "sales-funnel": SalesFunnel,
    "activity-stats": ActivityFeed,
    "logistics-widget": LogistykaLPR,
    "comms-widget": CommsLog,
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
