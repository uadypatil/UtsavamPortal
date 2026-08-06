import { useCallback, useEffect, useRef, useState } from "react";
import ConfirmContext from './ConfirmDialogContext';
import { Button, Modal } from "react-bootstrap";
const DEFAULT_OPTIONS = {
  title: "Are you sure?",
  message: "This action cannot be undone.",
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "danger",

  // Optional
  backdrop: true,
  keyboard: true,
  centered: true,
};

export function ConfirmDialogProvider({ children }) {
  const [options, setOptions] = useState(null);
  const resolverRef = useRef(null);

  const closeDialog = useCallback((result) => {
    const resolve = resolverRef.current;

    resolverRef.current = null;
    setOptions(null);

    if (resolve) {
      resolve(result);
    }
  }, []);

  const confirm = useCallback((opts = {}) => {
    // Close any previously pending dialog
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }

    setOptions({
      ...DEFAULT_OPTIONS,
      ...opts,
    });

    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  // Cleanup if provider unmounts
  useEffect(() => {
    return () => {
      if (resolverRef.current) {
        resolverRef.current(false);
        resolverRef.current = null;
      }
    };
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <Modal
        show={Boolean(options)}
        centered={options?.centered}
        backdrop={options?.backdrop}
        keyboard={options?.keyboard}
        onHide={() => closeDialog(false)}
        className="ep-glass-modal"
      >
        {options && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{options.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>{options.message}</Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => closeDialog(false)}
              >
                {options.cancelText}
              </Button>

              <Button
                variant={options.variant}
                onClick={() => closeDialog(true)}
              >
                {options.confirmText}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </ConfirmContext.Provider>
  );
}