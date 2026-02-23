"use client";

import { useState } from "react";

export default function Part3() {
    const [col1Hovered, setCol1Hovered] = useState(false);
    const [bridgeHovered, setBridgeHovered] = useState(false);
    const [col2Hovered, setCol2Hovered] = useState(false);

    const opacity = (hovered: boolean) => (hovered ? 1 : 0.2);


    return (
        <>
            <style>{`
        .wrap { width: 100%; }
        .grid { display: grid; grid-template-columns: 1fr 140px 1fr; max-width: 1280px; margin: 0 auto; padding: 0px 45px; align-items: stretch; min-height: 300px; }

        .col1, .bridge, .col2 { transition: opacity 0.35s ease; }
        .col1 { padding-right: 48px; padding-top: 8px; text-align: left; }

        .text { color: #555; font-size: clamp(0.92rem, 1.3vw, 1.04rem); line-height: 1.95; }
        .text b { transition: color 0.35s ease; }
        .text.hovered b { color: #c51b8a; }

        .bridge { display: flex; flex-direction: column; padding-top: 5px; align-items: center; justify-content: center; position: relative; user-select: none;  }
        .bridge-question { font-size: clamp(2.75rem, 1vw, 2.5rem); color: #eee; font-weight: 700;  line-height: 1.35; text-align: center; transition: color 0.35s ease; letter-spacing: 0.01em; }
        .bridge:hover .bridge-question { color: #c51b8a; }

        .col2 { padding-left: 48px; padding-top: 8px; opacity: 1; text-align: right; filter: none; transform: none; pointer-events: auto; }

        @media (max-width: 768px) {
          .grid { grid-template-columns: 1fr; padding: 0 24px; min-height: unset; }
          .col1 { padding-right: 0; padding-bottom: 32px; }
          .bridge { flex-direction: row; gap: 16px; padding: 28px 0; }
          .bridge-line { flex: 1; height: 1px; width: auto; }
          .bridge-question { font-size: 2rem; padding: 0 8px; white-space: nowrap; }
          .col2 { padding-left: 0; padding-top: 32px; opacity: 1 !important; filter: none !important; transform: none !important; pointer-events: auto !important; }
        }
      `}</style>

            <div className="wrap">
                <div className="grid">

                    <div
                        className="col1"
                        onMouseEnter={() => setCol1Hovered(true)}
                        onMouseLeave={() => setCol1Hovered(false)}
                    >
                        <p className={`text ${col1Hovered ? "hovered" : ""}`}>
                            <b>Otkad su ukinute kvote za zapošljavanje stranih radnika u Hrvatskoj, migracije i dolazak stranih radnika postali su jedno od najpolariziranijih društvenih pitanja.</b> Velik dio medijskih tekstova naglašava neusklađenost statistika, nekontroliran rast broja radnih dozvola i negativne društvene posljedice.
                            Istovremeno, neki od izvora tvrde da su alarmističke interpretacije pretjerane ili politički motivirane.
                            <b> Brojke postaju politički argument, a interpretacija podataka oblikuje percepciju stvarnosti. </b>U središtu ove rasprave nalazi se temeljno pitanje:
                        </p>
                    </div>

                    <div
                        className="bridge"
                        style={{ opacity: opacity(bridgeHovered) }}
                        onMouseEnter={() => setBridgeHovered(true)}
                        onMouseLeave={() => setBridgeHovered(false)}
                    >

                        <span className="bridge-question">
                            Koliko je<br />stvarno stranih<br />radnika u<br />Hrvatskoj?
                        </span>

                    </div>

                    <div
                        className="col2"
                        onMouseEnter={() => setCol2Hovered(true)}
                        onMouseLeave={() => setCol2Hovered(false)}
                    >
                        <p className={`text ${col2Hovered ? "hovered" : ""}`}>
                            Bez preciznih i usporedivih brojki nemoguće je racionalno procijeniti učinke migracija niti oblikovati održive javne politike. Ako su podaci fragmentirani, zakašnjeli ili neusklađeni, prostor se otvara za spekulacije, političku instrumentalizaciju i polarizaciju javnosti. Ova analiza polazi upravo od tog problema: <b>može li digitalni trag, poput agregiranih podataka društvenih mreža, poslužiti kao dodatni alat za provjeru službenih statistika?</b> Ne kao zamjena, nego kao nadopuna za razumijevanje stvarnosti.
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}