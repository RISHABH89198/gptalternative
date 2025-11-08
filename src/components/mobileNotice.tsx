// src/components/MobileNotice.tsx
import { useEffect, useState } from "react";

export default function MobileNotice() {
  const [hide, setHide] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // close-state ko session tak yaad rakho
    const wasHidden = sessionStorage.getItem("mobileNoticeHidden") === "1";
    if (wasHidden) setHide(true);

    // simple mobile detect (UA + width)
    const uaMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(
      navigator.userAgent || ""
    );
    const smallScreen = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(uaMobile || smallScreen);
  }, []);

  if (!isMobile || hide) return null;

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 rounded-full bg-[#1f1f1f] text-white/95 border border-white/10 px-4 py-2 shadow-lg">
        <p className="text-sm leading-tight">
          <strong>Mobile Users:</strong> Best experience ke liye{" "}
          <em>"Desktop site"</em> enable karein.
        </p>
        <button
          onClick={() => {
            sessionStorage.setItem("mobileNoticeHidden", "1");
            setHide(true);
          }}
          aria-label="Close"
          className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          title="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
