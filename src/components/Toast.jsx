import { useState, useCallback, createContext, useContext } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, removing: true } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type] || Info;
          return (
            <div key={toast.id} className={`toast ${toast.type} ${toast.removing ? 'removing' : ''}`}>
              <Icon className="toast-icon" />
              <span>{toast.message}</span>
              <button
                className="toast-close"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function showToast(message, type, duration) {
  // Fallback for direct usage
  if (typeof window !== 'undefined') {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;padding:14px 20px;border-radius:14px;background:white;border-left:4px solid #3b82f6;box-shadow:0 20px 40px rgba(0,0,0,0.15);font-weight:600;font-size:14px;animation:toastSlideIn 0.3s ease-out;';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => { el.style.animation = 'toastSlideOut 0.3s ease-in forwards'; setTimeout(() => el.remove(), 300); }, 3000);
  }
}