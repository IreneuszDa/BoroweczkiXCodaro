"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet default icon fix for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const redIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function LeafletMap({ units, incidents }: { units: any; incidents: any }) {
    // Center at Tatra Mountains (Kasprowy Wierch/Zakopane general area)
    const center: [number, number] = [49.232, 19.982];

    return (
        <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%", zIndex: 1 }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Incidents -> Red */}
            {incidents?.filter((i: any) => i.status === "active").map((inc: any) => (
                <Marker
                    key={inc._id}
                    position={[inc.location.lat, inc.location.lng]}
                    icon={redIcon}
                >
                    <Popup>
                        <div className="font-sans">
                            <h4 className="font-bold text-red-600 mb-[0.25rem]">{inc.title}</h4>
                            <p className="text-[0.75rem] m-0">Typ: <b>{inc.type}</b></p>
                            <p className="text-[0.75rem] m-0 text-muted-foreground">{inc.description}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Units -> Blue */}
            {units?.filter((u: any) => u.status !== "maintenance").map((u: any) => (
                <Marker
                    key={u._id}
                    position={[u.location.lat, u.location.lng]}
                    icon={blueIcon}
                >
                    <Popup>
                        <div className="font-sans">
                            <h4 className="font-bold text-blue-600 mb-[0.25rem]">{u.name}</h4>
                            <p className="text-[0.75rem] m-0">Pojazd: <b>{u.type}</b></p>
                            <p className="text-[0.75rem] m-0">Status: {u.status}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
