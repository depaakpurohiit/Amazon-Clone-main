"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";

// Fix for missing marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface ProfileMapComponentProps {
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  onSave: (address: string, lat: number, lng: number) => void;
}

function LocationMarker({ position, setPosition, setAddress, setSearchQuery }: { position: L.LatLng | null, setPosition: (pos: L.LatLng) => void, setAddress: (addr: string) => void, setSearchQuery: (q: string) => void }) {
  useMapEvents({
    async click(e) {
      setPosition(e.latlng);
      try {
        const res = await fetch(`https://api.stadiamaps.com/geocoding/v1/reverse?point.lat=${e.latlng.lat}&point.lon=${e.latlng.lng}&api_key=3276c59d-1bf5-416a-8df4-553916049d55`);
        const data = await res.json();
        if (data && data.features && data.features.length > 0) {
          const props = data.features[0].properties;
          setAddress(props.label || "");
          setSearchQuery(props.locality || props.name || props.label || "");
        }
      } catch (err) {
        console.error("Reverse geocoding failed", err);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
}

function MapUpdater({ position }: { position: L.LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14);
    }
  }, [position, map]);
  return null;
}

export default function ProfileMapComponent({ initialLat, initialLng, initialAddress, onSave }: ProfileMapComponentProps) {
  const defaultPosition: [number, number] = [20.5937, 78.9629]; // India
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLat && initialLng ? new L.LatLng(initialLat, initialLng) : null
  );
  const [address, setAddress] = useState(initialAddress || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://api.stadiamaps.com/geocoding/v1/search?text=${encodeURIComponent(searchQuery)}&api_key=3276c59d-1bf5-416a-8df4-553916049d55`);
      const data = await res.json();
      if (data && data.features && data.features.length > 0) {
        const feature = data.features[0];
        const lon = feature.geometry.coordinates[0];
        const lat = feature.geometry.coordinates[1];
        const label = feature.properties.label;
        const newPos = new L.LatLng(lat, lon);
        setPosition(newPos);
        setAddress(label);
        setSearchQuery("");
      } else {
        alert("Location not found. Please try another search.");
      }
    } catch (err) {
      console.error("Geocoding search failed", err);
      alert("Failed to search location.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = async () => {
    if (!position || !address.trim()) {
      alert("Please click on the map to set a location and enter an address label.");
      return;
    }
    setIsSaving(true);
    try {
      await onSave(address, position.lat, position.lng);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (e) {
      alert("Failed to save location.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Search Location
          </label>
          <div className="flex mt-2 gap-2">
            <input 
              type="text" 
              className="flex-1 p-2 border rounded-md" 
              placeholder="e.g. New Delhi, India"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} variant="secondary">
              {isSearching ? "Searching..." : "Search Map"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Delivery Address Label
          </label>
          <input 
            type="text" 
            className="mt-2 w-full p-2 border rounded-md" 
            placeholder="e.g. Home, Office, 123 Main St"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleSave} disabled={isSaving || !position || !address.trim()}>
            {isSaving ? "Saving..." : "Save Delivery Location"}
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-slate-500">Search for an area or click on the map to drop a pin for your exact delivery location.</p>
      
      <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200">
        <MapContainer 
          center={position || defaultPosition} 
          zoom={position ? 14 : 4} 
          scrollWheelZoom={true} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=3276c59d-1bf5-416a-8df4-553916049d55"
          />
          <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} setSearchQuery={setSearchQuery} />
          <MapUpdater position={position} />
        </MapContainer>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in zoom-in slide-in-from-bottom-10 duration-300 pointer-events-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            <span className="font-semibold text-lg">Location saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}
