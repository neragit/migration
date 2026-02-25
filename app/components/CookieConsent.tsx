"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // Helper to safely call gtag when it's ready
  const safeGtag = (fn: () => void, retries = 10, delay = 100) => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      fn();
    } else if (retries > 0) {
      setTimeout(() => safeGtag(fn, retries - 1, delay), delay);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("cookiesAccepted");

    if (!stored) {
      setShow(true);

      // Set GA4 default consent to denied
      safeGtag(() => {
        window.gtag!("consent", "default", {
          analytics_storage: "denied",
          ad_storage: "denied",
        });
      });
    } else {
      const isAccepted = stored === "true";
      setAccepted(isAccepted);

      if (isAccepted) {
        // Update GA4 consent to granted if previously accepted
        safeGtag(() => {
          window.gtag!("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "granted",
          });
        });
      } else {
        // Keep GA4 consent denied if previously declined
        safeGtag(() => {
          window.gtag!("consent", "update", {
            analytics_storage: "denied",
            ad_storage: "denied",
          });
        });
      }
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setAccepted(true);
    setShow(false);

    safeGtag(() => {
      window.gtag!("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
      });
    });
  };

  const decline = () => {
    localStorage.setItem("cookiesAccepted", "false");
    setAccepted(false);
    setShow(false);

    safeGtag(() => {
      window.gtag!("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      });
    });
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed bottom-5 left-5 right-5 bg-gray-700 text-white text-xs p-4 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center z-9999 gap-3">
        <div>
          <p>
            Da bi poboljšali iskustvo na ovoj stranici, koristimo kolačiće i alate za analitiku (Hotjar / Contentsquare i Google Analytics).
          </p>
          <p>
            Nastavkom pregledavanja slažete se s korištenjem kolačića. Za više informacija pročitajte 
            <a href="/privacy" className="underline ml-1 !text-xs text-blue-300">Politiku privatnosti</a>.
          </p>
        </div>

        <div className="flex gap-2 mt-2 sm:mt-0">
          <button
            onClick={accept}
            className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded text-white"
          >
            U redu
          </button>
          <button
            onClick={decline}
            className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-white"
          >
            Odbij
          </button>
        </div>
      </div>

      {/* Only load Contentsquare / Hotjar after user accepts */}
      {accepted && (
        <Script
          src="https://t.contentsquare.net/uxa/28aa38d58a541.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}