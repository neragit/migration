"use client";

import gsap from "gsap";
import { useEffect, useState } from "react";

const NEWS_IMAGES = Array.from({ length: 24 }, (_, i) => `/news-${i + 1}.png`);

const SCATTERED = [
  { left: "30%", top: "70%", rotation: 7, scale: 0.3 },
  { left: "50%", top: "55%", rotation: 4, scale: 0.3 },
  { left: "70%", top: "30%", rotation: 8, scale: 0.3 },
  { left: "75%", top: "80%", rotation: -8, scale: 0.3 },
  { left: "40%", top: "65%", rotation: 4, scale: 0.3 },
  { left: "75%", top: "60%", rotation: -7, scale: 0.3 },
  { left: "18%", top: "62%", rotation: -5, scale: 0.3 },
  { left: "80%", top: "20%", rotation: 6, scale: 0.3 },

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
  { left: "5%", top: "18%", rotation: -8, scale: 0.3 },

  { left: "15%", top: "50%", rotation: -9, scale: 0.3 },
  { left: "40%", top: "50%", rotation: 5, scale: 0.3 },
  { left: "60%", top: "55%", rotation: -6, scale: 0.3 },

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


export default function NewsScatter() {

  const [isMobile, setIsMobile] = useState(false);

  const [answers, setAnswers] = useState<{
    awareness?: string;
    foreignWorkers?: string;

    foreignWorkersPercent?: number;
    topNationalities?: string[];
    nationalitySearch?: string; 
  }>({
    awareness: undefined,
    foreignWorkers: undefined,
    foreignWorkersPercent: undefined,
    topNationalities: [],
  });


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      <section className="relative w-full">
        {/* Sticky Scatter */}
        <div className="sticky top-0 h-screen z-0">
          {/* SECTION 1 — Scattered Images */}
          <section className="relative w-full h-screen bg-white overflow-visible">
            <div className="absolute inset-0">
              {NEWS_IMAGES.map((src, i) => {
                const s = SCATTERED[i];
                const initialScale = isMobile ? 0.4 : s.scale
                const isRightSide = parseFloat(s.left) > 50
                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: s.left,
                      top: s.top,
                      transform: `rotate(${s.rotation}deg) scale(${initialScale})`,
                      transformOrigin: isMobile && isRightSide ? "top right" : "top left",
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
        </div>

        <div className="wrap mt-200"  >
          <div className="scroll !gap-50 " style={{ padding: 20 }}>
            {/* Question 1 — Awareness */}
            <div className="card">
              <div className="card-inner">
                <p className="question text-center">Koliko ste u toku s ovom temom?</p>
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
                      onClick={() => setAnswers(prev => ({ ...prev, awareness: option }))}
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
                      onClick={() => setAnswers(prev => ({ ...prev, foreignWorkers: option }))}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>



            <div className="card mt-8">
              <div className="card-inner">
                <p className="question text-center mb-4">
                  Koje su 10 najčešćih državljanstava stranih radnika? (maks. 10)
                </p>

                <input
                  type="text"
                  placeholder="Pretraži"
                  value={answers.nationalitySearch || ""}
                  onChange={(e) =>
                    setAnswers(prev => ({ ...prev, nationalitySearch: e.target.value }))
                  }
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
                          onChange={(e) => {
                            setAnswers(prev => {
                              const selected = prev.topNationalities || [];
                              if (selected.includes(n)) {
                                return {
                                  ...prev,
                                  topNationalities: selected.filter(x => x !== n),
                                };
                              } else if (selected.length < 10) {
                                return { ...prev, topNationalities: [...selected, n] };
                              }
                              return prev;
                            });
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



            <div className="card" style={{ marginTop: 32, marginBottom: 1000 }}>
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
                  onChange={(e) =>
                    setAnswers(prev => ({
                      ...prev,
                      foreignWorkersPercent: Number(e.target.value),
                    }))
                  }
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
          </div>

        </div>
      </section>
    </>
  );
}