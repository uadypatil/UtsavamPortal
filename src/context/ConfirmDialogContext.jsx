import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmCtx = createContext(null);

const DEFAULTS = {
    title: 'Are you sure?',
    message: 'This action cannot be undone.',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger', // 'danger' | 'primary' | 'success'
};

/**
 * Wrap the app once (see App.jsx) to enable `useConfirm()` anywhere.
 * Usage:
 *   const confirm = useConfirm();
 *   const ok = await confirm({ title: 'Delete receipt?', message: '...' });
 *   if (!ok) return;
 */
export function ConfirmDialogProvider({ children }) {
    const [options, setOptions] = useState(null);
    const resolver = useRef(null);

    const confirm = useCallback((opts = {}) => {
        setOptions({ ...DEFAULTS, ...opts });
        return new Promise((resolve) => {
            resolver.current = resolve;
        });
    }, []);

    const handleClose = (result) => {
        setOptions(null);
        if (resolver.current) {
            resolver.current(result);
            resolver.current = null;
        }
    };

    return (
        <ConfirmCtx.Provider value={confirm}>
            {children}
            <Modal show={!!options} onHide={() => handleClose(false)} centered className="ep-glass-modal">
                {options && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">{options.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-secondary">{options.message}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="light" onClick={() => handleClose(false)}>
                                {options.cancelText}
                            </Button>
                            <Button variant={options.variant} onClick={() => handleClose(true)}>
                                {options.confirmText}
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </ConfirmCtx.Provider>
    );
}

export function useConfirm() {
    const ctx = useContext(ConfirmCtx);
    if (!ctx) {
        // Fail soft to window.confirm so nothing breaks if used outside the provider.
        return ({ message }) => Promise.resolve(window.confirm(message || 'Are you sure?'));
    }
    return ctx;
}
