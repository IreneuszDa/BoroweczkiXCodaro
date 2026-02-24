"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, Line } from "@react-three/drei";

// Dynamic import for Leaflet map to avoid window is not defined error
const LeafletMap = dynamic(
    () => import('./leaflet-map'),
    { ssr: false, loading: () => <div className="h-full w-full flex items-center justify-center bg-muted/20 text-muted-foreground text-[0.8125rem]">Ładowanie mapy 2D OpenStreetMap...</div> }
);

export function OperationalMap() {
    const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
    const units = useQuery(api.rescueUnits.list, {});
    const incidents = useQuery(api.incidents.list, { status: "active" });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-1 lg:col-span-2 flex flex-col p-[1.25rem] bg-card rounded-xl border border-border shadow-sm overflow-hidden"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-[1.5rem] relative z-10 gap-4">
                <div>
                    <h3 className="text-[0.875rem] font-semibold text-foreground flex items-center gap-[0.5rem]">
                        <Compass className="w-[1rem] h-[1rem] text-muted-foreground" />
                        Mapa Operacyjna
                    </h3>
                    <p className="text-[0.75rem] text-muted-foreground mt-[0.25rem]">Aktualizacja satelitarna jednostek ratunkowych</p>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-[1rem]">
                    <div className="flex bg-muted p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode("3d")}
                            className={`px-[0.75rem] py-[0.25rem] text-[0.75rem] font-medium rounded-md transition-all ${viewMode === "3d" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Widok 3D
                        </button>
                        <button
                            onClick={() => setViewMode("2d")}
                            className={`px-[0.75rem] py-[0.25rem] text-[0.75rem] font-medium rounded-md transition-all ${viewMode === "2d" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Widok 2D
                        </button>
                    </div>

                    <div className="flex flex-col gap-[0.25rem] text-[0.6875rem] bg-background/80 p-[0.375rem] rounded border border-border/50 backdrop-blur-sm">
                        <div className="flex items-center gap-[0.375rem]">
                            <span className="w-[0.5rem] h-[0.5rem] bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span> Incydent (Lawina)
                        </div>
                        <div className="flex items-center gap-[0.375rem]">
                            <span className="w-[0.5rem] h-[0.5rem] bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span> Zespół Ratowniczy
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[25rem] w-full mt-auto relative z-0 bg-muted/20 rounded-lg overflow-hidden border border-border/50">
                {viewMode === "3d" ? (
                    <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />

                        {/* Dummy Mountain (Low poly) - Made it look slightly more complex */}
                        <group position={[0, -0.5, 0]}>
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                                <coneGeometry args={[4, 2.5, 12]} />
                                <meshStandardMaterial color="#e5e7eb" wireframe />
                            </mesh>
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, 0, 1]}>
                                <coneGeometry args={[2.5, 1.5, 8]} />
                                <meshStandardMaterial color="#d1d5db" wireframe />
                            </mesh>
                        </group>

                        {/* Incidents (Red) */}
                        {incidents?.filter(i => i.status === "active").map((inc, index) => (
                            <Sphere key={`inc-${index}`} args={[0.2, 16, 16]} position={[(inc.location.lng - 20) * 10, (inc.location.alt - 1500) / 500, (inc.location.lat - 49.2) * -10]}>
                                <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.5} />
                            </Sphere>
                        ))}

                        {/* Units (Blue) */}
                        {units?.filter(u => u.status === "in_action" || u.status === "at_base").map((u, index) => (
                            <group key={`u-${index}`}>
                                <Sphere args={[0.15, 16, 16]} position={[(u.location.lng - 20) * 10, (u.location.alt - 1500) / 500, (u.location.lat - 49.2) * -10]}>
                                    <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
                                </Sphere>
                                {/* Line to base or to incident */}
                                <Line
                                    points={[[0, -0.5, 0], [(u.location.lng - 20) * 10, (u.location.alt - 1500) / 500, (u.location.lat - 49.2) * -10]]}
                                    color="#3b82f6"
                                    opacity={0.3}
                                    dashSize={0.2}
                                    gapSize={0.2}
                                />
                            </group>
                        ))}

                        <OrbitControls maxPolarAngle={Math.PI / 2.1} minDistance={2} maxDistance={15} autoRotate autoRotateSpeed={0.5} />
                    </Canvas>
                ) : (
                    <LeafletMap units={units} incidents={incidents} />
                )}
            </div>
        </motion.div>
    );
}
