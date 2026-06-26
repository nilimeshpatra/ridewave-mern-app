import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookRide } from "../redux/rideSlice";
import { useNavigate } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import PlacesAutocomplete from "../components/PlacesAutocomplete";
import { useToast } from "../context/ToastContext";
import { Bike, Car, CheckCircle, CreditCard, Banknote, Navigation } from "lucide-react";
const RIDE_TYPES = [
  { type: "bike", label: "Bike", Icon: Bike, desc: "Fastest & cheapest", base: 20, per: 8 },
  { type: "auto", label: "Auto", Icon: Car, desc: "Comfortable ride", base: 30, per: 12 },
  { type: "car", label: "Car", Icon: Car, desc: "Premium experience", base: 50, per: 18 },
];
const getDistance = (p, d) => {
  const dLat = ((d.lat - p.lat) * Math.PI) / 180, dLon = ((d.lng - p.lng) * Math.PI) / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos((p.lat*Math.PI)/180)*Math.cos((d.lat*Math.PI)/180)*Math.sin(dLon/2)**2;
  return Math.round(6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))*10)/10;
};
const BookRide = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, currentRide } = useSelector((state) => state.ride);
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [rideType, setRideType] = useState("car");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [booked, setBooked] = useState(false);
  const selected = RIDE_TYPES.find(r => r.type === rideType);
  const distance = pickup && dropoff ? getDistance(pickup, dropoff) : 0;
  const fare = distance ? Math.round(selected.base + selected.per * distance) : 0;
  const handleSubmit = async () => {
    if (!pickup) return toast("Please select a pickup location", "error");
    if (!dropoff) return toast("Please select a dropoff location", "error");
    if (distance < 0.1) return toast("Pickup and dropoff are too close", "error");
    const result = await dispatch(bookRide({ pickupLocation: pickup, dropoffLocation: dropoff, distance, rideType, paymentMethod }));
    if (result.meta.requestStatus === "fulfilled") { toast("Ride booked successfully!", "success"); setBooked(true); }
    else toast(result.payload || "Failed to book ride", "error");
  };
  if (booked && currentRide) return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div className="rw-card" style={{ padding: "2.5rem", maxWidth: "440px", width: "100%", textAlign: "center" }}>
        <div style={{ width: "64px", height: "64px", background: "#DCFCE7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <CheckCircle size={32} color="#10B981" />
        </div>
        <h2 style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.5rem", marginBottom: "6px" }}>Ride Booked!</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.9rem" }}>We're connecting you with a nearby driver.</p>
        <div style={{ background: "var(--bg-secondary)", borderRadius: "12px", padding: "16px", textAlign: "left", marginBottom: "20px" }}>
          {[["From", currentRide.pickupLocation.address], ["To", currentRide.dropoffLocation.address], ["Distance", `${currentRide.distance} km`], ["Ride Type", currentRide.rideType], ["Payment", currentRide.paymentMethod]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{k}</span>
              <span style={{ color: "var(--text-primary)", fontSize: "0.85rem", fontWeight: 500, maxWidth: "60%", textAlign: "right", textTransform: "capitalize" }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 600 }}>Estimated Fare</span>
            <span style={{ color: "var(--brand)", fontSize: "1.25rem", fontWeight: 800 }}>₹{currentRide.fare}</span>
          </div>
        </div>
        <button className="rw-btn-primary" onClick={() => navigate("/my-rides")} style={{ width: "100%" }}>View My Rides</button>
      </div>
    </div>
  );
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
      <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)", padding: "16px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.5px" }}>Book a Ride</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Enter your pickup and dropoff to get started</p>
        </div>
      </div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "400px 1fr", gap: "20px", alignItems: "start" }}>
        <div className="rw-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ background: "var(--bg-secondary)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label className="rw-label">Pickup</label>
              <PlacesAutocomplete placeholder="Search pickup location..." onPlaceSelect={setPickup} isPickup={true} />
              {pickup && <p style={{ color: "var(--success)", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><CheckCircle size={12} /> {pickup.address}</p>}
            </div>
            <div>
              <label className="rw-label">Dropoff</label>
              <PlacesAutocomplete placeholder="Search dropoff location..." onPlaceSelect={setDropoff} isPickup={false} />
              {dropoff && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><CheckCircle size={12} /> {dropoff.address}</p>}
            </div>
          </div>
          <div>
            <label className="rw-label">Ride Type</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
              {RIDE_TYPES.map(({ type, label, Icon, desc, base, per }) => (
                <button key={type} type="button" onClick={() => setRideType(type)}
                  style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 14px", borderRadius: "10px", cursor: "pointer", fontFamily: "Inter, sans-serif", textAlign: "left", background: rideType === type ? "var(--brand-light)" : "var(--bg-secondary)", border: rideType === type ? "2px solid var(--brand)" : "2px solid transparent" }}>
                  <div style={{ background: rideType === type ? "var(--brand)" : "var(--border)", borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={rideType === type ? "#0F172A" : "var(--text-secondary)"} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{label}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{desc}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", color: rideType === type ? "var(--brand-dark)" : "var(--text-primary)" }}>{distance ? `₹${Math.round(base + per * distance)}` : `₹${base}+`}</p>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>₹{per}/km</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="rw-label">Payment Method</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "6px" }}>
              {[{ val: "cash", label: "Cash", Icon: Banknote }, { val: "online", label: "Online", Icon: CreditCard }].map(({ val, label, Icon }) => (
                <button key={val} type="button" onClick={() => setPaymentMethod(val)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 14px", borderRadius: "10px", cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.875rem", background: paymentMethod === val ? "var(--brand-light)" : "var(--bg-secondary)", border: paymentMethod === val ? "2px solid var(--brand)" : "2px solid transparent", color: paymentMethod === val ? "var(--brand-dark)" : "var(--text-primary)" }}>
                  <Icon size={16} />{label}
                </button>
              ))}
            </div>
          </div>
          {fare > 0 && (
            <div style={{ background: "var(--brand-light)", borderRadius: "10px", padding: "14px 16px", borderLeft: "4px solid var(--brand)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Distance</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.85rem" }}>{distance} km</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Estimated Fare</span>
                <span style={{ color: "var(--brand-dark)", fontWeight: 800, fontSize: "1.25rem" }}>₹{fare}</span>
              </div>
            </div>
          )}
          <button className="rw-btn-primary" onClick={handleSubmit} disabled={loading || !pickup || !dropoff} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Navigation size={16} />{loading ? "Booking..." : "Book Now"}
          </button>
        </div>
        <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border)", height: "600px", position: "sticky", top: "80px", boxShadow: "var(--shadow-sm)" }}>
          <MapComponent pickupCoords={pickup} dropoffCoords={dropoff} height="100%" />
        </div>
      </div>
    </div>
  );
};
export default BookRide;
