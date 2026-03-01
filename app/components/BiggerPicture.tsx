"use client";

import { useEffect, useRef, useState } from "react";
import DorlingWorld from "../components/DorlingWorld";
import CentralQuestion from "../components/CentralQuestion";
import ESS from "../components/ESS";
import useResizeObserver from "../hooks/useResizeObs";


const introBlocks = [
  {
    id: "intro-europe-us",
    label: "Šira slika",
    content: `Diljem Europe i Sjedinjenih Američkih Država, medijski naslovi godinama upozoravaju na "rast broja migranata". Dolazak migranata i izbjeglica utječe na politiku i rezultate izbora. 2026. godine u SAD-u tenzije kulminiraju i dolazi do oštre anti-imigracijske politike koja izaziva snažne reakcije javnosti, sukobe i prosvjede protiv masovnog djelovanja deportacijskih agenata. Povjerenje u institucije varira, a mišljenja se često oblikuju brže nego što su uopće objavljeni službeni podaci.`,
  },
  {
    id: "croatia-position",
    label: "Hrvatska",
    content: `Hrvatska zauzima jedinstvenu poziciju u ovom kontekstu. Više nije samo zemlja iseljenika. Postala je ekonomija koja uvozi radnu snagu, država na vanjskoj granici Schengena, zemlja koja djeluje unutar Dublinske uredbe o tražiteljima azila. Otkad su ukinute kvote za zapošljavanje stranih radnika, javna rasprava sve više reflektira šire europske zabrinutosti.`,
  },
  {
    id: "data-complexity",
    label: "Složenost podataka",
    content: `Velik dio medijskih tekstova naglašava neusklađenost statistika, nekontroliran rast broja radnih dozvola i negativne društvene posljedice. Istovremeno, neki izvori tvrde da su alarmističke interpretacije pretjerane ili politički motivirane. Brojke postaju argument, a interpretacija podataka oblikuje percepciju stvarnosti. U središtu ove rasprave nalazi se temeljno pitanje:`,
  },
  {
    id: "core-question",
    label: "",
    content: `Koliko je stvarno stranih radnika u Hrvatskoj?`,
  },
  {
    id: "digital-traces",
    label: "Digitalni tragovi",
    content: `Ova analiza inspirirana je idejom "good data" — digitalnih podataka koji se koriste transparentno, kritički i odgovorno — i polazi upravo od spomenutog problema: može li digitalni trag, poput agregiranih podataka društvenih mreža, poslužiti kao dodatni alat za provjeru službenih statistika?`,
  },
];

// Step layout:
// 0 → Dorling World
// 1 → introBlocks[0] — Šira slika
// 2 → introBlocks[1] — Hrvatska
// 3 → ESS  ← inserted here
// 4 → introBlocks[2] — Složenost podataka
// 5 → introBlocks[3] — core-question
// 6 → introBlocks[4] — Digitalni tragovi
// 7 → introBlocks[5] (if exists, otherwise skip)
// 8 → Venn diagram

const BLOCKS_BEFORE_ESS = introBlocks.slice(0, 2);   // steps 1–2
const BLOCKS_AFTER_ESS = introBlocks.slice(2);        // steps 4–6
const ESS_STEP = 3;
const VENN_STEP = BLOCKS_BEFORE_ESS.length + 1 + BLOCKS_AFTER_ESS.length + 1; // = 8
const INTRO_STEPS = VENN_STEP + 1; // = 9
const FADE_RANGE = 0.05;


