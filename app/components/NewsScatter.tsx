"use client";

import gsap from "gsap";
import { useEffect, useState, useRef } from "react";
import type { AnswersState } from "@/types/answers";
import useResizeObserver from "../hooks/useResizeObs";

const NEWS_IMAGES = Array.from({ length: 24 }, (_, i) => `/news-${i + 1}.png`);

const SCATTERED = [
  { left: "30%", top: "70%", rotation: 7 },
  { left: "50%", top: "45%", rotation: 4 },
  { left: "70%", top: "30%", rotation: 8 },
  { left: "40%", top: "70%", rotation: -8 },
  { left: "30%", top: "50%", rotation: -3 },
  { left: "75%", top: "60%", rotation: -7 },
  { left: "18%", top: "32%", rotation: -5 },
  { left: "80%", top: "20%", rotation: 6 },
  { left: "55%", top: "15%", rotation: 5 },
  { left: "28%", top: "13%", rotation: -3 },

  { left: "68%", top: "10%", rotation: 9 },
  { left: "42%", top: "30%", rotation: 6 },
  { left: "10%", top: "65%", rotation: 10 },
  { left: "68%", top: "65%", rotation: -7 },
  { left: "25%", top: "40%", rotation: 4 },
  { left: "0%", top: "55%", rotation: -12 },
  { left: "0%", top: "30%", rotation: -6 },
  { left: "62%", top: "30%", rotation: 7 },
  { left: "25%", top: "15%", rotation: 3 },
  { left: "45%", top: "20%", rotation: -4 },

  { left: "5%", top: "18%", rotation: -8 },
  { left: "10%", top: "50%", rotation: -9 },
  { left: "40%", top: "50%", rotation: 5 },
  { left: "60%", top: "50%", rotation: -6 },
  { left: "3%", top: "17%", rotation: 7 },
  { left: "15%", top: "25%", rotation: 4 },
  { left: "27%", top: "33%", rotation: 8 },
  { left: "50%", top: "37%", rotation: -8 },
];

const NATIONALITIES = [
  "Afganistan", "Albanija", "Alžir", "Andora", "Angola", "Antigva i Barbuda", "Argentina", "Armenija", "Australija", "Austrija",
  "Azerbajdžan", "Bahami", "Bahrein", "Bangladeš", "Barbados", "Bjelorusija", "Belgija", "Belize", "Benin", "Butan",
  "Bolivija", "Bosna i Hercegovina", "Bocvana", "Brazil", "Brunej", "Bugarska", "Burkina Faso", "Burundi", "Zelenortska Republika", "Kambodža",
  "Kamerun", "Kanada", "Srednjoafrička Republika", "Čad", "Čile", "Kina", "Kolumbija", "Komori", "Kongo (Brazzaville)", "Kostarika",
  "Hrvatska", "Kuba", "Cipar", "Češka", "Demokratska Republika Kongo", "Danska", "Džibuti", "Dominika", "Dominikanska Republika", "Ekvador",
  "Egipat", "El Salvador", "Ekvatorijalna Gvineja", "Eritreja", "Estonija", "Esvatini", "Etiopija", "Fidži", "Finska", "Francuska",
  "Gabon", "Gambija", "Gruzija", "Njemačka", "Gana", "Grčka", "Grenada", "Gvatemala", "Gvineja", "Gvineja-Bisau",
  "Gvajana", "Haiti", "Honduras", "Mađarska", "Island", "Indija", "Indonezija", "Iran", "Irak", "Irska",
  "Izrael", "Italija", "Jamajka", "Japan", "Jordan", "Kazahstan", "Kenija", "Kiribati", "Kuvajt", "Kirgistan",
  "Laos", "Latvija", "Libanon", "Lesoto", "Liberija", "Libija", "Lihtenštajn", "Litva", "Luksemburg", "Madagaskar",
  "Malavi", "Malezija", "Maldivi", "Mali", "Malta", "Maršalska Ostrva", "Mauritanija", "Mauricijus", "Meksiko", "Mikronezija",
  "Moldavija", "Monako", "Mongolija", "Crna Gora", "Maroko", "Mozambik", "Mjanmar", "Namibija", "Nauru", "Nepal",
  "Nizozemska", "Novi Zeland", "Nikaragva", "Niger", "Nigerija", "Sjeverna Koreja", "Sjeverna Makedonija", "Norveška", "Oman", "Pakistan",
  "Palau", "Palestina", "Panama", "Papua Nova Gvineja", "Paragvaj", "Peru", "Filipini", "Poljska", "Portugal", "Katar",
  "Rumunjska", "Rusija", "Ruanda", "Sveti Kristofor i Nevis", "Sveta Lucija", "Sveti Vincent i Grenadini", "Samoa", "San Marino", "Sao Tome i Principe", "Saudijska Arabija",
  "Senegal", "Srbija", "Sejšeli", "Sijera Leone", "Singapur", "Slovačka", "Slovenija", "Solomonska Ostrva", "Somalija", "Južna Afrika",
  "Južna Koreja", "Španija", "Šri Lanka", "Sudan", "Surinam", "Švedska", "Švicarska", "Sirija", "Tadžikistan",
  "Tanzanija", "Tajland", "Timor-Leste", "Togo", "Tonga", "Trinidad i Tobago", "Tunis", "Turska", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukrajina", "Ujedinjeni Arapski Emirati", "Ujedinjeno Kraljevstvo", "Sjedinjene Američke Države", "Urugvaj", "Uzbekistan", "Vanuatu", "Vatikan", "Venecuela",
  "Vijetnam", "Jemen", "Zambija", "Zimbabve"
];


