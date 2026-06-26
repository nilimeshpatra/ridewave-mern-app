import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { Car, MapPin, History, LayoutDashboard, User, LogOut } from "lucide-react";
const NavLink = ({ to, icon: Icon, label, active }) => (
  <Link to={to} style={{ display: "flex", alignItems: "center", gap: "6px", color: active ? "var(--brand)" : "var(--text-secondary)", fontWeight: active ? 600 : 500, fontSize: "0.9rem", textDecoration: "none", padding: "6px 10px", borderRadius: "8px", transition: "color 0.15s, background 0.15s", background: active ? "var(--brand-light)" : "transparent" }}>
    <Icon size={16} />{label}
  </Link>
);
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const handleLogout = () => { dispatch(logout()); navigate("/login"); };
  const path = location.pathname;
  return (
    <nav style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100, boxShadow: "var(--shadow-sm)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{ background: "var(--brand)", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Car size={18} color="#0F172A" />
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--text-primary)", letterSpacing: "-0.5px" }}>Ride<span style={{ color: "var(--brand)" }}>Wave</span></span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {user?.role === "passenger" && (<><NavLink to="/book" icon={MapPin} label="Book Ride" active={path === "/book"} /><NavLink to="/my-rides" icon={History} label="My Rides" active={path === "/my-rides"} /></>)}
          {user?.role === "driver" && (<NavLink to="/driver" icon={LayoutDashboard} label="Dashboard" active={path === "/driver"} />)}
          <NavLink to="/profile" icon={User} label="Profile" active={path === "/profile"} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2 }}>{user?.name}</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.2, textTransform: "capitalize" }}>{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="rw-btn-secondary" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "0.875rem" }}>
            <LogOut size={15} />Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
