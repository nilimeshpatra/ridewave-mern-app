import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MapPin, History, Car, Bike, LayoutDashboard, TrendingUp, Clock, Star, Zap, User } from "lucide-react";
import api from "../services/api";
const StatCard = ({ icon: Icon, label, value, color = "var(--brand)" }) => (
  <div className="rw-card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
    <div style={{ background: `${color}18`, borderRadius: "10px", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={20} color={color} />
    </div>
    <div>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
      <p style={{ color: "var(--text-primary)", fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.5px" }}>{value}</p>
    </div>
  </div>
);
const ActionCard = ({ to, icon: Icon, label, desc, accent = false }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <div className="rw-card" style={{ padding: "24px", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", background: accent ? "var(--brand)" : "var(--bg-card)", border: accent ? "none" : "1px solid var(--border)" }}
      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
      onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}>
      <div style={{ background: accent ? "rgba(0,0,0,0.12)" : "var(--brand-light)", borderRadius: "10px", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
        <Icon size={22} color={accent ? "#0F172A" : "var(--brand)"} />
      </div>
      <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: accent ? "#0F172A" : "var(--text-primary)", marginBottom: "4px" }}>{label}</h3>
      <p style={{ fontSize: "0.85rem", color: accent ? "rgba(0,0,0,0.6)" : "var(--text-secondary)" }}>{desc}</p>
    </div>
  </Link>
);
const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({ total: 0, completed: 0, available: 0 });
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.role === "passenger") {
          const { data } = await api.get("/rides/my-rides");
          setStats({ total: data.length, completed: data.filter(r => r.status === "completed").length, available: 0 });
        } else {
          const { data } = await api.get("/rides/available");
          setStats({ total: 0, completed: 0, available: data.length });
        }
      } catch { }
    };
    fetchStats();
  }, [user]);
  const memberSince = new Date(user?.createdAt || Date.now()).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", padding: "40px 24px 48px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ color: "var(--brand)", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>Dashboard</p>
          <h1 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: "2rem", letterSpacing: "-0.5px", marginBottom: "6px" }}>Good to see you, {user?.name?.split(" ")[0]}</h1>
          <p style={{ color: "#64748B", fontSize: "0.9rem" }}>Member since {memberSince} · <span style={{ color: "#94A3B8", textTransform: "capitalize" }}>{user?.role}</span> account</p>
        </div>
      </div>
      <div style={{ maxWidth: "1000px", margin: "-24px auto 0", padding: "0 24px 40px" }}>
        {user?.role === "passenger" && (<>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
            <StatCard icon={Car} label="Total Rides" value={stats.total} color="var(--brand)" />
            <StatCard icon={TrendingUp} label="Completed" value={stats.completed} color="#10B981" />
            <StatCard icon={Clock} label="Member Since" value={memberSince} color="#3B82F6" />
          </div>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>Quick Actions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
            <ActionCard to="/book" icon={MapPin} label="Book a Ride" desc="Find a driver near you instantly" accent={true} />
            <ActionCard to="/my-rides" icon={History} label="Ride History" desc="View all your past rides" />
            <ActionCard to="/profile" icon={User} label="Your Profile" desc="Manage account details" />
          </div>
        </>)}
        {user?.role === "driver" && (<>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
            <StatCard icon={Zap} label="Available Rides" value={stats.available} color="var(--brand)" />
            <StatCard icon={TrendingUp} label="Completed Today" value="—" color="#10B981" />
            <StatCard icon={Star} label="Your Rating" value="—" color="#F59E0B" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <ActionCard to="/driver" icon={LayoutDashboard} label="Driver Dashboard" desc="View and accept incoming ride requests" accent={true} />
            <ActionCard to="/profile" icon={User} label="Your Profile" desc="Manage your driver account" />
          </div>
        </>)}
      </div>
    </div>
  );
};
export default Dashboard;
