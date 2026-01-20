import { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface DetailsProps {
  buttonText: string;
  children: ReactNode;
}

export default function Details({ buttonText, children }: DetailsProps) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Update height for animation
  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0);
    }
  }, [open, children]);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="details-button"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "14px",
          fontWeight: "700",
          marginBottom: "10px",
          color: "#555",
        }}
        aria-expanded={open}
      >
        {buttonText}
        <ChevronDown
          size={16}
          style={{
            transition: "transform 0.3s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <div
        ref={contentRef}
        style={{
          overflow: "hidden",
          maxHeight: `${height}px`,
          transition: "max-height 0.3s ease, opacity 0.3s ease",
          opacity: open ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
