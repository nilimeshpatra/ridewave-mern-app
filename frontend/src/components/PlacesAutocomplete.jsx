import { useRef, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { useMaps } from "../context/MapsContext";
import { MapPin, Locate, Loader } from "lucide-react";
const PlacesAutocomplete = ({ placeholder, onPlaceSelect, isPickup = false }) => {
  const { isLoaded } = useMaps();
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const [locating, setLocating] = useState(false);
  const onLoad = (ac) => { autocompleteRef.current = ac; };
  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (place?.geometry) {
      const result = { address: place.formatted_address, lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
      onPlaceSelect(result);
      if (inputRef.current) inputRef.current.value = place.formatted_address;
    }
  };
  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async ({ coords: { latitude: lat, longitude: lng } }) => {
      try {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
        const data = await res.json();
        if (data.results?.[0]) {
          const address = data.results[0].formatted_address;
          onPlaceSelect({ address, lat, lng });
          if (inputRef.current) inputRef.current.value = address;
        }
      } catch { }
      setLocating(false);
    }, () => setLocating(false));
  };
  if (!isLoaded) return (
    <div style={{ position: "relative" }}>
      <input className="rw-input" placeholder={placeholder} disabled style={{ paddingLeft: "38px" }} />
      <MapPin size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
    </div>
  );
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <div style={{ position: "relative", flex: 1 }}>
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input ref={inputRef} type="text" placeholder={placeholder} className="rw-input" style={{ paddingLeft: "38px" }} />
        </Autocomplete>
        <MapPin size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: isPickup ? "var(--success)" : "#EF4444", pointerEvents: "none" }} />
      </div>
      {isPickup && (
        <button type="button" onClick={handleGeolocate} disabled={locating} title="Use my location"
          style={{ background: "var(--bg-primary)", border: "1.5px solid var(--border)", borderRadius: "10px", width: "44px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          onMouseOver={e => e.currentTarget.style.borderColor = "var(--brand)"}
          onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}>
          {locating ? <Loader size={16} color="var(--brand)" style={{ animation: "spin 1s linear infinite" }} /> : <Locate size={16} color="var(--brand)" />}
        </button>
      )}
    </div>
  );
};
export default PlacesAutocomplete;
