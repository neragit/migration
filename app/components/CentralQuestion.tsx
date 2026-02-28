"use client";

import { useRef, useState, useEffect } from "react";

export default function CentralQuestion() {
  const col1Ref = useRef<HTMLDivElement | null>(null);
  const bridgeRef = useRef<HTMLDivElement | null>(null);
  const col2Ref = useRef<HTMLDivElement | null>(null);

  const [col1Visible, setCol1Visible] = useState(false);
  const [bridgeVisible, setBridgeVisible] = useState(false);
  const [col2Visible, setCol2Visible] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3, // trigger when 30% visible
    };

    const col1Observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setCol1Visible(entry.isIntersecting));
    }, observerOptions);

    const bridgeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setBridgeVisible(entry.isIntersecting));
    }, observerOptions);

    const col2Observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setCol2Visible(entry.isIntersecting));
    }, observerOptions);

    if (col1Ref.current) col1Observer.observe(col1Ref.current);
    if (bridgeRef.current) bridgeObserver.observe(bridgeRef.current);
    if (col2Ref.current) col2Observer.observe(col2Ref.current);

    return () => {
      if (col1Ref.current) col1Observer.unobserve(col1Ref.current);
      if (bridgeRef.current) bridgeObserver.unobserve(bridgeRef.current);
      if (col2Ref.current) col2Observer.unobserve(col2Ref.current);
    };
  }, []);

  return (
    <>
      <style>{`
        .wrap { width: 100%; }
        .grid { display: grid; grid-template-columns: 1fr 140px 1fr; max-width: 1280px; margin: 0 auto; padding: 0px 45px; align-items: stretch; min-height: 300px; }
        .col1, .bridge, .col2 { transition: opacity 0.6s ease, transform 0.6s ease; }
        .col1 { padding-right: 48px; padding-top: 8px; text-align: left; }
        .col2 { padding-left: 48px; padding-top: 8px; text-align: right; }
        .text { color: #555; font-size: clamp(0.92rem, 1.3vw, 1.04rem); line-height: 1.95; }
        .text.bolded b { color: #c51b8a; }
        .bridge { display: flex; flex-direction: column; padding-top: 5px; align-items: center; justify-content: center; position: relative; user-select: none; }
        .bridge-question { font-size: clamp(2.75rem, 1vw, 2.5rem); color: #eee; font-weight: 700; line-height: 1.35; text-align: center; letter-spacing: 0.01em; transition: opacity 0.6s ease; }

        @media (max-width: 768px) {
          .grid { grid-template-columns: 1fr; padding: 0 24px; min-height: unset; }
          .col1 { padding-right: 0; padding-bottom: 32px; text-align: justify; }
          .bridge { flex-direction: row; gap: 0px; padding: 15px 0; }
          .bridge-question { font-size: 2rem; padding: 0 8px; white-space: nowrap; }
          .col2 { text-align: justify; padding-left: 0; padding-top: 32px; }
        }
      `}</style>

      <div className="wrap py-30">
        <div className="grid">

          {/* Col1 */}
          <div
            ref={col1Ref}
            className="col1"
            style={{
              opacity: col1Visible ? 1 : 0.2,
              transform: col1Visible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <p className={`text ${col1Visible ? "bolded" : ""}`}>
              <b>Otkad su ukinute kvote za zapošljavanje stranih radnika u Hrvatskoj, migracije i dolazak stranih radnika postali su jedno od najpolariziranijih društvenih pitanja.</b> Velik dio medijskih tekstova naglašava neusklađenost statistika, nekontroliran rast broja radnih dozvola i negativne društvene posljedice.
              Istovremeno, neki od izvora tvrde da su alarmističke interpretacije pretjerane ili politički motivirane.
              <b> Brojke postaju politički argument, a interpretacija podataka oblikuje percepciju stvarnosti. </b>U središtu ove rasprave nalazi se temeljno pitanje:
            </p>
          </div>

          {/* Bridge */}
          <div
            ref={bridgeRef}
            className="bridge"
            style={{
              opacity: col1Visible ? 1 : 0.2, // appears after col1
            }}
          >
            <span className="bridge-question" style={{ opacity: bridgeVisible ? 1 : 0.2 }}>
              Koliko je<br />stvarno stranih<br />radnika u<br />Hrvatskoj?
            </span>
          </div>

          {/* Col2 */}
          <div
            ref={col2Ref}
            className="col2"
            style={{
              opacity: col2Visible ? 1 : 0.2,
              transform: col2Visible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <p className={`text ${col2Visible ? "bolded" : ""}`}>
              Bez preciznih i usporedivih brojki nemoguće je racionalno procijeniti učinke migracija niti oblikovati održive javne politike. Ako su podaci fragmentirani, zakašnjeli ili neusklađeni, prostor se otvara za spekulacije, političku instrumentalizaciju i polarizaciju javnosti. Ova analiza polazi upravo od tog problema: <b>može li digitalni trag, poput agregiranih podataka društvenih mreža, poslužiti kao dodatni alat za provjeru službenih statistika?</b> Ne kao zamjena, nego kao nadopuna za razumijevanje stvarnosti.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}