import { useEffect, useRef } from "react";

const AfuChatAd = ({ className = "" }: { className?: string }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Re-trigger ad rendering if the script has already loaded
    if (adRef.current && (window as any).afuchatAds?.refresh) {
      (window as any).afuchatAds.refresh();
    }
  }, []);

  return (
    <div className={className}>
      <div
        ref={adRef}
        className="afuchat-ad"
        data-slot="beb946fc-a44f-4b3c-b573-a35a12231647"
      />
    </div>
  );
};

export default AfuChatAd;
