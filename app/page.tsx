"use client";

import { useEffect, useState } from "react";
import CroatiaMap from "./components/CroatiaMap";
import Treemap from "./components/Treemap";
import MainChart from "./components/MainChart";
import TopImmigrants from "./components/TopImmigrants";
import ListaZanimanja from "./components/ListaZanimanja";
import DorlingWorld from "./components/DorlingWorld";
import ChoroplethCro from "./components/ChoroplethCro";
import Mup from "./components/Mup";
import ToggleDetails from "./components/Details";

export default function Home() {

  const [activeSection, setActiveSection] = useState("start");

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  const sections = [
    { id: "start", label: "Početak" },
    { id: "dorling", label: "Migranti u svijetu" },
    { id: "migration", label: "Migracije" },
    { id: "hzz", label: "Radne dozvole" },
    { id: "treemap", label: "Tražena zanimanja" },
    { id: "map", label: "Županije" },
    { id: "choropleth-cro", label: "Godišnji dolasci" },
    { id: "top5", label: "Najčešći imigranti" },
    { id: "mup", label: "Godišnje stanje" }

  ];

  useEffect(() => {

    const sectionIds = sections.map(s => s.id);

    const handleScroll = () => {
      const scrollY = window.scrollY + 40; // offset
      let current = "start"; // default

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


  return (
    <>
    <div id="landscape-warning">
            📱 Please rotate your device to landscape to view this site.
          </div>
      <div className="flex">
        <nav className="sidebar fixed top-0 left-6 w-52 z-50 pt-10">

          <ul>
            {sections.map((s) => (
              <li
                key={s.id}
                className={`mb-3 cursor-pointer ${activeSection === s.id ? "font-semibold text-blue-600" : "text-gray-500"
                  }`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </li>
            ))}
          </ul>

          <div className="fixed bottom-4 left-6 flex gap-4 text-xs text-slate-400 z-50 ">
            <a href="https://github.com/tvoje-github" className="hover:text-slate-600 focus:outline-none">GitHub</a>
            <a href="https://linkedin.com/in/tvoje-linkedin" className="hover:text-slate-600 focus:outline-none">LinkedIn</a>
          </div>

        </nav>


        <main className="ml-[350px] w-full overflow-x-visible text-gray-700" >

          <section className="section !pt-6 " id="start">

            <h1 className="mb-8 text-5xl font-bold leading-tight">
              Hrvatska u brojkama: <span style={{ color: "#c51b8a" }}>migracije</span>
            </h1>

            <p className="paragraph mb-5">
              Ova je stranica nastala iz jednostavne znatiželje:
              <b> što nam govore podaci?</b>
            </p>

            <p className="paragraph">
              Cilj je pružiti uvid u podatke vezano uz migracije na jednom mjestu, bez
              dramatičnih naslova, subjektivnih interpretacija i reklama.

              Podaci su prikupljeni u siječnju 2026. iz javno dostupnih izvora (Eurostat, MUP, UN, HZZ i sl.).
              Ponekad nema dostupnih podataka za prethodnu godinu, ali <b>možemo promatrati trendove</b>.
            </p>

          </section>

          <section className="section " id="dorling">

            <h2>Tko odlazi i kamo ide?</h2>

            <p className="paragraph ">
              Velike zemlje poput Indije i Kine, imaju i velik broj emigranata.
              Osim ekonomskih razloga, do migracija često dolazi zbog ratova i konflikata, primjerice u Siriji i Ukrajini.
              Ljudi najčešće odlaze u Sjedinjene Američke Države.
            </p>

            <span className="paragraph">
              Veći kvadrat predstavlja <b>više stanovnika</b>, a tamnija boja pokazuje <b>više migranata</b>.
            </span>

            <div>
              < DorlingWorld />
            </div>


            <ToggleDetails buttonText="Detalji">
              <p className=" max-w-[950px] text-sm text-[#555]">
                Detaljniji pregled migracija u svijetu:{" "}
                <a href="https://worldmigrationreport.iom.int/msite/wmr-2024-interactive/" target="_blank" rel="noopener noreferrer" > IOM World Migration Report 2024 </a>

                <br /><br />Izvor ukupnog broja stanovnika (najnoviji dostupni podaci 2024):{" "}
                <a href="https://population.un.org/wpp/downloads?folder=Standard%20Projections&group=Population" target="_blank" rel="noopener noreferrer">UN World Population Prospects</a>

                <br /><br />Broj imigranata predstavlja ukupan broj zabilježenih useljenika neke zemlje, a broj emigranata ukupan broj iseljenika (<em>migrant stock</em>).
                Izvor broja migranata (najnoviji dostupni podaci 2023):{" "}
                <a href="https://www.un.org/development/desa/pd/content/international-migrant-stock" target="_blank" rel="noopener noreferrer">UN International Migrant Stock</a>

                <br /><br />GNI (bruto nacionalni dohodak) pokazuje ukupni dohodak koji stanovnici zemlje ostvaruju u određenom razdoblju, uključujući plaće, dobit poduzeća, kamate i prihode iz inozemstva.
                GNI per capita dobije se dijeljenjem s brojem stanovnika i često se koristi za prikaz životnog standarda i razvijenosti zemlje.
                <br /><br />Izvor GNI per capita i očekivane dobi (najnoviji dostupni podaci 2023):{" "}
                <a href="https://hdr.undp.org/data-center/human-development-index#/indicies/HDI" target="_blank" rel="noopener noreferrer">UNDP Human Development Index</a>

                <br /><br />Izvor glavne religije (najnoviji dostupni podaci 2020):{" "}
                <a href="https://www.pewresearch.org/religion-datasets/" target="_blank" rel="noopener noreferrer">Pew Research Religion Datasets</a>
              </p>
            </ToggleDetails>

          </section>


          <section className="section pb-20" id="migration">

            <h2>
              U Hrvatskoj se mijenjaju trendovi
            </h2>

            <p className="paragraph">
              Od 2022. godine Hrvatska bilježi više useljenika nego iseljenika.
            </p>

            <MainChart />

          </section>

          <section className="section pb-20" id="hzz">

            <h2>HZZ – Radne dozvole i test tržišta rada</h2>
            <p className="paragraph mb-10">
              2020. godine vlada uvodi test tržišta rada, koji je osmišljen kao zamjena za kvotni sustav.
              Hrvatski zavod za zapošljavanje provodi test i donosi mišljenje o zahtjevu poslodavca.
            </p>
            <a className="inline-block mb-8 !text-2xl "
              href="https://www.hzz.hr/usluge/radne-dozvole-za-zaposljavanje-stranaca-i-test-trzista-rada/?tab=dokumenti"
              target="_blank"
              rel="noopener noreferrer"
            >
              Iznimke za koje test <b className="text-green-800">nije potreban</b>
            </a>

            <ListaZanimanja />

          </section>


          <section className="section pb-20" id="treemap">

            <h2>Koje poslove obavljaju strani radnici?</h2>

            <p className="paragraph">
              Svaka prikazana osoba predstavlja <b>650 radnika</b>, a tamnija boja pokazuje <b>višu prosječnu plaću</b> po zanimanju.
            </p>

            <div className="mt-10">
              <Treemap />
            </div>


          </section>


          <section className="section " id="map">

            <h2>Odobreni zahtjevi po županijama</h2>

            <CroatiaMap />

          </section>


          <section className="section " id="choropleth-cro">

            <h2>Odakle dolazi najviše migranata?</h2>

            <p className="paragraph">
              2022. godine u Hrvatsku dolazi značajan broj migranata iz Ukrajine i Azije.

              <span> Izvor:{" "}
                <a
                  href="https://ec.europa.eu/eurostat/web/migration-asylum/international-migration-citizenship/database"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Eurostat
                </a>
              </span>

            </p>

            <div className=" ml-0 ">
              < ChoroplethCro />
            </div>

          </section>


          <section className="section pb-20" id="top5">

            <h2>Kako se mijenjaju trendovi?</h2>

            <p className="paragraph">
              Nakon 2023. broj migranata iz Ukrajine se smanjuje, dok broj migranata iz Azije nastavlja rasti.
            </p>

            <div>
              <TopImmigrants width={740} height={420} />
            </div>

          </section>

          <section className="section " id="mup">

            <h2>Tko radi i boravi u Hrvatskoj?</h2>

            <p className="paragraph">
              Prema podacima Ministarstva unutarnjih poslova, u Hrvatskoj je 2025. bilo podjednako osoba iz BiH i Nepala.
              Iako je tijekom 2022. i 2023. u Hrvatsku migriralo više od 20 000 osoba iz Ukrajine, broj koji se zadržao u 2025. puno je manji.
              U odnosu na prethodnu 2024. godinu, povećao se jedino broj osoba iz Filipina.

              <span> Izvor:{" "}
                <a
                  href="https://mup.gov.hr/gradjani-281562/moji-dokumenti-281563/stranci-333/statistika-169019/169019"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MUP
                </a>
              </span>

            </p>

            <div>
              <Mup width={900} height={600} />
            </div>

          </section>




        </main>

      </div >

    </>
  );
}
