"use client";

import { useEffect, useState } from "react";
import * as d3 from "d3";
import CroatiaMap from "./components/croatia-map";
import Treemap from "./components/Treemap";
import LineChart from "./components/LineChart";
import TopImmigrants from "./components/TopImmigrants";
import ListaZanimanja from "./components/ListaZanimanja";
import DorlingWorld from "./components/DorlingWorld";
import ChoroplethCro from "./components/ChoroplethCro";
import Mup from "./components/Mup";
import ToggleDetails from "./components/Details";



export default function Home() {
  const migrationData = [
    { year: 2015, immigrants: 11706, emigrants: 29651 },
    { year: 2016, immigrants: 13985, emigrants: 36436 },
    { year: 2017, immigrants: 15553, emigrants: 47352 },
    { year: 2018, immigrants: 26029, emigrants: 39515 },
    { year: 2019, immigrants: 37726, emigrants: 40148 },
    { year: 2020, immigrants: 33414, emigrants: 34046 },
    { year: 2021, immigrants: 35912, emigrants: 40424 },
    { year: 2022, immigrants: 57972, emigrants: 46287 },
    { year: 2023, immigrants: 69396, emigrants: 39218 },
    { year: 2024, immigrants: 70391, emigrants: 38997 },
  ];

  const [data, setData] = useState<any[]>([]);
  const [treemapData, setTreemapData] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState("migration");


  useEffect(() => {
    d3.csv("/data/zahtjevi.csv").then((raw) => {
      setData(
        raw.map((d: any) => ({
          zupanija: d.zupanija,
          neg: +d.neg,
          poz: +d.poz,
          godina: +d.godina,
        }))
      );
    });

    d3.csv("/data/poslovi.csv").then((raw) => {
      setTreemapData(
        raw.map((d: any) => ({
          zanimanje: d.zanimanje,
          broj: +d.broj,
          placa: +d.placa.replace(/\./g, "").replace(",", "."),
          godina: +d.godina,
        }))
      );
    });

    // Improved scroll handler for sidebar highlighting
    const sectionIds = [
      "migration",
      "hzz",
      "treemap",
      "map",
      "choropleth-cro",
      "top5",
      "mup",
      "dorling"
    ];


    const handleScroll = () => {
      const scrollY = window.scrollY + 40; // offset
      let current = "migration"; // default

      // Loop from bottom to top so last section reached is active
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && scrollY >= section.offsetTop) {
          current = sectionIds[i];
          break;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="main">
      <nav className="sidebar">
        <ul>
          {[
            { id: "migration", label: "Migracije" },
            { id: "hzz", label: "Radne dozvole" },
            { id: "treemap", label: "Tražena zanimanja" },
            { id: "map", label: "Županije" },
            { id: "choropleth-cro", label: "Migranti u Hrvatskoj" },
            { id: "top5", label: "Najčešći imigranti" },
            { id: "mup", label: "Godišnje stanje" },
            { id: "dorling", label: "Migranti u svijetu" }
          ]
            .map((s) => (
              <li
                key={s.id}
                className={activeSection === s.id ? "active" : ""}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </li>
            ))}
        </ul>
      </nav>


      <section className="content">

        <section className="section mb-10" id="intro">
          <div className="chart-wrapper">
            <h1>
              Hrvatska u brojkama: <span className="text-green-800">migracije</span>
            </h1>

            <p className="lede mb-5">
              Ova je stranica nastala iz jednostavne znatiželje:
              <b> što nam govore podaci?</b>
            </p>

            <p className="lede mb-5">
              Projekt je rezultat želje da pregledam podatke vezano uz migracije na jednom mjestu, bez
              dramatičnih naslova, subjektivnih interpretacija i reklama.

              Kao što kažu, slika govori tisuću riječi.

              Podaci su prikupljeni iz javno dostupnih izvora (Eurostat, MUP, UN, HZZ).
              Ponekad nema dostupnih podataka za posljednje godine, ali <b>možemo promatrati trendove</b>.
            </p>

            <p className="lede">
              Cilj je jednostavan: informiranje.
            </p>
          </div>
        </section>


        <section className="section mb-40" id="migration">
          <div className="chart-wrapper">
            <h2>
              Tko odlazi, a tko dolazi?
            </h2>

            <p className="lede">
              Od 2022. godine Hrvatska bilježi više useljenika nego iseljenika.
            </p>

            <div className="chart-row">
              <LineChart data={migrationData} width={740} height={420} />
            </div>
          </div>
        </section>

        <section className="section mb-40" id="hzz">
          <div className="chart-wrapper">
            <h2>HZZ – Radne dozvole i test tržišta rada</h2>
            <p className="lede mb-10">
              2020. godine vlada uvodi test tržišta rada, koji je osmišljen kao zamjena za kvotni sustav.
              Hrvatski zavod za zapošljavanje provodi test i donosi mišljenje o zahtjevu poslodavca.
            </p>
            <a href="https://www.hzz.hr/usluge/radne-dozvole-za-zaposljavanje-stranaca-i-test-trzista-rada/?tab=dokumenti" target="_blank" rel="noopener noreferrer">
              Iznimke za koje test <b className="text-green-800">nije potreban</b>
            </a>

            <ListaZanimanja />

          </div>
        </section>


        <section className="section mb-40" id="treemap">
          <div className="chart-wrapper">
            <h2>Tražena zanimanja</h2>

            <p className="wide mb-10">
              Svaka prikazana osoba predstavlja <b>650 radnika</b>, a tamnija boja pokazuje <b>višu prosječnu plaću</b> po zanimanju.
            </p>

            {treemapData.length ? <Treemap data={treemapData} /> : <p>Loading…</p>}
          </div>
        </section>


        <section className="section mb-10" id="map">
          <div className="chart-wrapper">
            <h2>Odobreni zahtjevi po županijama</h2>
            {data.length ? <CroatiaMap data={data} /> : <p>Loading…</p>}
          </div>
        </section>

        <section className="section " id="choropleth-cro">
          <div className="chart-wrapper">
            <h2>Migranti u Hrvatskoj</h2>

            <p className="lede ">
              2022. godine u Hrvatsku dolazi značajan broj migranata iz Ukrajine i Azije. Izvor:{" "}
              <a
                href="https://ec.europa.eu/eurostat/web/migration-asylum/international-migration-citizenship/database" 
                target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', lineHeight: 1.6 }}
              >
                Eurostat
              </a>

            </p>

            <div className="section ml-0 ">
              <ChoroplethCro />
            </div>

          </div>
        </section>


        <section className="section mt-0 mb-40" id="top5">
          <div className="chart-wrapper">
            <h2>Najčešći imigranti u Hrvatskoj</h2>

            <p className="lede">
              Nakon 2023. broj migranata iz Ukrajine se smanjuje, dok broj migranata iz Azije nastavlja rasti.
            </p>

            <div className="chart-row ">
              <TopImmigrants width={740} height={420} />
            </div>
          </div>
        </section>

        <section className="section mb-40" id="mup">
          <div className="chart-wrapper">
            <h2>MUP - Dozvole za rad i boravak</h2>

            <p className="lede">
              Prema podacima Ministarstva unutarnjih poslova, u Hrvatskoj je 2025. radilo i boravilo podjednako osoba iz BiH i Nepala.
              Iako je tijekom 2022. i 2023. u Hrvatsku migriralo više od 20 000 osoba iz Ukrajine, broj koji se zadržao u 2025. puno je manji. U odnosu na prethodnu 2024. godinu, povećao se jedino broj osoba iz Filipina. Izvor:{" "}

              <a
                href="https://mup.gov.hr/gradjani-281562/moji-dokumenti-281563/stranci-333/statistika-169019/169019" 
                target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', lineHeight: 1.6 }}
              >
                MUP
              </a>

            </p>

            <div className="chart-row">
              <Mup width={900} height={600} />
            </div>
          </div>
        </section>



        <section className="section mb-40" id="dorling">
          <div className="chart-wrapper">
            <h2>Migranti u svijetu</h2>

            <p className="lede mb-5">
              Velike zemlje poput Indije i Kine, imaju i velik broj emigranata.
              Osim ekonomskih razloga, do migracija često dolazi zbog ratova i konflikata, primjerice u Siriji i Ukrajini.
              Ljudi najčešće odlaze u Sjedinjene Američke Države.
            </p>

            <span style={{ fontSize: "14px", color: "#555" }}>
              Veći kvadrat znači <b>više stanovnika</b>, a tamnija boja pokazuje <b>više migranata</b>.
            </span>

            <div className="chart-row">
              <DorlingWorld />
            </div>

            <ToggleDetails buttonText="Detalji">
              <p className="notes ">
                Detaljniji pregled migracija u svijetu:{" "}
                <a
                  href="https://worldmigrationreport.iom.int/msite/wmr-2024-interactive/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IOM World Migration Report 2024
                </a>
              </p>

              <p className="notes">
                Izvor ukupnog broja stanovnika (najnoviji dostupni podaci 2024): <a href="https://population.un.org/wpp/downloads?folder=Standard%20Projections&group=Population" target="_blank" rel="noopener noreferrer">UN World Population Prospects</a><br />
                Broj imigranata predstavlja ukupan broj zabilježenih useljenika neke zemlje, a broj emigranata ukupan broj iseljenika (<em>migrant stock</em>).
                <br />Izvor broja migranata (najnoviji dostupni podaci 2023): <a href="https://www.un.org/development/desa/pd/content/international-migrant-stock" target="_blank" rel="noopener noreferrer">UN International Migrant Stock</a><br />

                GNI (bruto nacionalni dohodak) pokazuje ukupni dohodak koji stanovnici zemlje ostvaruju u određenom razdoblju, uključujući plaće, dobit poduzeća, kamate i prihode iz inozemstva.
                GNI per capita dobije se dijeljenjem s brojem stanovnika i često se koristi za prikaz životnog standarda i razvijenosti zemlje.
                <br />Izvor GNI per capita i očekivane dobi (najnoviji dostupni podaci 2023): <a href="https://hdr.undp.org/data-center/human-development-index#/indicies/HDI" target="_blank" rel="noopener noreferrer">UNDP Human Development Index</a><br />

                Izvor glavne religije (najnoviji dostupni podaci 2020): <a href="https://www.pewresearch.org/religion-datasets/" target="_blank" rel="noopener noreferrer">Pew Research Religion Datasets</a>
              </p>
            </ToggleDetails>

          </div>

          
        </section>


      </section>

      




      <style jsx>{`
        .main {
          display: flex;
          padding: 24px;
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          top: 80px;
          left: 24px;
          width: 200px;
          z-index: 99;
        }

        .sidebar li {
          margin-bottom: 14px;
          cursor: pointer;
          color: #555;
        }

        .sidebar li.active {
          font-weight: 600;
          color: #0070f3;
        }

        .content {
          margin-left: 300px;
          width: 100%;
          overflow-x: visible; /* <--- allow children to overflow horizontally */
          color: #444;
        }




.section h1 {
        margin-bottom: 2rem;
        font-size: 3rem; 
        font-weight: 700;
        line-height: 1.2; 
        }

        .section h2 {
        margin-bottom: 2rem;
        font-size: 2rem; 
        font-weight: 700;
        line-height: 1.2; 
        }

        .section a {
        display: inline-block;
        margin-bottom: 2rem;
        font-size: 1.5rem; 
        font-weight: 600;

        }

        .chart-wrapper {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .lede {
          max-width: 640px;
          font-size: 16px;
          line-height: 1.6;
 
        }



       .wide {
          margin-bottom: 32px;
          fontSize: 14px;
          line-height: 1.6;
          color: #555;
        }

        .notes a {
          font-size: 14px;
          line-height: 1.6;
        }

        .chart-row {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        .notes {
          max-width: 950px;
          font-size: 14px;
          line-height: 1.5;
          color: #555;
        }


        @media (max-width: 900px) {
          .sidebar {
            display: none;
          }

          .content {
            margin-left: 0;
          }

          .chart-row {
            flex-direction: column;
            align-items: center;
          }

          .notes {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="mb-0 flex gap-4 text-xs text-slate-400">
        <a href="https://github.com/tvoje-github" className="hover:text-slate-600">GitHub</a>
        <a href="https://linkedin.com/in/tvoje-linkedin" className="hover:text-slate-600">LinkedIn</a>
      </div>
      
    </main >
  );
}
