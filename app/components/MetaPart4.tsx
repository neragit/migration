"use client";

import { useState } from "react";

export default function MetaPart4() {

  type AnswerKey = "usesMeta" | "nativeLanguage" | "metaAccuracy";
  type AnswerValue = "da" | "ne" | null;

  const [answers, setAnswers] = useState<{
    usesMeta: AnswerValue;
    nativeLanguage: AnswerValue;
    metaAccuracy: AnswerValue;
    sliderValue?: number;
  }>({
    usesMeta: null,
    nativeLanguage: null,
    metaAccuracy: null,
    sliderValue: 0,
  });

  const handleAnswer = (key: AnswerKey, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };




  return (
    <>
      <style>{`
        .wrap {
          padding-top: 150px;
          width: 100%;
          position: relative;
        }


        .sticky-bg {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          z-index: 0;
          overflow: hidden;
        }

        .sticky-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }


        .sticky-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.35) 100%);
          pointer-events: none;
        }


        .scroll {
          position: relative;
          z-index: 1;
          margin-top: -100vh;
          padding: 100vh 0 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          pointer-events: none;
        }

  
        .card {
          pointer-events: auto;
          width: 100%;
          max-width: 680px;
          margin: 0 auto;
          padding: 0 24px;

        }

        .card-inner {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(18px) saturate(1.4);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          border-radius: 20px;
          padding: 40px 44px;

        }

        .card-label {
          display: block;
          font-size: 1rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c51b8a;
          font-weight: 400;
          margin-bottom: 14px;
          opacity: 0.85;
        }

        .card-text {
          font-size: clamp(0.92rem, 1.3vw, 1.02rem);
          line-height: 1.9;
          color: #2a2a2a;
          margin: 0;
          text-align: justify;
        }

        .card-text b {
          font-weight: 600;
          color: #111;
        }

        /* ── IMAGE ROW CARD ── */
        .img-row {
          pointer-events: auto;
          width: 100%;
          max-width: 780px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        .img-row-inner {
          display: flex;
          gap: 16px;
          align-items: stretch;
        }

        .img-row-inner img {
          flex: 1;
          width: 0;
          height: auto;
          border-radius: 14px;
          object-fit: cover;
          border: 1px solid rgba(255,255,255,0.5);
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        }

        /* spacer at bottom so last card clears */
        .end-spacer {
          height: 800px;
          pointer-events: none;
        }


        .question {
  color: #c51b8a;
  font-weight: 600;
  margin-bottom: 16px;
}

        .card-btn {
  flex: 1;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1.5px solid rgba(197, 27, 138, 0.5);
  background: transparent;
  color: #c51b8a;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease;
  user-select: none;
}

.card-btn:hover {
  background-color: rgba(197, 27, 138, 0.15);
}

.card-btn.active {
  background-color: #c51b8a;
  color: white;
  border-color: #c51b8a;
}

        @media (max-width: 640px) {
        .sticky-bg img {
          object-position: 80% center;
        }
          .card-inner {
            padding: 28px 24px;
          }
          .img-row-inner {
            flex-direction: column;
          }
          .img-row-inner img {
            width: 100%;
          }
        }
      `}</style>

      <div className="wrap">

        {/* ── STICKY BG ── */}
        <div className="sticky-bg">
          <img
            src="/meta.png"
            alt="Meta apps"
            loading="eager"
          />
        </div>

        {/* ── SCROLLING CARDS ── */}
        <div className="scroll">

          {/* Card 1 — intro paragraph */}
          <div className="card">
            <div className="card-inner">
              <span className="card-label">Meta signali</span>
              <p className="card-text">
                Meta Platforms, Inc.{" "}
                <b>(Facebook, Instagram, WhatsApp, Messenger, Threads)</b> koristi
                dostupne podatke o korisnicima kao što su demografski podaci,
                interesi i aktivnosti kako bi omogućila procjenu potencijalne
                publike za oglašavanje i bolje ciljanje oglasa.
                Ako analiziramo
                ove podatke možemo dobiti uvid u to koje su skupine aktivne na
                internetu, kako se jezik i lokacija preklapaju, pa čak i kako se
                trendovi mijenjaju tijekom vremena. <br /><br />
                Iako ovi brojevi ne odražavaju
                savršeno službene podatke o stanovništvu, oni nude
                <b> dinamičan uvid u društvo u stvarnom vremenu</b> koji može pomoći
                tvrtkama, političarima i istraživačima da razumiju digitalne
                tragove različitih populacija. Praćenje tih promjena tijekom
                vremena može otkriti suptilne obrasce, od novih kulturnih trendova
                do promjena u mobilnosti, za koje tradicionalne statistike mogu
                biti potrebni mjeseci ili godine.
              </p>
            </div>
          </div>

          {/* Question 1 card */}
          <div className="card">
            <div className="card-inner">
              <p className="question">
                Koliko osoba u Hrvatskoj koristi ove aplikacije?
              </p>

              <input
                type="range"
                min={0}
                max={4000000}
                step={10000}
                value={answers.sliderValue || 0}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, sliderValue: Number(e.target.value) }))
                }
                style={{ width: "100%", marginTop: 16, accentColor: "#1877F2",  }}
              />

              <p style={{ marginTop: 12 }}>
                Vaša procjena:{" "}
                <span style={{ color: "#c51b8a" }}>
                  {answers.sliderValue?.toLocaleString("fr-FR") || 0}
                </span>
              </p>
            </div>

          </div>

          {/* Card 2 — jezik/lokacija text */}
          <div className="card">
            <div className="card-inner">
              <span className="card-label">Jezik i lokacija</span>
              <p className="card-text">
                Pri procjeni veličine potencijalne publike može se krenuti od lokacije ili jezika korisnika, pri čemu se klasifikacija provodi
                <b> prvenstveno na temelju postavki jezika korisničkog sučelja (primarni signal), ali i na temelju dodatnih pokazatelja, poput jezika kojim korisnik najčešće komunicira ili jezika sadržaja s
                  kojim je obično u interakciji (sekundarni signali). </b>To ne znači da ta procjena označava
                nacionalnost, etničku pripadnost, rasu ili porijeklo korisnika.
                Ako osoba koristi drugi jezik, primjerice engleski, bit će
                uključena u publiku za taj jezik, bez obzira na njezino
                državljanstvo ili podrijetlo.
                <br /><br />
                S druge strane, klasifikacije "iseljenika" (engl. expats) mogu
                podrazumijevati osobne podatke koje regulatori smatraju
                osjetljivima (npr. etnička pripadnosti, migracijska pozadina i
                sl.) pa je Meta kroz godine ograničila ovakvo targetiranje jer
                nastoji smanjiti rizik diskriminirajućeg ili invazivnog
                targetiranja.
              </p>
            </div>
          </div>

          {/* Question 2 card */}
          <div className="card">
            <div className="card-inner">

              <p className="question ">
                Koriste li ljudi na društvenim mrežama uglavnom svoj materinski jezik?
              </p>
              <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                <button
                  className={`card-btn ${answers.nativeLanguage === "da" ? "active" : ""}`}
                  onClick={() => handleAnswer("nativeLanguage", "da")}
                >
                  Da
                </button>
                <button
                  className={`card-btn ${answers.nativeLanguage === "ne" ? "active" : ""}`}
                  onClick={() => handleAnswer("nativeLanguage", "ne")}
                >
                  Ne
                </button>
              </div>

              <p className="question  mt-15">
                Mislite li da većina migranata u Hrvatskoj koristi ove aplikacije?
              </p>
              <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                <button
                  className={`card-btn ${answers.usesMeta === "da" ? "active" : ""}`}
                  onClick={() => handleAnswer("usesMeta", "da")}
                >
                  Da
                </button>
                <button
                  className={`card-btn ${answers.usesMeta === "ne" ? "active" : ""}`}
                  onClick={() => handleAnswer("usesMeta", "ne")}
                >
                  Ne
                </button>
              </div>

              <p className="question mt-15">
                Mislite li da Meta točno procjenjuje broj korisnika?
              </p>
              <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                <button
                  className={`card-btn ${answers.metaAccuracy === "da" ? "active" : ""}`}
                  onClick={() => handleAnswer("metaAccuracy", "da")}
                >
                  Da
                </button>
                <button
                  className={`card-btn ${answers.metaAccuracy === "ne" ? "active" : ""}`}
                  onClick={() => handleAnswer("metaAccuracy", "ne")}
                >
                  Ne
                </button>
              </div>

            </div>
          </div>

          {/*
          <div className="img-row">
            <div className="img-row-inner">
              <img src="/meta-jezik.jfif" alt="Meta jezik" loading="lazy" />
              <img src="/meta-lokacija.jfif" alt="Meta lokacija" loading="lazy" />
            </div>
          </div>
          */}

          {/* Card 3 — privatnost text */}
          <div className="card">
            <div className="card-inner">
              <span className="card-label">Ograničenja i privatnost</span>
              <p className="card-text">
                S obzirom na to da su podaci{" "}
                <b>anonimizirani i agregirani na razini skupine</b>, moguće je
                koristiti alate poput Meta Ads Managera i Graph API-ja za analizu
                publike u istraživačke svrhe pod uvjetom poštivanja pravila
                privatnosti. U Europskoj uniji primjenjuje se GDPR. Radi očuvanja
                privatnosti, Meta u prikazu procjene potencijalne publike koristi
                raspon između <b>minimalne i maksimalne vrijednosti</b>. Vrlo male
                vrijednosti nisu prikazane, npr. procjena od 0 do 1000 korisnika
                može se prikazati kao "manje od 1000".

              </p>
            </div>
          </div>

          {/* 
          <div className="img-row">
            <div className="img-row-inner">
              <img src="/meta-analiza.jfif" alt="Meta analiza" loading="lazy" />
              <img src="/meta-privatnost.jfif" alt="Meta privatnost" loading="lazy" />
            </div>
          </div>
          */}

          <div className="end-spacer" />
        </div>

      </div>
    </>
  );
}