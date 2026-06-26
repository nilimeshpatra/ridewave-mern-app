import { useState, useEffect } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useMaps } from "../context/MapsContext";
import { Loader } from "lucide-react";
const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };
const DARK_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1e293b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#334155" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
];
const MapComponent = ({ pickupCoords, dropoffCoords, height = "100%" }) => {
  const { isLoaded } = useMaps();
  const [directions, setDirections] = useState(null);
  const [center, setCenter] = useState(INDIA_CENTER);
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const h = (e) => setIsDark(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  useEffect(() => {
    if (!isLoaded) return;
    if (pickupCoords && dropoffCoords) {
      new window.google.maps.DirectionsService().route(
        { origin: pickupCoords, destination: dropoffCoords, travelMode: window.google.maps.TravelMode.DRIVING },
        (result, status) => { if (status === "OK") { setDirections(result); setCenter(pickupCoords); } else setDirections(null); }
      );
    } else { setDirections(null); if (pickupCoords) setCenter(pickupCoords); }
  }, [isLoaded, pickupCoords, dropoffCoords]);
  useEffect(() => {
    if (!pickupCoords && navigator.geolocation)
      navigator.geolocation.getCurrentPosition((p) => setCenter({ lat: p.coords.latitude, lng: p.coords.longitude }));
  }, []);
  if (!isLoaded) return (
    <div style={{ width: "100%", height, background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-lg)", flexDirection: "column", gap: "12px" }}>
      <Loader size={24} color="var(--brand)" style={{ animation: "spin 1s linear infinite" }} />
      <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading map...</p>
    </div>
  );
  return (
    <GoogleMap mapContainerStyle={{ width: "100%", height, borderRadius: "var(--radius-lg)" }} center={center} zoom={13}
      options={{ zoomControl: true, streetViewControl: false, mapTypeControl: false, fullscreenControl: true, styles: isDark ? DARK_STYLES : [], gestureHandling: "greedy" }}>
      {pickupCoords && !directions && <Marker position={pickupCoords} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: "#10B981", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 }} />}
      {dropoffCoords && !directions && <Marker position={dropoffCoords} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: "#EF4444", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 }} />}
      {directions && <DirectionsRenderer directions={directions} options={{ polylineOptions: { strokeColor: "#F59E0B", strokeWeight: 5, strokeOpacity: 0.9 } }} />}
    </GoogleMap>
  );
};
export default MapComponent;
