import { useState, useEffect } from "react";

export default function MobileNotice() {
  const [isMobile, setIsMobile] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const checkMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);

  if (!isMobile || hide) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#222] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in z-50">
      <p className="text-sm leading-tight">
        <strong>Mobile Users:</strong> Best experience ke liye 
        <em> "Desktop Site"</em> enable karein.
      </p>

      {/* Close Button */}
      <button
        onClick={() => setHide(true)}
        className="text-white/70 hover:text-white font-bold text-lg"
      >
        ✕
      </button>
    </div>
  );
}
