"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Paperclip, X, FileText, Image } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatInputProps {
    onSend: (message: string, files?: File[]) => void;
    isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
    const [value, setValue] = useState("");
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = Math.min(el.scrollHeight, 120) + "px";
        }
    }, [value]);

    const handleSubmit = () => {
        if ((!value.trim() && attachedFiles.length === 0) || isLoading) return;
        const msg = value.trim() || (attachedFiles.length > 0 ? `Attached ${attachedFiles.length} file(s): ${attachedFiles.map(f => f.name).join(", ")}` : "");
        onSend(msg, attachedFiles.length > 0 ? attachedFiles : undefined);
        setValue("");
        setAttachedFiles([]);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setAttachedFiles((prev) => [...prev, ...files]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeFile = (index: number) => {
        setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith("image/")) return Image;
        return FileText;
    };

    const hasContent = value.trim().length > 0 || attachedFiles.length > 0;

    return (
        <motion.div
            className="w-full max-w-[40rem] mx-auto"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="relative rounded-2xl border border-border/70 bg-card shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-border transition-all duration-200 overflow-hidden">
                {/* Attached files preview */}
                <AnimatePresence>
                    {attachedFiles.length > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-b border-border/30"
                        >
                            <div className="flex flex-wrap gap-[0.375rem] p-[0.625rem] pb-[0.375rem]">
                                {attachedFiles.map((file, index) => {
                                    const FileIcon = getFileIcon(file);
                                    return (
                                        <motion.div
                                            key={`${file.name}-${index}`}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            className="flex items-center gap-[0.375rem] bg-muted/60 rounded-lg px-[0.5rem] py-[0.25rem] text-[0.6875rem] text-muted-foreground group"
                                        >
                                            <FileIcon style={{ width: "0.75rem", height: "0.75rem" }} className="flex-shrink-0" />
                                            <span className="truncate max-w-[8rem]">{file.name}</span>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="flex-shrink-0 rounded-full hover:bg-foreground/10 p-[0.125rem] opacity-60 hover:opacity-100 transition-opacity"
                                            >
                                                <X style={{ width: "0.625rem", height: "0.625rem" }} />
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input row */}
                <div className="flex items-end gap-[0.25rem]">
                    {/* Attach button */}
                    <div className="flex-shrink-0 p-[0.375rem] pb-[0.5rem]">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center justify-center w-[1.75rem] h-[1.75rem] rounded-lg text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/60 transition-all duration-150"
                                >
                                    <Paperclip style={{ width: "0.9375rem", height: "0.9375rem" }} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-[0.75rem]">
                                Attach files
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message ScaleFlow..."
                        rows={1}
                        className="flex-1 resize-none bg-transparent border-none outline-none text-[0.875rem] placeholder:text-muted-foreground/40 py-[0.6875rem] leading-[1.375rem] max-h-[7.5rem]"
                    />

                    {/* Send button */}
                    <div className="flex-shrink-0 p-[0.375rem] pb-[0.5rem]">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <motion.button
                                    onClick={handleSubmit}
                                    disabled={!hasContent || isLoading}
                                    className={`flex items-center justify-center w-[1.75rem] h-[1.75rem] rounded-lg transition-all duration-200 ${hasContent && !isLoading
                                        ? "bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                                        : "bg-muted text-muted-foreground/40 cursor-not-allowed"
                                        }`}
                                    whileHover={hasContent ? { scale: 1.05 } : {}}
                                    whileTap={hasContent ? { scale: 0.92 } : {}}
                                >
                                    <ArrowUp
                                        strokeWidth={2.5}
                                        style={{ width: "0.875rem", height: "0.875rem" }}
                                    />
                                </motion.button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-[0.75rem]">
                                {hasContent ? "Send message" : "Type a message"}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.gif,.md"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            <p className="text-center text-[0.625rem] text-muted-foreground/50 mt-[0.375rem]">
                ScaleFlow can make mistakes. Verify important data.
            </p>
        </motion.div>
    );
}
