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






        </main>

      </div >

    </>
  );
}