export default function BiggerPicture() {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const size = useResizeObserver(containerRef);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), totalHeight);
      setProgress(totalHeight > 0 ? scrolled / totalHeight : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stepOpacity = (index: number) => {
    const stepSize = 1 / INTRO_STEPS;
    const stepStart = index * stepSize;
    const stepEnd = stepStart + stepSize;
    if (progress < stepStart) return 0;
    if (progress > stepEnd) return 0;
    const fadeInEnd = stepStart + FADE_RANGE * stepSize;
    const fadeOutStart = stepEnd - FADE_RANGE * stepSize;
    if (progress <= fadeInEnd) return (progress - stepStart) / (fadeInEnd - stepStart);
    if (progress >= fadeOutStart) return (stepEnd - progress) / (stepEnd - fadeOutStart);
    return 1;
  };

  // Dorling: visible from the start, only fades OUT as we scroll away
  const dorlingOpacityCalc = () => {
    const stepSize = 1 / INTRO_STEPS;
    const stepEnd = stepSize; // end of step 0
    const fadeOutStart = stepEnd - FADE_RANGE * stepSize;
    if (progress > stepEnd) return 0;
    if (progress >= fadeOutStart) return (stepEnd - progress) / (stepEnd - fadeOutStart);
    return 1;
  };

  // Venn: mirrors Dorling but at the last step — fades IN, stays visible to the end
  const vennOpacityCalc = () => {
    const stepSize = 1 / INTRO_STEPS;
    const stepStart = VENN_STEP * stepSize;
    const fadeInEnd = stepStart + FADE_RANGE * stepSize;
    if (progress < stepStart) return 0;
    if (progress <= fadeInEnd) return (progress - stepStart) / (fadeInEnd - stepStart);
    return 1;
  };

  const activeStep = Math.floor(progress * INTRO_STEPS);
  const dorlingOpacity = dorlingOpacityCalc();
  const vennOpacity = vennOpacityCalc();
  const essOpacity = stepOpacity(ESS_STEP);
  const essActive = essOpacity > 0.5;

  const isShortScreen = size?.height && size.height < 500;

  return (
    <>
      <div
        ref={containerRef}
        className="relative"
        style={{ minHeight: `${INTRO_STEPS * 120}vh` }}
      >
        {/* Sticky frame */}
        <div className="sticky mx-auto px-5"
          style={{
            maxWidth: 1200,
            top: isShortScreen ? "10px" : "6.25rem",
          }}
        >
          <div
            className="relative w-full rounded-sm"
            style={{
              height: '80vh',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06), 0 4px 24px 0 rgba(0,0,0,0.04)',
              background: '#fff',
              overflow: 'visible',
            }}
          >
            {/* Corner marks */}
            {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
              <div
                key={pos}
                style={{
                  position: 'absolute',
                  width: 14,
                  height: 14,
                  borderColor: '#c51b8a',
                  borderStyle: 'solid',
                  opacity: 0.5,
                  zIndex: 10,
                  ...(pos === 'tl' ? { top: 10, left: 10, borderWidth: '2px 0 0 2px' } :
                    pos === 'tr' ? { top: 10, right: 10, borderWidth: '2px 2px 0 0' } :
                      pos === 'bl' ? { bottom: 10, left: 10, borderWidth: '0 0 2px 2px' } :
                        { bottom: 10, right: 10, borderWidth: '0 2px 2px 0' }),
                }}
              />
            ))}

            {/* Progress dots */}
            <div
              style={{
                position: 'absolute',
                right: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                zIndex: 20,
              }}
            >
              {Array.from({ length: INTRO_STEPS }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: activeStep === i ? '#c51b8a' : '#e5e7eb',
                    transform: activeStep === i ? 'scale(1.5)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>

            {/* Step counter */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                left: 20,
                fontSize: '0.6rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#9ca3af',
                fontWeight: 600,
                zIndex: 20,
              }}
            >
              {String(activeStep + 1).padStart(2, '0')} / {String(INTRO_STEPS).padStart(2, '0')}
            </div>

            {/* Step 0: Dorling World */}
            <div
              style={{
                position: 'absolute',
                overflow: 'visible',
                inset: 0,
                paddingTop: '30px',
                paddingInline: '50px',
                opacity: dorlingOpacity,
                transition: 'none',
                pointerEvents: dorlingOpacity > 0.5 ? 'auto' : 'none',
              }}
            >
              <DorlingWorld scaleOverride={size && size?.width ? Math.min(Math.max(size.width / 6, 20), 180) : 180} metaPage />
            </div>

            {/* Steps 1–2: introBlocks BEFORE ESS (Šira slika, Hrvatska) */}
            {BLOCKS_BEFORE_ESS.map((block, i) => (
              <div
                key={block.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '48px clamp(24px, 8vw, 120px)',
                  opacity: stepOpacity(i + 1), // steps 1, 2
                  transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ maxWidth: 620, textAlign: 'center' }}>
                  <p
                    style={{
                      color: '#c51b8a', margin: '0 0 1.25rem 0',
                      fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase'
                    }}
                  >
                    {block.label}
                  </p>
                  <div style={{ width: 32, height: 1, background: '#e5e7eb', margin: '0 auto 1.5rem' }} />
                  <p
                    style={{
                      fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
                      lineHeight: 1.85,
                      color: '#374151',
                      fontFamily: 'Mukta, sans-serif',
                      fontWeight: 400,
                      margin: 0,
                    }}
                  >
                    {block.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Step 3: ESS — after Hrvatska */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                overflowY: 'clip',
                opacity: essOpacity,
                transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: essActive ? 'auto' : 'none',
              }}
            >
              <ESS active={essActive} />
            </div>

            {/* Steps 4–6: introBlocks AFTER ESS (Složenost, core-question, Digitalni tragovi) */}
            {BLOCKS_AFTER_ESS.map((block, i) => (
              <div
                key={block.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '48px clamp(24px, 8vw, 120px)',
                  opacity: stepOpacity(i + ESS_STEP + 1), // steps 4, 5, 6
                  transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ maxWidth: 620, textAlign: 'center' }}>
                  <p
                    style={{
                      color: '#c51b8a', margin: '0 0 1.25rem 0',
                      fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase'
                    }}
                  >
                    {block.label}
                  </p>
                  {block.id !== 'core-question' && (
                    <div style={{ width: 32, height: 1, background: '#e5e7eb', margin: '0 auto 1.5rem' }} />
                  )}
                  <p
                    style={{
                      lineHeight: 1.85,
                      color: block.id === 'core-question' ? '#c51b8a' : '#374151',
                      fontWeight: block.id === 'core-question' ? 700 : 400,
                      fontSize: block.id === 'core-question' ? 'clamp(1.2rem, 2vw, 1.6rem)' : 'clamp(0.95rem, 1.4vw, 1.15rem)',
                      margin: 0,
                    }}
                  >
                    {block.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Step 8: Venn diagram */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px clamp(24px, 6vw, 80px)',
                opacity: vennOpacity,
                transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: vennOpacity > 0.5 ? 'auto' : 'none',
              }}
            >
              <div style={{ width: '100%', maxWidth: 820, textAlign: 'center' }}>
                <p
                  style={{
                    color: '#c51b8a',
                    margin: '0 0 1.25rem 0',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  Terminološki okvir
                </p>
                <div style={{ width: 32, height: 1, background: '#e5e7eb', margin: '0 auto 1.5rem' }} />
                <img
                  src="/venn.png"
                  alt="Migranti venn"
                  loading="lazy"
                  style={{ maxWidth: '100%', height: 'auto', maxHeight: 'calc(80vh - 140px)', objectFit: 'contain', textAlign: 'center' }}
                />
              </div>
            </div>

            {/* Scroll hint */}
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                opacity: Math.max(0, 1 - progress * 20),
                transition: 'opacity 0.4s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                pointerEvents: 'none',
                zIndex: 20,
              }}
            >
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bbPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(1.25); }
        }
      `}</style>
    </>
  );
}