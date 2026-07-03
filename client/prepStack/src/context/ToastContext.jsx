import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

const DURATION  = 4000;   
const EXIT_MS   = 260;    
const MAX_STACK = 5;      

const TYPE_CONFIG = {
  success: {
    Icon:      FaCheckCircle,
    iconCls:   "text-emerald-400",
    barColor:  "#34d399",
    border:    "border-emerald-500/25",
    glow:      "0 8px 32px rgba(16,185,129,0.15)",
  },
  error: {
    Icon:      FaExclamationCircle,
    iconCls:   "text-red-400",
    barColor:  "#f87171",
    border:    "border-red-500/25",
    glow:      "0 8px 32px rgba(239,68,68,0.15)",
  },
  warning: {
    Icon:      FaExclamationTriangle,
    iconCls:   "text-amber-400",
    barColor:  "#fbbf24",
    border:    "border-amber-500/25",
    glow:      "0 8px 32px rgba(245,158,11,0.15)",
  },
  info: {
    Icon:      FaInfoCircle,
    iconCls:   "text-blue-400",
    barColor:  "#60a5fa",
    border:    "border-blue-500/25",
    glow:      "0 8px 32px rgba(59,130,246,0.15)",
  },
};

const GLOBAL_STYLES = `
  @keyframes toast-shrink {
    from { transform: scaleX(1); }
    to   { transform: scaleX(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .toast-item {
      transition: opacity ${EXIT_MS}ms ease !important;
      transform: none !important;
    }
  }
`;

const ToastItem = ({ toast, onRemove }) => {
  const [phase,  setPhase]  = useState("entering");
  const [paused, setPaused] = useState(false);

  const timerRef     = useRef(null);
  const startRef     = useRef(null);   
  const remainingRef = useRef(DURATION); 

  const dismiss = useCallback(() => {
    clearTimeout(timerRef.current);
    setPhase("exiting");
    setTimeout(() => onRemove(toast.id), EXIT_MS);
  }, [toast.id, onRemove]);

  useEffect(() => {
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => setPhase("visible"));
      return () => cancelAnimationFrame(r2);
    });
    return () => cancelAnimationFrame(r1);
  }, []);

  useEffect(() => {
    if (phase !== "visible") return;

    if (paused) {
      clearTimeout(timerRef.current);
      if (startRef.current !== null) {
        remainingRef.current -= Date.now() - startRef.current;
        remainingRef.current  = Math.max(0, remainingRef.current);
        startRef.current      = null;
      }
    } else {
      startRef.current  = Date.now();
      timerRef.current  = setTimeout(dismiss, remainingRef.current);
    }

    return () => clearTimeout(timerRef.current);
  }, [paused, dismiss, phase]);

  const cfg       = TYPE_CONFIG[toast.type] ?? TYPE_CONFIG.success;
  const isVisible = phase === "visible";
  const isExiting = phase === "exiting";

  const motionStyle = {
    transform: isVisible
      ? "translateX(0) scale(1)"
      : "translateX(115%) scale(0.92)",
    opacity: isVisible ? 1 : 0,
    transition: isExiting
      ? `transform ${EXIT_MS}ms ease-in, opacity ${EXIT_MS}ms ease-in`
      : "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 260ms ease-out",
    boxShadow: cfg.glow,
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={motionStyle}
      className={`toast-item relative flex items-center gap-3 px-4 py-3.5
        rounded-xl border backdrop-blur-xl
        bg-[#0c1628]/95 text-white font-medium
        min-w-[300px] max-w-[400px] overflow-hidden h-8
        cursor-default select-none
        ${cfg.border}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <cfg.Icon className={`${cfg.iconCls} text-[18px] shrink-0`} />

      <span className="flex-1 text-[14px] leading-snug text-slate-200">
        {toast.message}
      </span>

      {/* Dismiss button */}
      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="shrink-0 p-2 rounded-lg text-slate-500 items-center
          hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <FaTimes className="text-[15px]" />
      </button>

      {/* Progress bar — CSS animation, pauses on hover via animation-play-state */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left rounded-full"
        style={{
          backgroundColor:    cfg.barColor,
          animation:          `toast-shrink ${DURATION}ms linear forwards`,
          animationPlayState: paused ? "paused" : "running",
        }}
      />
    </div>
  );
};

//  Context & Provider 

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).slice(2, 11);
    setToasts((prev) => {
      const next = [...prev, { id, message, type }];
      return next.length > MAX_STACK ? next.slice(next.length - MAX_STACK) : next;
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <style>{GLOBAL_STYLES}</style>

      {children}

      <div
        role="region"
        aria-label="Notifications"
        className="fixed top-16 right-6 z-[200] flex flex-col gap-2.5 pointer-events-none"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

//  Hook 

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};
