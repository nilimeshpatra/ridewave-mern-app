import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearError } from "../redux/authSlice";
import { Car, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { useToast } from "../context/ToastContext";
const FIELD_ICONS = { name: User, email: Mail, password: Lock, phone: Phone };
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "passenger" });
  useEffect(() => { if (user) navigate("/"); }, [user, navigate]);
  useEffect(() => { if (error) { toast(error, "error"); dispatch(clearError()); } }, [error]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast("Password must be at least 6 characters", "error");
    dispatch(registerUser(form));
  };
  const fields = [
    { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
    { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
    { label: "Password", key: "password", type: "password", placeholder: "Min. 6 characters" },
    { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 99999 99999" },
  ];
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)", display: "flex" }}>
      <div style={{ flex: 1, background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "300px", height: "300px", background: "rgba(245,158,11,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: "360px" }}>
          <div style={{ background: "var(--brand)", borderRadius: "16px", width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Car size={32} color="#0F172A" />
          </div>
          <h1 style={{ color: "#FFFFFF", fontWeight: 800, fontSize: "2.25rem", letterSpacing: "-1px", marginBottom: "12px" }}>Join <span style={{ color: "var(--brand)" }}>RideWave</span></h1>
          <p style={{ color: "#94A3B8", fontSize: "1rem", lineHeight: 1.6 }}>Whether you need a ride or want to earn by driving — RideWave has a place for you.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "32px" }}>
            {["Sign up in under 2 minutes", "No hidden fees or surge charges", "24/7 ride availability"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--brand)", flexShrink: 0 }} />
                <span style={{ color: "#94A3B8", fontSize: "0.9rem" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: "480px", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "var(--bg-primary)", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <h2 style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.5px", marginBottom: "6px" }}>Create account</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "24px" }}>Fill in the details below to get started</p>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {fields.map(({ label, key, type, placeholder }) => {
              const Icon = FIELD_ICONS[key];
              return (
                <div key={key}>
                  <label className="rw-label">{label}</label>
                  <div style={{ position: "relative" }}>
                    <input type={type} placeholder={placeholder} className="rw-input" style={{ paddingLeft: "40px" }} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
                    <Icon size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  </div>
                </div>
              );
            })}
            <div>
              <label className="rw-label">I am signing up as</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[{ value: "passenger", label: "Passenger", desc: "Book rides" }, { value: "driver", label: "Driver", desc: "Earn by driving" }].map(({ value, label, desc }) => (
                  <button key={value} type="button" onClick={() => setForm({ ...form, role: value })}
                    style={{ padding: "12px", borderRadius: "10px", cursor: "pointer", textAlign: "left", fontFamily: "Inter, sans-serif", background: form.role === value ? "var(--brand-light)" : "var(--bg-secondary)", border: form.role === value ? "2px solid var(--brand)" : "2px solid var(--border)" }}>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", color: form.role === value ? "var(--brand-dark)" : "var(--text-primary)" }}>{label}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>{desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="rw-btn-primary" disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px" }}>
              {loading ? "Creating account..." : (<>Create Account <ArrowRight size={16} /></>)}
            </button>
          </form>
          <p style={{ color: "var(--text-secondary)", textAlign: "center", marginTop: "20px", fontSize: "0.875rem" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
