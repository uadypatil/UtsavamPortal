import "./App.css";
import "./styles/ep-admin-shared.css";
import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmDialogProvider } from "./context/ConfirmDialogProvider";

function App() {
  return (
    <ToastProvider>
      <ConfirmDialogProvider>
        <AppRoutes />
      </ConfirmDialogProvider>
    </ToastProvider>
  );
}

export default App;