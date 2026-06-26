import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyRides } from "../redux/rideSlice";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import api from "../services/api";
import { MapPin, Navigation, Car, Bike, Ban, RefreshCw, Plus, Clock, TrendingUp } from "lucide-react";
const STATUS = {
  requested:  { label: "Finding driver", color: "#D97706", bg: "#FEF3C7" },
  accepted:   { label: "Driver on the way", color: "#2563EB", bg: "#DBEAFE" },
  ongoing:    { label: "In progress", color: "#7C3AED", bg: "#EDE9FE" },
  completed:  { label: "Completed", color: "#059669", bg: "#D1FAE5" },
  cancelled:  { label: "Cancelled", color: "#DC2626", bg: "#FEE2E2" },
};
const RIDE_ICONS = { bike: Bike, auto: Car, car: Car };
const MyRides = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { rides, loading } = useSelector((state) => state.ride);
  const [cancelling, setCancelling] = useState(null);
  useEffect(() => { dispatch(getMyRides()); }, [dispatch]);
  const handleCancel = async (rideId) => {
    if (!window.confirm("Cancel this ride?")) return;
    setCancelling(rideId);
    try { await api.put(`/rides/${rideId}/cancel`); toast("Ride cancelled", "info"); dispatch(getMyRides()); }
    catch (e) { toast(e?.response?.data?.message || "Could not cancel", "error"); }
    setCancelling(null);
  };
  const completed = rides.filter(r => r.status === "completed");
  const totalSpent = completed.reduce((s, r) => s + r.fare, 0);
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
      <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)", padding: "20px 24px" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.5px" }}>My Rides</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "2px" }}>{rides.length} ride{rides.length !== 1 ? "s" : ""} total</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="rw-btn-secondary" onClick={() => dispatch(getMyRides())} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}><RefreshCw size={14} /> Refresh</button>
            <Link to="/book" style={{ textDecoration: "none" }}><button className="rw-btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}><Plus size={14} /> Book Ride</button></Link>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "24px" }}>
        {rides.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {[{ label: "Total Rides", value: rides.length, color: "var(--brand)" }, { label: "Completed", value: completed.length, color: "#10B981" }, { label: "Total Spent", value: `₹${totalSpent}`, color: "#3B82F6" }].map(({ label, value, color }) => (
              <div key={label} className="rw-card" style={{ padding: "16px", textAlign: "center" }}>
                <p style={{ color, fontWeight: 800, fontSize: "1.4rem" }}>{value}</p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
              </div>
            ))}
          </div>
        )}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[1,2,3].map(i => <div key={i} className="rw-card" style={{ height: "130px", opacity: 0.5 }} />)}
          </div>
        ) : rides.length === 0 ? (
          <div className="rw-card" style={{ padding: "56px 24px", textAlign: "center" }}>
            <div style={{ width: "56px", height: "56px", background: "var(--bg-secondary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Car size={24} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "6px" }}>No rides yet</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.9rem" }}>Book your first ride to get started</p>
            <Link to="/book" style={{ textDecoration: "none" }}><button className="rw-btn-primary">Book a Ride</button></Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {rides.map((ride) => {
              const s = STATUS[ride.status] || STATUS.requested;
              const RideIcon = RIDE_ICONS[ride.rideType] || Car;
              return (
                <div key={ride._id} className="rw-card" style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ background: "var(--bg-secondary)", borderRadius: "10px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <RideIcon size={20} color="var(--text-secondary)" />
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem", textTransform: "capitalize" }}>{ride.rideType} Ride</p>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Clock size={11} />{new Date(ride.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <span className="rw-badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px", paddingLeft: "4px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <MapPin size={14} color="#10B981" style={{ marginTop: "2px", flexShrink: 0 }} />
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.4 }}>{ride.pickupLocation.address}</p>
                    </div>
                    <div style={{ marginLeft: "6px", borderLeft: "1.5px dashed var(--border)", height: "10px" }} />
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <Navigation size={14} color="#EF4444" style={{ marginTop: "2px", flexShrink: 0 }} />
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.4 }}>{ride.dropoffLocation.address}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{ride.distance} km</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", textTransform: "capitalize" }}>{ride.paymentMethod}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {ride.status === "requested" && (
                        <button onClick={() => handleCancel(ride._id)} disabled={cancelling === ride._id}
                          style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "1.5px solid #EF4444", color: "#EF4444", borderRadius: "8px", padding: "5px 12px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                          <Ban size={13} />{cancelling === ride._id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
                      <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)" }}>₹{ride.fare}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default MyRides;
