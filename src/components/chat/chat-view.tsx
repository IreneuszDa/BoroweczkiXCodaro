"use client";

import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Sparkles, Plus, MessageSquare, Trash2 } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

export function ChatView() {
    const [activeConversationId, setActiveConversationId] = useState<Id<"conversations"> | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Data fetching
    const conversations = useQuery(api.messages.listConversations);
    const messages = useQuery(api.messages.list, activeConversationId ? { conversationId: activeConversationId } : "skip");

    // Mutations/Actions
    const createConversation = useMutation(api.messages.createConversation);
    const deleteConversation = useMutation(api.messages.deleteConversation);
    const chatAction = useAction(api.ai.chat);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-select first conversation if none selected and data loaded
    useEffect(() => {
        if (conversations && conversations.length > 0 && !activeConversationId) {
            setActiveConversationId(conversations[0]._id);
        }
    }, [conversations, activeConversationId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleNewChat = async () => {
        const newId = await createConversation({});
        setActiveConversationId(newId);
    };

    const handleDeleteChat = async (e: React.MouseEvent, id: Id<"conversations">) => {
        e.stopPropagation();
        await deleteConversation({ conversationId: id });
        if (activeConversationId === id) {
            setActiveConversationId(null);
        }
    };

    const handleSend = async (message: string, files?: File[]) => {
        setIsLoading(true);
        try {
            let convId = activeConversationId;
            // Create conversation if none exists
            if (!convId) {
                convId = await createConversation({});
                setActiveConversationId(convId);
            }

            let fullMessage = message;
            if (files && files.length > 0) {
                const fileNames = files.map((f) => f.name).join(", ");
                fullMessage = `[Attached: ${fileNames}] ${message}`;
            }

            await chatAction({
                conversationId: convId,
                message: fullMessage
            });
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const isEmpty = !messages || messages.length === 0;

    return (
        <div className="flex h-[calc(100vh-7.5rem)] bg-background border border-border/40 rounded-xl overflow-hidden shadow-sm">
            {/* Sidebar for History */}
            <div className="w-[16rem] bg-muted/20 border-r border-border/40 flex flex-col hidden md:flex">
                <div className="p-[1rem] flex items-center justify-between border-b border-border/40">
                    <h2 className="text-[0.875rem] font-semibold">Chats</h2>
                    <button
                        onClick={handleNewChat}
                        className="p-[0.375rem] rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors"
                    >
                        <Plus style={{ width: "1rem", height: "1rem" }} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-[0.5rem] space-y-[0.25rem]">
                    {conversations?.map((conv) => (
                        <button
                            key={conv._id}
                            onClick={() => setActiveConversationId(conv._id)}
                            className={`w-full group flex items-center gap-[0.5rem] px-[0.75rem] py-[0.625rem] rounded-lg text-left transition-colors duration-150 ${activeConversationId === conv._id
                                    ? "bg-accent/80 text-foreground"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                }`}
                        >
                            <MessageSquare style={{ width: "1rem", height: "1rem" }} className="flex-shrink-0 opacity-60" />
                            <span className="flex-1 truncate text-[0.8125rem] font-medium">
                                {conv.title}
                            </span>
                            <button
                                onClick={(e) => handleDeleteChat(e, conv._id)}
                                className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-all flex-shrink-0"
                            >
                                <Trash2 style={{ width: "0.875rem", height: "0.875rem" }} />
                            </button>
                        </button>
                    ))}

                    {conversations?.length === 0 && (
                        <div className="text-center mt-[2rem] px-[1rem]">
                            <p className="text-[0.75rem] text-muted-foreground">Brak historii czatów.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative">
                {/* Messages area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto pb-[6rem] pt-[1rem] px-[1rem] md:px-0"
                >
                    <div className="max-w-[48rem] mx-auto">
                        {(!activeConversationId || isEmpty) && !isLoading ? (
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
                                        "📊 Przychody",
                                        "👥 Klienci",
                                        "📈 Lejek sprzedaży",
                                        "📋 Aktywność",
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
                            <div className="space-y-[1.5rem]">
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

                {/* Input area — sticky bottom with backdrop */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-background/0 pt-[2rem] pb-[1rem] px-[1rem]">
                    <ChatInput onSend={handleSend} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
