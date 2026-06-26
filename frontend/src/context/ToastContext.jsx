import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
const ToastContext = createContext(null);
const ICONS = { success: <CheckCircle size={18} color="#10B981" />, error: <XCircle size={18} color="#EF4444" />, info: <AlertCircle size={18} color="#3B82F6" /> };
const BORDERS = { success: "#10B981", error: "#EF4444", info: "#3B82F6" };
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: "var(--bg-card)", border: `1px solid var(--border)`, borderLeft: `4px solid ${BORDERS[t.type] || BORDERS.info}`, borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "var(--shadow-lg)", minWidth: "280px", maxWidth: "380px", animation: "slideIn 0.2s ease" }}>
            {ICONS[t.type]}
            <span style={{ color: "var(--text-primary)", fontSize: "0.875rem", fontWeight: 500, flex: 1 }}>{t.message}</span>
            <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}><X size={14} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
export const useToast = () => useContext(ToastContext);
