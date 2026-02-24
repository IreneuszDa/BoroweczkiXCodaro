"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Settings, LogOut, User, Mail, Building2, Camera } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useRef } from "react";

export function Header() {
    const [profileOpen, setProfileOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileData, setProfileData] = useState({
        firstName: "Boroweczki",
        lastName: "XCodaro",
        email: "team@boroweczkixcodaro.pl",
        company: "BoroweczkiXCodaro",
        role: "Administrator",
    });

    // Compute initials from first letter of first name + first letter of last name
    const initials =
        (profileData.firstName.charAt(0) + profileData.lastName.charAt(0)).toUpperCase();

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatarUrl(url);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-[90rem] mx-auto flex h-[3.5rem] items-center justify-between px-[clamp(1rem,3vw,2rem)]">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center gap-[0.625rem]"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="flex items-center gap-[0.375rem] select-none">
                            <div className="flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-md bg-foreground text-background font-bold text-[1rem] shadow-sm">
                                S
                            </div>
                            <span className="text-[1.25rem] font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                                ScaleFlow
                            </span>
                        </div>
                    </motion.div>

                    {/* Right side — user avatar with dropdown */}
                    <motion.div
                        className="flex items-center gap-[0.5rem]"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <DropdownMenu>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                        <button className="relative flex items-center gap-[0.5rem] rounded-full p-[0.125rem] hover:bg-accent transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                            <Avatar className="h-[2rem] w-[2rem] border border-border/50">
                                                {avatarUrl && <AvatarImage src={avatarUrl} alt="User avatar" />}
                                                <AvatarFallback className="bg-foreground/5 text-foreground text-[0.625rem] font-semibold">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                        </button>
                                    </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-[0.75rem]">
                                    Account settings
                                </TooltipContent>
                            </Tooltip>
                            <DropdownMenuContent align="end" className="w-[14rem]">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col gap-[0.125rem]">
                                        <p className="text-[0.8125rem] font-medium leading-none">
                                            {profileData.firstName} {profileData.lastName}
                                        </p>
                                        <p className="text-[0.6875rem] text-muted-foreground leading-none">
                                            {profileData.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => setProfileOpen(true)}
                                    className="gap-[0.5rem] text-[0.8125rem] cursor-pointer"
                                >
                                    <User style={{ width: "0.875rem", height: "0.875rem" }} />
                                    Profile Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-[0.5rem] text-[0.8125rem] cursor-pointer">
                                    <Settings style={{ width: "0.875rem", height: "0.875rem" }} />
                                    Preferences
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-[0.5rem] text-[0.8125rem] text-destructive cursor-pointer focus:text-destructive">
                                    <LogOut style={{ width: "0.875rem", height: "0.875rem" }} />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </motion.div>
                </div>
            </header>

            {/* Profile Dialog */}
            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                <DialogContent className="sm:max-w-[28rem]">
                    <DialogHeader>
                        <DialogTitle className="text-[1rem]">Profile Settings</DialogTitle>
                        <DialogDescription className="text-[0.8125rem]">
                            Manage your account information and preferences.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-[1.25rem] pt-[0.5rem]">
                        {/* Avatar section with upload */}
                        <div className="flex items-center gap-[0.75rem]">
                            <div className="relative group">
                                <Avatar className="h-[3.5rem] w-[3.5rem] border-2 border-border/50">
                                    {avatarUrl && <AvatarImage src={avatarUrl} alt="User avatar" />}
                                    <AvatarFallback className="bg-foreground/5 text-foreground text-[1rem] font-semibold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-200 cursor-pointer"
                                >
                                    <Camera
                                        className="text-background opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        style={{ width: "1rem", height: "1rem" }}
                                    />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                />
                            </div>
                            <div>
                                <p className="text-[0.875rem] font-medium">
                                    {profileData.firstName} {profileData.lastName}
                                </p>
                                <p className="text-[0.75rem] text-muted-foreground">
                                    {profileData.role}
                                </p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-[0.6875rem] text-primary hover:underline mt-[0.125rem]"
                                >
                                    Change photo
                                </button>
                            </div>
                        </div>

                        <Separator />

                        {/* Form fields */}
                        <div className="grid grid-cols-2 gap-[0.75rem]">
                            <div className="space-y-[0.375rem]">
                                <Label htmlFor="firstName" className="text-[0.75rem]">
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    value={profileData.firstName}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, firstName: e.target.value })
                                    }
                                    className="h-[2.25rem] text-[0.8125rem]"
                                />
                            </div>
                            <div className="space-y-[0.375rem]">
                                <Label htmlFor="lastName" className="text-[0.75rem]">
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    value={profileData.lastName}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, lastName: e.target.value })
                                    }
                                    className="h-[2.25rem] text-[0.8125rem]"
                                />
                            </div>
                        </div>

                        <div className="space-y-[0.375rem]">
                            <Label htmlFor="email" className="text-[0.75rem] flex items-center gap-[0.25rem]">
                                <Mail style={{ width: "0.75rem", height: "0.75rem" }} />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, email: e.target.value })
                                }
                                className="h-[2.25rem] text-[0.8125rem]"
                            />
                        </div>

                        <div className="space-y-[0.375rem]">
                            <Label htmlFor="company" className="text-[0.75rem] flex items-center gap-[0.25rem]">
                                <Building2 style={{ width: "0.75rem", height: "0.75rem" }} />
                                Company
                            </Label>
                            <Input
                                id="company"
                                value={profileData.company}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, company: e.target.value })
                                }
                                className="h-[2.25rem] text-[0.8125rem]"
                            />
                        </div>

                        <Separator />

                        <div className="flex justify-end gap-[0.5rem]">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setProfileOpen(false)}
                                className="text-[0.8125rem]"
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => setProfileOpen(false)}
                                className="text-[0.8125rem]"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
