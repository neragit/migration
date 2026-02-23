"use client";

import gsap from "gsap";

const NEWS_IMAGES = Array.from({ length: 24 }, (_, i) => `/news-${i + 1}.png`);

const SCATTERED = [
  { left: "30%", top: "70%", rotation: 7, scale: 0.3 },
  { left: "50%", top: "55%", rotation: 4, scale: 0.3 },
  { left: "80%", top: "20%", rotation: 6, scale: 0.3 },
  { left: "75%", top: "80%", rotation: -8, scale: 0.3 },
  { left: "40%", top: "65%", rotation: 4, scale: 0.3 },
  { left: "75%", top: "60%", rotation: -7, scale: 0.3 },
  { left: "18%", top: "62%", rotation: -5, scale: 0.3 },
  { left: "5%", top: "18%", rotation: -8, scale: 0.3 },
  { left: "55%", top: "15%", rotation: 5, scale: 0.3 },
  { left: "28%", top: "13%", rotation: -3, scale: 0.3 },

  { left: "68%", top: "10%", rotation: 9, scale: 0.3 },
  { left: "42%", top: "30%", rotation: 6, scale: 0.3 },
  { left: "70%", top: "45%", rotation: 10, scale: 0.3 },
  { left: "68%", top: "65%", rotation: -7, scale: 0.3 },
  { left: "25%", top: "40%", rotation: 4, scale: 0.3 },
  { left: "2%", top: "55%", rotation: -12, scale: 0.3 },
  { left: "12%", top: "30%", rotation: -6, scale: 0.3 },
  { left: "62%", top: "30%", rotation: 7, scale: 0.3 },
  { left: "25%", top: "15%", rotation: 3, scale: 0.3 },
  { left: "45%", top: "20%", rotation: -4, scale: 0.3 },

  { left: "80%", top: "30%", rotation: 8, scale: 0.3 },
  { left: "15%", top: "50%", rotation: -9, scale: 0.3 },
  { left: "40%", top: "50%", rotation: 5, scale: 0.3 },
  { left: "60%", top: "55%", rotation: -6, scale: 0.3 },


];

export default function NewsScatter() {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotation: 0,
      scale: 1,
      zIndex: 20,
      duration: 1,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      scale: 0.5,
      zIndex: 1,
      duration: 1,
      ease: "power2.inOut",
    });
  };

  return (
    <>
      {/* SECTION 1 — Scattered Images */}
      <section className="relative w-full h-screen bg-white overflow-visible">
        <div className="absolute inset-0">
          {NEWS_IMAGES.map((src, i) => {
            const s = SCATTERED[i];
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: s.left,
                  top: s.top,
                  transform: `rotate(${s.rotation}deg) scale(${s.scale})`,
                  transformOrigin: "top left",
                  willChange: "transform",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={src}
                  alt={`News article ${i + 1}`}
                  loading={i < 6 ? "eager" : "lazy"}
                  className="w-[500px] h-auto shadow-md"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </section>


    </>
  );
}