import { useEffect, useState } from "react";

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

      setIsInstalled(standalone);
    };

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    checkInstalled();

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
    };
  }, []);

  const install = async () => {
    if (!installPrompt) {
      return {
        installed: false,
        unavailable: true,
      };
    }

    installPrompt.prompt();

    const { outcome } = await installPrompt.userChoice;

    setInstallPrompt(null);

    if (outcome === "accepted") {
      setIsInstalled(true);

      return {
        installed: true,
        unavailable: false,
      };
    }

    return {
      installed: false,
      unavailable: false,
    };
  };

  return {
    canInstall: !!installPrompt && !isInstalled,
    isInstalled,
    install,
  };
}
