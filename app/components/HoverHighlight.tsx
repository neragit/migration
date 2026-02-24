"use client";

import { useState } from "react";

type Segment = { text: string; bold?: boolean };
type QuestionLine = Segment[];

const LINES: QuestionLine[] = [
  [{ text: "Koliko " }, { text: "stranih radnika", bold: true }, { text: " stvarno boravi u Hrvatskoj?" }],
  [{ text: "Koliko ih radi " }, { text: "neprijavljeno", bold: true }, { text: "?" }],
  [{ text: "Koliko ih je napustilo zemlju " }, { text: "bez odjave", bold: true }, { text: "?" }],
  [{ text: "Koliko ih ostaje, a koliko odlazi " }, { text: "dalje u EU", bold: true }, { text: "?" }],
  [{ text: "Što zapravo predstavlja broj izdanih " }, { text: "radnih dozvola", bold: true }, { text: "?" }],
  [{ text: "Jesu li podaci " }, { text: "MUP-a, HZMO-a i Ministarstva rada", bold: true }, { text: " međusobno usklađeni?" }],
  [{ text: "Je li Hrvatska " }, { text: "tranzitna ili useljenička zemlja", bold: true }, { text: "?" }],
  [{ text: "Koliki je stvarni rizik " }, { text: "zloupotrebe sustava", bold: true }, { text: "?" }],
  [{ text: "Radi li se o " }, { text: "privremenoj radnoj snazi ili trajnoj migraciji", bold: true }, { text: "?" }],
  [{ text: "Dolaze li radnici " }, { text: "sezonski ili ostaju dugoročno", bold: true }, { text: "?" }],
  [{ text: "Je li uvoz radne snage zamjena za " }, { text: "demografsku politiku", bold: true }, { text: " i povratak iseljenih?" }],
  [{ text: "Koliko migranti" }, { text: " doprinose " }, { text: "proračunu", bold: true }, { text: "?" }],
  [{ text: "Koliko košta " }, { text: "integracija", bold: true }, { text: "?" }],
  [{ text: "Postoji li " }, { text: "strategija integracije", bold: true }, { text: "?" }],
  [{ text: "Ima li država kapaciteta u " }, { text: "obrazovanju, stanovanju i socijalnom sustavu", bold: true }, { text: "?" }],
  [{ text: "Nudi li " }, { text: "zakon", bold: true }, { text: " stvarno rješenje ili samo kozmetičke izmjene?" }],
];

// Insert H1 as a question line block
const H1_LINE: QuestionLine = [
  { text: "Meta signali: ", bold: true },
  { text: "mogu li društveni mediji pomoći u provjeri službenih podataka?" }
];

// Compute the index to inject H1
const midIndex = Math.floor(LINES.length / 2);
const insertIndex = Math.max(0, midIndex - 2);

export default function HoverHighlight() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);


  // Merge lines with H1 in the middle
  const combinedLines: QuestionLine[] = [
    ...LINES.slice(0, insertIndex),
    H1_LINE,
    ...LINES.slice(insertIndex),
  ];

  return (
    <section className="w-full mt-30 bg-white px-5 lg:px-10">
      <p className="text-2xl lg:text-5xl text-center lg:text-justify text-gray-700 mx-auto">

        {combinedLines.map((line, i) => {
          const isH1 = line === H1_LINE;
          const isActive = i === activeIndex;
          const isInactive = !isH1 && i !== activeIndex;

          return (
            <span
              key={i}
              onMouseEnter={() => !isH1 && setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              className={isH1 ? "block lg:inline text-4xl lg:text-5xl text-center font-bold sm:text-5xl " : "transition-all duration-300 ease-out select-none"}
              style={{ opacity: isInactive ? 0.1 : 1 }}
            >
              {line.map((seg, j) =>
                seg.bold ? (
                  <b
                    key={j}
                    style={{
                      color: isH1 || isActive ? "#c51b8a" : "inherit",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {seg.text}
                  </b>
                ) : (
                  <span key={j}>{seg.text}</span>
                )
              )}
              {" "}
            </span>
          );
        })}

      </p>
    </section>
  );
}