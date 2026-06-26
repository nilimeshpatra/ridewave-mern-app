import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, clearError } from "../redux/authSlice";
import { Car, Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "../context/ToastContext";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  useEffect(() => { if (user) navigate("/"); }, [user, navigate]);
  useEffect(() => { if (error) { toast(error, "error"); dispatch(clearError()); } }, [error]);
  const handleSubmit = (e) => { e.preventDefault(); dispatch(loginUser(form)); };
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)", display: "flex" }}>
      <div style={{ flex: 1, background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "300px", height: "300px", background: "rgba(245,158,11,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: "250px", height: "250px", background: "rgba(245,158,11,0.05)", borderRadius: "50%" }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: "360px" }}>
          <div style={{ background: "var(--brand)", borderRadius: "16px", width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Car size={32} color="#0F172A" />
          </div>
          <h1 style={{ color: "#FFFFFF", fontWeight: 800, fontSize: "2.25rem", letterSpacing: "-1px", marginBottom: "12px" }}>Ride<span style={{ color: "var(--brand)" }}>Wave</span></h1>
          <p style={{ color: "#94A3B8", fontSize: "1rem", lineHeight: 1.6 }}>Connect with drivers near you and get to your destination fast, safe, and affordably.</p>
          <div style={{ display: "flex", gap: "24px", marginTop: "40px", justifyContent: "center" }}>
            {[["10k+", "Active Riders"], ["500+", "Drivers"], ["4.8★", "Avg Rating"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <p style={{ color: "var(--brand)", fontWeight: 800, fontSize: "1.25rem" }}>{val}</p>
                <p style={{ color: "#64748B", fontSize: "0.75rem" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: "440px", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "var(--bg-primary)" }}>
        <div style={{ width: "100%", maxWidth: "360px" }}>
          <h2 style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.5px", marginBottom: "6px" }}>Welcome back</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "28px" }}>Sign in to your account to continue</p>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[{ label: "Email address", key: "email", type: "email", ph: "you@example.com", Icon: Mail }, { label: "Password", key: "password", type: "password", ph: "Enter your password", Icon: Lock }].map(({ label, key, type, ph, Icon }) => (
              <div key={key}>
                <label className="rw-label">{label}</label>
                <div style={{ position: "relative" }}>
                  <input type={type} placeholder={ph} className="rw-input" style={{ paddingLeft: "40px" }} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
                  <Icon size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                </div>
              </div>
            ))}
            <button type="submit" className="rw-btn-primary" disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px" }}>
              {loading ? "Signing in..." : (<>Sign In <ArrowRight size={16} /></>)}
            </button>
          </form>
          <p style={{ color: "var(--text-secondary)", textAlign: "center", marginTop: "20px", fontSize: "0.875rem" }}>
            Don't have an account? <Link to="/register" style={{ color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
