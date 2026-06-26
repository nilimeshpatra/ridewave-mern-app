import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAvailableRides } from "../redux/rideSlice";
import { useToast } from "../context/ToastContext";
import api from "../services/api";
import { MapPin, Navigation, Car, Bike, RefreshCw, CheckCircle, Phone, User, Zap, Clock } from "lucide-react";
const RIDE_ICONS = { bike: Bike, auto: Car, car: Car };
const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { availableRides, loading } = useSelector((state) => state.ride);
  const [actionLoading, setActionLoading] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const refresh = useCallback(() => { dispatch(getAvailableRides()); setLastRefresh(new Date()); }, [dispatch]);
  useEffect(() => { refresh(); const i = setInterval(refresh, 30000); return () => clearInterval(i); }, [refresh]);
  const handleAccept = async (rideId) => {
    setActionLoading(rideId + "accept");
    try { await api.put(`/rides/${rideId}/accept`); toast("Ride accepted!", "success"); refresh(); }
    catch (e) { toast(e?.response?.data?.message || "Could not accept", "error"); }
    setActionLoading(null);
  };
  const handleComplete = async (rideId) => {
    setActionLoading(rideId + "complete");
    try { await api.put(`/rides/${rideId}/complete`); toast("Ride completed!", "success"); refresh(); }
    catch (e) { toast(e?.response?.data?.message || "Could not complete", "error"); }
    setActionLoading(null);
  };
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
      <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)", padding: "20px 24px" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
              <h1 style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.5px" }}>Driver Dashboard</h1>
              <span style={{ background: "#D1FAE5", color: "#059669", fontSize: "0.72rem", fontWeight: 700, padding: "3px 8px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "6px", height: "6px", background: "#10B981", borderRadius: "50%", display: "inline-block" }} />Online
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>{availableRides.length} ride{availableRides.length !== 1 ? "s" : ""} available · Updated {lastRefresh.toLocaleTimeString()}</p>
          </div>
          <button className="rw-btn-secondary" onClick={refresh} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}><RefreshCw size={14} /> Refresh</button>
        </div>
      </div>
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
          {[{ label: "Available", value: availableRides.length, icon: Zap, color: "var(--brand)" }, { label: "Today's Rides", value: "—", icon: Car, color: "#10B981" }, { label: "Auto-refresh", value: "30s", icon: Clock, color: "#3B82F6" }].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rw-card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ background: `${color}18`, borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={18} color={color} /></div>
              <div>
                <p style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.1rem" }}>{value}</p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: 600 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[1,2].map(i => <div key={i} className="rw-card" style={{ height: "180px", opacity: 0.5 }} />)}
          </div>
        ) : availableRides.length === 0 ? (
          <div className="rw-card" style={{ padding: "56px 24px", textAlign: "center" }}>
            <div style={{ width: "56px", height: "56px", background: "var(--bg-secondary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Car size={24} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "6px" }}>No ride requests</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.875rem" }}>Auto-refreshing every 30 seconds. New requests appear here automatically.</p>
            <button className="rw-btn-secondary" onClick={refresh} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><RefreshCw size={14} /> Check Now</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {availableRides.map((ride) => {
              const RideIcon = RIDE_ICONS[ride.rideType] || Car;
              return (
                <div key={ride._id} className="rw-card" style={{ padding: "20px", borderLeft: "4px solid var(--brand)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ background: "var(--brand-light)", borderRadius: "10px", width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <RideIcon size={20} color="var(--brand-dark)" />
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", textTransform: "capitalize" }}>{ride.rideType} Ride</p>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{ride.distance} km · {ride.paymentMethod}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 800, fontSize: "1.4rem", color: "var(--text-primary)", letterSpacing: "-0.5px" }}>₹{ride.fare}</p>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Estimated fare</p>
                    </div>
                  </div>
                  {ride.passenger && (
                    <div style={{ background: "var(--bg-secondary)", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "32px", height: "32px", background: "var(--border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><User size={16} color="var(--text-secondary)" /></div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{ride.passenger.name}</p>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "4px" }}><Phone size={11} /> {ride.passenger.phone}</p>
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <button className="rw-btn-primary" onClick={() => handleAccept(ride._id)} disabled={!!actionLoading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      {actionLoading === ride._id + "accept" ? "Accepting..." : (<><CheckCircle size={15} /> Accept</>)}
                    </button>
                    <button className="rw-btn-secondary" onClick={() => handleComplete(ride._id)} disabled={!!actionLoading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", borderColor: "#10B981", color: "#059669" }}>
                      {actionLoading === ride._id + "complete" ? "Completing..." : (<><CheckCircle size={15} /> Complete</>)}
                    </button>
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
export default DriverDashboard;
