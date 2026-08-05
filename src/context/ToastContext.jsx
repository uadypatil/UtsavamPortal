import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ToastContainer, Toast } from 'react-bootstrap';

const ToastCtx = createContext(null);

let idCounter = 0;

const ICONS = {
    success: 'bi-check-circle-fill text-success',
    error: 'bi-x-circle-fill text-danger',
    info: 'bi-info-circle-fill text-primary',
};

/**
 * Wrap the app once (see App.jsx) to enable `useToast()` anywhere.
 * Usage: const toast = useToast(); toast.success('Saved!');
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback((variant, message, options = {}) => {
        const id = ++idCounter;
        const duration = options.duration ?? 3500;
        setToasts((prev) => [...prev, { id, variant, message }]);
        if (duration !== 0) {
            setTimeout(() => dismiss(id), duration);
        }
        return id;
    }, [dismiss]);

    const api = useMemo(() => ({
        success: (msg, opts) => push('success', msg, opts),
        error: (msg, opts) => push('error', msg, opts),
        info: (msg, opts) => push('info', msg, opts),
        dismiss,
    }), [push, dismiss]);

    return (
        <ToastCtx.Provider value={api}>
            {children}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 2000, position: 'fixed' }}>
                {toasts.map((t) => (
                    <Toast key={t.id} className={`ep-toast ep-toast--${t.variant}`} onClose={() => dismiss(t.id)}>
                        <Toast.Body>
                            <i className={`bi ${ICONS[t.variant] || ICONS.info}`}></i>
                            <span>{t.message}</span>
                        </Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </ToastCtx.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastCtx);
    if (!ctx) {
        // Fail soft rather than crash the page if a component renders outside the provider.
        return { success: () => {}, error: () => {}, info: () => {}, dismiss: () => {} };
    }
    return ctx;
}
