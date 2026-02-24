"use client";

export default function MetaPart4() {
  return (
    <>
      <style>{`
        .p4-wrap {
          padding-top: 150px;
          width: 100%;
          position: relative;
        }


        .p4-sticky-bg {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          z-index: 0;
          overflow: hidden;
        }

        .p4-sticky-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }


        .p4-sticky-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.35) 100%);
          pointer-events: none;
        }


        .p4-scroll {
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

  
        .p4-card {
          pointer-events: auto;
          width: 100%;
          max-width: 680px;
          margin: 0 auto;
          padding: 0 24px;

        }

        .p4-card-inner {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(18px) saturate(1.4);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          border-radius: 20px;
          padding: 40px 44px;

        }

        .p4-card-label {
          display: block;
          font-size: 1rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c51b8a;
          font-weight: 400;
          margin-bottom: 14px;
          opacity: 0.85;
        }

        .p4-card-text {
          font-size: clamp(0.92rem, 1.3vw, 1.02rem);
          line-height: 1.9;
          color: #2a2a2a;
          margin: 0;
          text-align: justify;
        }

        .p4-card-text b {
          font-weight: 600;
          color: #111;
        }

        /* ── IMAGE ROW CARD ── */
        .p4-img-row {
          pointer-events: auto;
          width: 100%;
          max-width: 780px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        .p4-img-row-inner {
          display: flex;
          gap: 16px;
          align-items: stretch;
        }

        .p4-img-row-inner img {
          flex: 1;
          width: 0;
          height: auto;
          border-radius: 14px;
          object-fit: cover;
          border: 1px solid rgba(255,255,255,0.5);
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        }

        /* spacer at bottom so last card clears */
        .p4-end-spacer {
          height: 800px;
          pointer-events: none;
        }

        @media (max-width: 640px) {
        .p4-sticky-bg img {
          object-position: 80% center;
        }
          .p4-card-inner {
            padding: 28px 24px;
          }
          .p4-img-row-inner {
            flex-direction: column;
          }
          .p4-img-row-inner img {
            width: 100%;
          }
        }
      `}</style>

      <div className="p4-wrap">

        {/* ── STICKY BG ── */}
        <div className="p4-sticky-bg">
          <img
            src="/meta.png"
            alt="Meta apps"
            loading="eager"
          />
        </div>

        {/* ── SCROLLING CARDS ── */}
        <div className="p4-scroll">

          {/* Card 1 — intro paragraph */}
          <div className="p4-card">
            <div className="p4-card-inner">
              <span className="p4-card-label">Meta signali</span>
              <p className="p4-card-text">
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

          {/* Card 2 — jezik/lokacija text */}
          <div className="p4-card">
            <div className="p4-card-inner">
              <span className="p4-card-label">Jezik i lokacija</span>
              <p className="p4-card-text">
                Pri procjeni veličine potencijalne publike može se krenuti od
                jezika korisnika, pri čemu se klasifikacija provodi
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

          {/*
          <div className="p4-img-row">
            <div className="p4-img-row-inner">
              <img src="/meta-jezik.jfif" alt="Meta jezik" loading="lazy" />
              <img src="/meta-lokacija.jfif" alt="Meta lokacija" loading="lazy" />
            </div>
          </div>
          */}

          {/* Card 3 — privatnost text */}
          <div className="p4-card">
            <div className="p4-card-inner">
              <span className="p4-card-label">Ograničenja i privatnost</span>
              <p className="p4-card-text">
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
          <div className="p4-img-row">
            <div className="p4-img-row-inner">
              <img src="/meta-analiza.jfif" alt="Meta analiza" loading="lazy" />
              <img src="/meta-privatnost.jfif" alt="Meta privatnost" loading="lazy" />
            </div>
          </div>
          */}

          <div className="p4-end-spacer" />
        </div>

      </div>
    </>
  );
}