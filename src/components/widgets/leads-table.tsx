"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

function ScoreBadge({ score }: { score: number }) {
    let color = "bg-red-100 text-red-700";
    if (score >= 80) color = "bg-emerald-100 text-emerald-700";
    else if (score >= 60) color = "bg-blue-100 text-blue-700";
    else if (score >= 40) color = "bg-amber-100 text-amber-700";

    return (
        <span
            className={`inline-flex items-center rounded-full px-[0.5rem] py-[0.0625rem] text-[0.6875rem] font-medium ${color}`}
        >
            {score}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        active: "bg-emerald-100 text-emerald-700 border-emerald-200",
        lead: "bg-blue-100 text-blue-700 border-blue-200",
        prospect: "bg-amber-100 text-amber-700 border-amber-200",
        churned: "bg-gray-100 text-gray-500 border-gray-200",
    };

    return (
        <Badge
            variant="outline"
            className={`text-[0.625rem] font-medium capitalize ${colors[status] ?? colors.lead}`}
        >
            {status}
        </Badge>
    );
}

export function LeadsTable() {
    const leads = useQuery(api.customers.getTopLeads, { limit: 8 });

    if (!leads) {
        return (
            <Card className="border-border/50 shadow-sm">
                <CardContent className="p-[1.25rem]">
                    <div className="skeleton h-[20rem] rounded-lg" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-[0.5rem] px-[1.25rem] pt-[1.25rem]">
                <CardTitle className="text-[0.875rem] font-semibold">
                    Top Leads
                </CardTitle>
                <p className="text-[0.75rem] text-muted-foreground">
                    Ranked by customer score
                </p>
            </CardHeader>
            <CardContent className="px-[1.25rem] pb-[1rem]">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="text-[0.6875rem] font-medium text-muted-foreground h-[2.25rem]">
                                Name
                            </TableHead>
                            <TableHead className="text-[0.6875rem] font-medium text-muted-foreground h-[2.25rem]">
                                Company
                            </TableHead>
                            <TableHead className="text-[0.6875rem] font-medium text-muted-foreground h-[2.25rem]">
                                Status
                            </TableHead>
                            <TableHead className="text-[0.6875rem] font-medium text-muted-foreground h-[2.25rem] text-right">
                                Score
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead, index) => (
                            <motion.tr
                                key={lead._id}
                                className="border-border/30 hover:bg-accent/50 transition-colors duration-200 cursor-pointer group"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: index * 0.04,
                                    duration: 0.3,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                            >
                                <TableCell className="py-[0.625rem]">
                                    <div>
                                        <p className="text-[0.8125rem] font-medium group-hover:text-primary transition-colors">
                                            {lead.name}
                                        </p>
                                        <p className="text-[0.6875rem] text-muted-foreground">
                                            {lead.email}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="py-[0.625rem] text-[0.75rem] text-muted-foreground">
                                    {lead.company}
                                </TableCell>
                                <TableCell className="py-[0.625rem]">
                                    <StatusBadge status={lead.status} />
                                </TableCell>
                                <TableCell className="py-[0.625rem] text-right">
                                    <ScoreBadge score={lead.score} />
                                </TableCell>
                            </motion.tr>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
