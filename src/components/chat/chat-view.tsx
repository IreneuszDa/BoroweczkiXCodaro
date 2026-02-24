"use client";

import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Sparkles, RotateCcw } from "lucide-react";

export function ChatView() {
    const messages = useQuery(api.messages.list);
    const chatAction = useAction(api.ai.chat);
    const clearMessages = useMutation(api.messages.clear);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (message: string, files?: File[]) => {
        setIsLoading(true);
        try {
            let fullMessage = message;
            if (files && files.length > 0) {
                const fileNames = files.map((f) => f.name).join(", ");
                fullMessage = `[Attached: ${fileNames}] ${message}`;
            }
            await chatAction({ message: fullMessage });
        } catch {
            // Error handled by Convex
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = async () => {
        await clearMessages();
    };

    const isEmpty = !messages || messages.length === 0;

    return (
        <div className="flex flex-col h-[calc(100vh-7rem)]">
            {/* Messages area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto py-[1rem]"
            >
                <div className="max-w-[48rem] mx-auto">
                    {isEmpty && !isLoading ? (
                        <motion.div
                            className="flex flex-col items-center justify-center h-[calc(100vh-14rem)] gap-[1.25rem]"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <motion.div
                                className="p-[1rem] rounded-2xl bg-gradient-to-br from-foreground/5 to-foreground/[0.02]"
                                animate={{ y: [0, -4, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            >
                                <Sparkles
                                    className="text-foreground/60"
                                    style={{ width: "1.5rem", height: "1.5rem" }}
                                />
                            </motion.div>
                            <div className="text-center">
                                <h3 className="text-[1.125rem] font-semibold mb-[0.25rem]">
                                    What can I help with?
                                </h3>
                                <p className="text-[0.8125rem] text-muted-foreground">
                                    Ask about revenue, customers, leads, or any business data.
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-[0.375rem] max-w-[26rem] mt-[0.25rem]">
                                {[
                                    "📊 Revenue trends",
                                    "👥 Top leads",
                                    "📈 Sales funnel",
                                    "📋 Recent activity",
                                ].map((suggestion) => (
                                    <motion.button
                                        key={suggestion}
                                        onClick={() => handleSend(suggestion.replace(/^..\s/, ""))}
                                        className="text-[0.75rem] px-[0.625rem] py-[0.3125rem] rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-border transition-all duration-150"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {suggestion}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-[1rem]">
                            {/* Clear button */}
                            {!isEmpty && (
                                <div className="flex justify-center">
                                    <motion.button
                                        onClick={handleClear}
                                        className="flex items-center gap-[0.25rem] text-[0.6875rem] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <RotateCcw style={{ width: "0.625rem", height: "0.625rem" }} />
                                        New conversation
                                    </motion.button>
                                </div>
                            )}

                            <AnimatePresence initial={false}>
                                {messages?.map((msg) => (
                                    <MessageBubble key={msg._id} message={msg} />
                                ))}
                                {isLoading && (
                                    <motion.div
                                        className="flex items-center gap-[0.375rem] py-[0.5rem]"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="w-[1.5rem] h-[1.5rem] rounded-full bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
                                            <Sparkles
                                                className="text-foreground/50"
                                                style={{ width: "0.625rem", height: "0.625rem" }}
                                            />
                                        </div>
                                        <div className="flex gap-[0.1875rem]">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-[0.3125rem] h-[0.3125rem] rounded-full bg-foreground/25"
                                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 1,
                                                        delay: i * 0.2,
                                                        ease: "easeInOut",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* Input area — fixed bottom, compact */}
            <div className="pb-[1rem] pt-[0.5rem]">
                <ChatInput onSend={handleSend} isLoading={isLoading} />
            </div>
        </div>
    );
}
