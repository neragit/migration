"use client";

import Lottie from "lottie-react";

import { useEffect, useState } from "react";
import { ChevronRight, XIcon } from "lucide-react";

import CroatiaMap from "./components/CroatiaMap";
import Treemap from "./components/Treemap";
import MainChart from "./components/MainChart";
import TopImmigrants from "./components/TopImmigrants";
import ListaZanimanja from "./components/ListaZanimanja";
import DorlingWorld from "./components/DorlingWorld";
import ChoroplethCro from "./components/ChoroplethCro";
import ChoroplethHr from "./components/ChoroplethHr";
import Mup from "./components/Mup";
import Pie from "./components/Pie";
import ToggleDetails from "./components/Details";
import PersonBars from "./components/PersonBars";

export default function Home() {

  const [activeSection, setActiveSection] = useState("start");
  const [showLandscapeWarning, setShowLandscapeWarning] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);


  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: landscape)");
    const handler = (e: MediaQueryListEvent) => setShowLandscapeWarning(!e.matches);

    setShowLandscapeWarning(!mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);



  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })


  const sections = [
    { id: "start", label: "Početak" },
    { id: "dorling", label: "Migranti u svijetu" },
    { id: "migration", label: "Trendovi u Hrvatskoj" },
    { id: "hzz", label: "Radne dozvole" },
    { id: "treemap", label: "Tražena zanimanja" },
    { id: "map", label: "Županije" },
    { id: "pie", label: "Udio stranih radnika" },
    { id: "top5", label: "Najčešći imigranti" },
    { id: "choropleth-cro", label: "Godišnji dolasci" },
    { id: "mup", label: "Godišnje stanje" },
    { id: "bars", label: "Migracije Hrvata" },
    { id: "choropleth-hr", label: "Hrvati u inozemstvu" }

  ];


  useEffect(() => {

    const sectionIds = sections.map(s => s.id);

    const handleScroll = () => {
      const scrollY = window.scrollY + 40; // timing
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
      {/*
      {showLandscapeWarning && (
        <div
          id="landscape-warning"
          className="portrait:flex fixed inset-0 bg-white text-gray-800 text-lg justify-center items-center z-999 flex-col"
        >
          <div className="w-24 h-24 mb-4">
            <Lottie
              animationData={require("../public/rotate.json")}
              loop={true}
            />
          </div>
          <p className="mt-4 text-gray-800 text-center">
            Rotirajte mobitel
          </p>

          <button
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setShowLandscapeWarning(false)}
            
          >
            Ne mogu
          </button>
        </div>
      )}
      */}


      {showLandscapeWarning && (
        <div
          id="landscape-warning"
          className="portrait:flex fixed inset-0 bg-white text-gray-800 text-lg justify-center items-center z-999 flex-col"
        >
          <div className="w-24 h-24 mb-4">
            <Lottie
              animationData={require("../public/rotate.json")}
              loop={true}
            />
          </div>
          <p className="mt-4 text-gray-800 text-center">
            Omogućite rotaciju ekrana
          </p>

          <button
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setShowLandscapeWarning(false)}

          >
            U redu
          </button>
        </div>
      )}




      <div className="flex mt-5">
        {!showLandscapeWarning && (
          <div className="fixed z-50 portrait:hidden ">

            <button
              className="
              relative text-sm text-slate-400 hover:text-slate-600 focus:outline-none
              flex items-center gap-1 cursor-pointer pl-4 pb-5
               lg:hidden "
              onClick={() => setSidebarVisible(!sidebarVisible)}
            >
              {sidebarVisible ? (
                <XIcon strokeWidth={3} className="w-4 h-4 transition-transform duration-300" />
              ) : (
                <ChevronRight strokeWidth={3} className="w-4 h-4 transition-transform duration-300" />
              )}
            </button>


            <nav
              className={`sidebar  pb-5 min-w-48 max-w-56 flex-col fixed h-full overflow-y-auto scrollbar-left
                landscape:translate-x-0  
                portrait:hidden 
              transition-transform duration-300 
              ${sidebarVisible ? "block" : "hidden"} 
              lg:block 
              
              ` }
            >

              <ul>
                {sections.map((s) => (
                  <li
                    key={s.id}
                    className={`pb-3 content-ltr  cursor-pointer ${activeSection === s.id ? "font-semibold text-blue-600" : "text-gray-500"}`}
                    onClick={() => scrollTo(s.id)}
                  >
                    {s.label}
                  </li>
                ))}
              </ul>

            </nav>
          </div>
        )}


        <main
          className={`flex-1  min-w-0  text-gray-700 transition-all duration-100
            ${sidebarVisible ? "pl-60" : "pl-5"} lg:pl-52
            portrait:px-7  portrait:overflow-x-clip`}
          id="start"
        >

          <section className=" section !pb-5  flex gap-5 text-xs text-slate-400  " >
            <a href="https://github.com/tvoje-github" className="hover:text-slate-600 focus:outline-none">GitHub</a>
            <a href="https://linkedin.com/in/tvoje-linkedin" className="hover:text-slate-600 focus:outline-none">LinkedIn</a>
          </section>

          <section className="section " >

            <h1 className="mb-8 text-4xl sm:text-5xl font-bold leading-tight">
              Hrvatska u brojkama: <span style={{ color: "#c51b8a" }}>migracije</span>
            </h1>

            <p className="paragraph mb-5">
              Ova je stranica nastala iz jednostavne znatiželje:
              <b> što nam govore podaci?</b>
            </p>

            <p className="paragraph">
              Cilj je pružiti uvid u podatke vezano uz migracije na jednom mjestu, bez
              dramatičnih naslova, subjektivnih interpretacija i reklama.

              Prikazani su najnoviji dostupni podaci iz javno dostupnih izvora (Eurostat, MUP, UN, HZZ i sl.) u siječnju 2026.

            </p>

          </section>

          <section className="section mb-20" id="dorling">

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
              <p className=" max-w-2xl xl:max-w-[950px] text-sm text-[#555]">
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


          
          <section className="section mb-20" id="hzz">

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


          <section className="section mb-20" id="treemap">

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


          


          <section className="section mb-10" id="choropleth-cro">

            <h2>Migranti prema podrijetlu</h2>

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

            <div >
              < ChoroplethCro />
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
              <Mup />
            </div>

          </section>

          <section className="section mb-20" id="bars">

            <h2>Migracije Hrvata</h2>

            <p className="paragraph">
              Najviše Hrvata odlazi 2022. nakon čega se broj smanjuje.
              Otprilike 10 tisuća Hrvata svake godine dolazi u Hrvatsku – ovaj trend blago raste.

              <span> Izvor:{" "}
                <a
                  href="https://podaci.dzs.hr/hr/podaci/stanovnistvo/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DZS
                </a>
              </span>

            </p>

            <div>
              <PersonBars />
            </div>

          </section>

          <section className="section " id="choropleth-hr">

            <h2>A kamo idu Hrvati?</h2>

            <p className="paragraph">
              U 2024. godini Hrvati najčešće odlaze u Njemačku i dolaze iz Njemačke.

              <span> Izvor:{" "}
                <a
                  href="https://podaci.dzs.hr/2025/hr/97255"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DZS
                </a>
              </span>

            </p>

            <div >
              < ChoroplethHr />
            </div>

          </section>




        </main>

      </div >

    </>
  );
}