interface NewsScatterProps {
  answers: AnswersState;
  handleAnswer: <K extends keyof AnswersState>(
    key: K,
    value: AnswersState[K]
  ) => void;
}

export default function NewsScatter({ answers, handleAnswer }: NewsScatterProps) {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const size = useResizeObserver(containerRef);


  const hasAnimated = useRef(false); // ADD THIS

  // ADD THIS BLOCK
  useEffect(() => {
    if (!size || hasAnimated.current) return;
    hasAnimated.current = true;

    const items = containerRef.current?.querySelectorAll<HTMLDivElement>(":scope > div");
    if (!items?.length) return;

    gsap.fromTo(
      items,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        stagger: {
          each: 0.1,
          from: "random",
        },
        ease: "power1.inOut",
      }
    );

     gsap.fromTo(
    labelRef.current,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 5,
      delay: 7,
      ease: "power1.inOut",
    }
  );

  }, [size]);

  let maxScale = size && size.vw < 750 ? 0.9 : 1;

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotation: 0,
      scale: maxScale,
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

  const labelRef = useRef<HTMLSpanElement>(null);

useEffect(() => {
  const onScroll = () => {
    if (!labelRef.current) return;
    gsap.to(labelRef.current, {
      opacity: scrollY > 30 ? 0 : 1,
      duration: 0.4,
      ease: "power1.out",
    });
  };

  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);


  return (
    <>
      <section className="relative w-full">
        {/* Sticky Scatter */}
        <div className="sticky top-0 h-screen z-0">
          {/* SECTION 1 — Scattered Images */}
          <section className="relative w-full h-screen bg-white overflow-clip">
            <div ref={containerRef} className="absolute inset-0">
              {size && NEWS_IMAGES.map((src, i) => {
                const s = SCATTERED[i];

                const isRightSide = parseFloat(s.left) > 50
                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      opacity: 0,
                      left: size && size.vw < 750 && isRightSide ? `calc(${s.left} - 70%)` : s.left,
                      top: s.top,
                      transform: `rotate(${s.rotation}deg) scale(0.3)`,
                      transformOrigin: size && size.vw < 750 ? isRightSide ? "top right" : "top left" : "top center",
                      willChange: "transform",
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img
                      src={src}
                      alt={`News article ${i + 1}`}
                      loading="eager"
                      className="w-[500px] h-auto shadow-md"
                      draggable={false}
                    />
                  </div>
                );
              })}
            </div>

            <span ref={labelRef}
              className="absolute opacity-0 bottom-6 left-1/2 -translate-x-1/2 z-0 text-center text-[0.58rem] tracking-[0.35em] uppercase text-gray-400 font-semibold pointer-events-none">
              Listaj dalje
            </span>
          </section>
        </div>

        <div className="wrap "  >
          <div className="scroll !gap-50 px-20  " >


            {/* Question 1 — Awareness */}
            <div className="card">
              <div className="card-inner">
                <p className="question text-center">Koliko ste upoznati s ovom temom?</p>
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Ne zanima me uopće",
                    "Povremeno pročitam ili čujem o tome",
                    "Redovito pročitam članke, dobro sam informiran",
                    "Znam dosta jer je povezano sa mnom / mojim poslom",
                  ].map((option, index) => (
                    <button
                      key={index}
                      className={`card-btn ${answers.awareness === option ? "active" : ""}`}
                      onClick={() => handleAnswer("awareness", option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Question 2 — Foreign workers number */}
            <div className="card" style={{ marginTop: 32 }}>
              <div className="card-inner">
                <p className="question text-center">Koliko ima stranih radnika u Hrvatskoj?</p>
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Malo, trebamo još stranih radnika",
                    "Dosta, vjerojatno trebamo još",
                    "Dovoljno, ne treba više",
                    "Previše, ne trebamo ih toliko",
                  ].map((option, index) => (
                    <button
                      key={index}
                      className={`card-btn ${answers.foreignWorkers === option ? "active" : ""}`}
                      onClick={() => handleAnswer("foreignWorkers", option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: 32 }}>
              <div className="card-inner">
                <p className="question text-center">
                  Koliko bi rekli da ima stranih radnika u odnosu na ukupno stanovništvo?
                </p>

                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={answers.foreignWorkersPercent || 0}
                  onChange={(e) => handleAnswer("foreignWorkersPercent", Number(e.target.value))}
                  style={{
                    width: "100%",
                    marginTop: 16,
                    accentColor: "#c51b8a", // optional styling
                  }}
                />

                <p style={{ marginTop: 12, textAlign: "center" }}>
                  Vaša procjena:{" "}
                  <span style={{ color: "#c51b8a" }}>
                    {answers.foreignWorkersPercent ?? 0}%
                  </span>
                </p>
              </div>
            </div>



            <div className="card mt-8 !mb-200">
              <div className="card-inner">
                <p className="question text-center mb-4">
                  Koje su 10 najčešćih državljanstava stranih radnika? (maks. 10)
                </p>

                <input
                  type="text"
                  placeholder="Pretraži"
                  value={answers.nationalitySearch || ""}
                  onChange={(e) => handleAnswer("nationalitySearch", e.target.value)}
                  className="border border-stone-200 text-stone-500 p-2 rounded w-full mb-3"
                />

                <div className=" rounded h-40 overflow-y-auto p-2 flex flex-col gap-1">
                  {NATIONALITIES.filter(n =>
                    n.toLowerCase().includes((answers.nationalitySearch || "").toLowerCase())
                  ).map((n) => {
                    const isSelected = answers.topNationalities?.includes(n);
                    const disabled =
                      !isSelected && (answers.topNationalities?.length || 0) >= 10;

                    return (
                      <label
                        key={n}
                        className={`flex items-center gap-2 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                      >
                        <input
                          type="checkbox"
                          value={n}
                          checked={isSelected}
                          disabled={disabled}
                          onChange={() => {
                            const selected = answers.topNationalities || [];
                            if (selected.includes(n)) {
                              handleAnswer("topNationalities", selected.filter(x => x !== n));
                            } else if (selected.length < 10) {
                              handleAnswer("topNationalities", [...selected, n]);
                            }
                          }}
                          className="form-checkbox "
                        />
                        <span>{n}</span>
                      </label>
                    );
                  })}
                  {NATIONALITIES.filter(n =>
                    n.toLowerCase().includes((answers.nationalitySearch || "").toLowerCase())
                  ).length === 0 && <p className="text-gray-400 text-sm">Nema rezultata</p>}
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  Odabrano: {answers.topNationalities?.length || 0} / 10
                </p>
              </div>
            </div>




          </div>

        </div>
      </section>
    </>
  );
}