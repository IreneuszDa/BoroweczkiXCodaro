"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { WidgetRenderer } from "@/components/chat/widget-renderer";

interface Message {
    _id: string;
    role: "user" | "assistant";
    content: string;
    widgets?: string[];
    createdAt: number;
}

interface MessageBubbleProps {
    message: Message;
}

function formatMarkdown(text: string) {
    // Simple markdown: **bold**, *italic*, \n
    return text.split("\n").map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return (
                    <strong key={j} className="font-semibold">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            if (part.startsWith("*") && part.endsWith("*")) {
                return (
                    <em key={j}>{part.slice(1, -1)}</em>
                );
            }
            return <span key={j}>{part}</span>;
        });
        return (
            <span key={i}>
                {parts}
                {i < text.split("\n").length - 1 && <br />}
            </span>
        );
    });
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === "user";

    return (
        <motion.div
            className={`flex gap-[0.75rem] ${isUser ? "flex-row-reverse" : ""}`}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-[2.25rem] h-[2.25rem] rounded-full flex items-center justify-center ${isUser
                    ? "bg-primary/10 text-primary"
                    : "bg-gradient-to-br from-primary/20 to-primary/10 text-primary"
                    }`}
            >
                {isUser ? (
                    <User style={{ width: "1rem", height: "1rem" }} />
                ) : (
                    <Bot style={{ width: "1rem", height: "1rem" }} />
                )}
            </div>

            {/* Bubble */}
            <div
                className={`max-w-[75%] ${isUser ? "items-end" : "items-start"
                    }`}
            >
                <div
                    className={`rounded-2xl px-[1.125rem] py-[0.875rem] text-[0.9375rem] leading-relaxed ${isUser
                        ? "bg-primary text-primary-foreground rounded-tr-[0.25rem]"
                        : "bg-secondary/80 text-foreground rounded-tl-[0.25rem] border border-border/30"
                        }`}
                >
                    <div className="chat-markdown">{formatMarkdown(message.content)}</div>
                </div>

                {/* Render widgets if present */}
                {message.widgets && message.widgets.length > 0 && (
                    <motion.div
                        className="mt-[0.75rem] space-y-[0.5rem]"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        {message.widgets.map((widget) => (
                            <WidgetRenderer key={widget} widgetType={widget} />
                        ))}
                    </motion.div>
                )}

                {/* Timestamp */}
                <p
                    className={`text-[0.6875rem] text-muted-foreground/60 mt-[0.375rem] ${isUser ? "text-right" : ""
                        }`}
                >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
        </motion.div>
    );
}
