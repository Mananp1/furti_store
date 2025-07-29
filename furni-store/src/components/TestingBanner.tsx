import { AlertTriangle, X } from "lucide-react";
import { useState, useEffect } from "react";

// To reset the banner for testing, run in browser console:
// localStorage.removeItem("testing-banner-dismissed"); window.location.reload();

export const TestingBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem("testing-banner-dismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("testing-banner-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="bg-black text-white py-3 px-4 text-center text-sm font-medium relative">
      <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto">
        <AlertTriangle className="h-4 w-4 text-yellow-400" />
        <span className="flex-1">
          🚧 <strong>TESTING PHASE</strong> - This is a demo site for
          development purposes only. No real transactions will be processed. 🚧
        </span>
        <AlertTriangle className="h-4 w-4 text-yellow-400" />
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
        aria-label="Dismiss testing banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
