"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Thermometer, Wind, CloudFog, Snowflake, X } from "lucide-react";

export function SalesFunnel() {
    const weather = useQuery(api.weather.getLatest);
    const [isWindMapOpen, setIsWindMapOpen] = useState(false);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col p-[1.25rem] bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-border/80 transition-all font-sans"
            >
                <div className="flex items-center justify-between mb-[1.5rem]">
                    <div>
                        <h3 className="text-[0.875rem] font-semibold text-foreground flex items-center gap-[0.5rem]">
                            <CloudFog className="w-[1rem] h-[1rem] text-muted-foreground" />
                            Telemetria Pogodowa
                        </h3>
                        <p className="text-[0.75rem] text-muted-foreground mt-[0.125rem]">Pobrano ze stacji meteo TOPR</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-[1.5rem]">
                    {weather ? (
                        <>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Thermometer className="w-5 h-5 text-blue-500" />
                                    <span className="text-[0.8125rem] font-medium text-foreground">Temperatura</span>
                                </div>
                                <span className="text-[1.125rem] font-bold text-foreground">{weather.temperature}°C</span>
                            </div>

                            <div
                                onClick={() => setIsWindMapOpen(true)}
                                className="flex items-center justify-between p-3 rounded-lg bg-teal-500/5 hover:bg-teal-500/15 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <Wind className="w-5 h-5 text-teal-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-[0.8125rem] font-medium text-foreground">Wiatr <span className="text-[0.625rem] text-teal-600 bg-teal-500/10 px-1 py-0.5 rounded ml-1 group-hover:bg-teal-500/20">Mapa Live</span></span>
                                </div>
                                <span className="text-[1.125rem] font-bold text-foreground">{weather.windSpeed} km/h</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <CloudFog className="w-5 h-5 text-indigo-500" />
                                    <span className="text-[0.8125rem] font-medium text-foreground">Widoczność</span>
                                </div>
                                <span className="text-[1.125rem] font-bold text-foreground">{weather.visibility} m</span>
                            </div>

                            <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${weather.avalancheRisk >= 3 ? 'bg-red-500/10 hover:bg-red-500/15' : 'bg-orange-500/5 hover:bg-orange-500/10'}`}>
                                <div className="flex items-center gap-3">
                                    <Snowflake className={`w-5 h-5 ${weather.avalancheRisk >= 3 ? 'text-red-500' : 'text-orange-500'}`} />
                                    <span className="text-[0.8125rem] font-medium text-foreground">Zagrożenie Lawinowe</span>
                                </div>
                                <span className="text-[1.125rem] font-bold text-foreground">Stopień {weather.avalancheRisk}</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <div className="skeleton h-[12rem] w-full rounded-lg" />
                        </div>
                    )}
                </div>
            </motion.div>

            <AnimatePresence>
                {isWindMapOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-card w-full max-w-5xl h-[85vh] rounded-xl overflow-hidden flex flex-col shadow-2xl relative border border-border"
                        >
                            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30">
                                <div className="flex items-center gap-2">
                                    <Wind className="w-[1.25rem] h-[1.25rem] text-teal-500" />
                                    <h3 className="font-semibold text-foreground text-[1rem]">Radar Wiatru na Żywo (Tatry)</h3>
                                </div>
                                <button
                                    onClick={() => setIsWindMapOpen(false)}
                                    className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=10&overlay=wind&product=ecmwf&level=surface&lat=49.232&lon=19.982"
                                frameBorder="0"
                                className="flex-1 bg-muted/20"
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
