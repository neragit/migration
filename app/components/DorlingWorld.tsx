"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import countries from "i18n-iso-countries";
import hrLocale from "i18n-iso-countries/langs/hr.json";
import useResizeObserver from "../hooks/useResizeObs";

interface DorlingRow {
  origin: string;
  origin_code: string;
  destination: string;
  destination_code: string;
  total_pop: string;
  total_mig: string;
  life?: string;
  gni?: string;
  major1?: string;
  major1_perc?: string;
  major2?: string;
  major2_perc?: string;
  remit?: string;
}

interface ParsedDorlingRow {
  origin: string;
  origin_code: string;
  destination: string;
  destination_code: string;
  total_pop: number;
  total_mig: number;
  life?: number;
  gni?: number;
  major1?: string;
  major1_perc?: number;
  major2?: string;
  major2_perc?: number;
  remit?: number;
}

interface Node extends AggregatedCountry {
  country_hr: string;
  r: number;
  x: number;
  y: number;
  fxTarget: number;
  fyTarget: number;
}

interface CountryFeatureProperties {
  ISO_N3_EH?: string;
  NAME?: string;
  [key: string]: any;
}

interface CountryFeature extends GeoJSON.Feature<GeoJSON.Geometry, CountryFeatureProperties> { }

interface AggregatedCountry {
  country: string;
  country_code: string;
  total_pop: number;
  total_mig: number;
  life?: number;
  gni?: number;
  major1?: string;
  major1_perc?: number;
  major2?: string;
  major2_perc?: number;
  remit?: number | null;
}

type Props = {
  sidebarVisible?: boolean;
  scaleOverride?: number;
  metaPage?: boolean; 
};

export default function DorlingWorld({ sidebarVisible, scaleOverride, metaPage }: Props) {


  type CountryFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, CountryFeatureProperties>;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const animationDoneRef = useRef(false);


  const containerRef = useRef<HTMLDivElement | null>(null);
  const size = useResizeObserver(containerRef);

  const [data, setData] = useState<ParsedDorlingRow[]>([]);
  const [worldData, setWorldData] = useState<CountryFeatureCollection | null>(null);
  const [mode, setMode] = useState("origin");
  const [totalMig, setTotalMig] = useState(0);

  const [animateOnScroll, setAnimateOnScroll] = useState(false);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
    opacity: number;
  } | null>(null);


  useEffect(() => {
    const handleScroll = () => {
      setAnimateOnScroll(true); // trigger once
      window.removeEventListener("scroll", handleScroll);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  countries.registerLocale(hrLocale);

  useEffect(() => {
    d3.csv("/data/dorling.csv", (d: DorlingRow): ParsedDorlingRow => ({
      origin: d.origin,
      origin_code: d.origin_code,
      destination: d.destination,
      destination_code: d.destination_code,
      total_pop: +d.total_pop,
      total_mig: +d.total_mig,
      life: d.life ? +d.life : undefined,
      gni: d.gni ? +d.gni : undefined,
      major1: d.major1 ?? "",
      major1_perc: d.major1_perc ? +d.major1_perc : undefined,
      major2: d.major2 ?? "",
      major2_perc: d.major2_perc ? +d.major2_perc : undefined,
      remit: d.remit ? +d.remit : undefined
    }))
      .then((rows: ParsedDorlingRow[]) => setData(rows))
      .catch(error => console.error("Error loading CSV:", error));
  }, []);


  useEffect(() => {
    d3.json("/maps/countries.json")
      .then((json) => setWorldData(json as CountryFeatureCollection))
      .catch(error => console.error("Error loading GeoJSON:", error));
  }, []);


  useEffect(() => {
    if (!data.length || !worldData || !size) return;

    type Layout = {
      width: number;
      height: number;
      baseScale: number;
      sizeRange: [number, number];
    };

    const layout: Layout = (() => {
      if (!size) {
        return { width: 500, height: 250, baseScale: 200, sizeRange: [5, 65] };
      }

      let width = size.width * (size.width < 500 ? 0.8 : 0.9);
      let baseScale = scaleOverride ?? Math.max(60, Math.min(260, width / 5));


      return {
        width,
        height: width * 0.5,
        baseScale,
        sizeRange: [5, Math.max(10, Math.min(65, width / 8))],
      };
    })();


    if (!svgRef.current) return;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${layout.width} ${layout.height}`)
      .style("width", `${layout.width}px`)
      .style("height", `${layout.height}px`)
      .style("max-width", "100%")
      .style("overflow", "visible");


    svg.selectAll("*").remove();


    const maxPop = d3.max(data, d => d.total_pop) ?? 0;
    const sizeScale = d3.scaleSqrt()
      .domain([0, maxPop])
      .range(layout.sizeRange);


    const countryData: AggregatedCountry[] = Object.values(
      data
        .filter(d => mode === "destination" ? d.destination !== "World" : d.origin !== "World")
        .reduce<Record<string, AggregatedCountry>>((acc, d) => {
          const key = mode === "destination" ? d.destination_code : d.origin_code;

          if (!acc[key]) {
            acc[key] = {
              country: mode === "destination" ? d.destination : d.origin,
              country_code: key,
              total_pop: d.total_pop,
              total_mig: d.total_mig,
              life: d.life,
              gni: d.gni,
              major1: d.major1,
              major1_perc: d.major1_perc,
              major2: d.major2,
              major2_perc: d.major2_perc,
              remit: d.remit ?? null
            };
          } else {
            acc[key].total_mig += d.total_mig;
          }
          return acc;
        }, {})
    );

    // sum
    const totalMigration = countryData.reduce((sum, d) => sum + d.total_mig, 0);
    setTotalMig(totalMigration);

    const maxMig = d3.max(countryData, d => d.total_mig) ?? 1;

    const colorScale = d3.scaleLinear<string>()
      .domain([0, maxMig])
      .range(["#fff0f5", "#c51b8a"]);



    const tooltip = d3.select(tooltipRef.current);

    tooltip.style("position", "absolute");


    const polyProjection = d3.geoNaturalEarth1()
      .scale(layout.baseScale)
      .rotate([120, 0])
      .translate([layout.width / 2, layout.height / 2]);

    const pointProjection = d3.geoNaturalEarth1()
      .scale(layout.baseScale)
      .rotate([-60, 0])
      .translate([layout.width / 2, layout.height / 2]);


    const centroids: Record<string, { x: number; y: number }> = {};
    const isPointFeature: Record<string, boolean> = {};

    worldData.features.forEach((f: CountryFeature) => {
      const code = f.properties.ISO_N3_EH?.trim();
      if (!code) return;

      if (f.geometry.type === "Point") {
        const coords = f.geometry.coordinates as [number, number];
        const projected = pointProjection(coords);
        if (!projected) return;

        const [x, y] = projected;
        centroids[code] = { x, y };
        isPointFeature[code] = true;
      } else {
        const projected = polyProjection(d3.geoCentroid(f));
        if (!projected) return;

        const [x, y] = projected;
        centroids[code] = { x, y };
        isPointFeature[code] = false;
      }
    });


    const nodes: Node[] = countryData.map(d => {

      const csvCode = String(d.country_code).padStart(3, "0");
      const centroid = centroids[csvCode];
      const pointFeature = isPointFeature[csvCode];
      const croName = countries.getName(csvCode, 'hr', { select: "official" }) || d.country;

      return {
        ...d,
        country_hr: croName,
        r: sizeScale(d.total_pop),
        x: centroid ? centroid.x : layout.width / 2,
        y: centroid ? (pointFeature ? centroid.y : layout.height - centroid.y) : layout.height / 2,
        fxTarget: centroid ? centroid.x : layout.width / 2,
        fyTarget: centroid ? (pointFeature ? centroid.y : layout.height - centroid.y) : layout.height / 2,
      };
    });


    const g = svg.append("g").attr("class", "nodes-group");


    // after array
    const simulation = d3.forceSimulation<Node>(nodes)
      .force("x", d3.forceX<Node>(d => d.fxTarget).strength(0.05))
      .force("y", d3.forceY<Node>(d => d.fyTarget).strength(0.05))
      .force("collide", d3.forceCollide<Node>(d => d.r * 0.5))
      .stop();


    // Run the simulation for a few ticks
    for (let i = 0; i < 50; i++) simulation.tick();

    const rects = svg
      .append("g")
      .selectAll("rect")
      .data(nodes)
      .join("rect")
      .attr("x", d => d.x - d.r / 2)
      .attr("y", d => d.y - d.r / 2)
      .attr("width", d => d.r)
      .attr("height", d => d.r)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("fill", d => colorScale(d.total_mig))
      .attr("stroke", "#fde0dd")
      .attr("fill-opacity", 0)
      .attr("transform", "scale(0.1)")

      .on("mouseover", (event, d) => {

        const containerRect = containerRef.current!.getBoundingClientRect();

        d3.select(event.currentTarget).attr("stroke", "#ff00ff");
        const migLabel = mode === "destination" ? "Broj useljenika" : "Broj iseljenika";
        const religionMap = { "Christians": "Kršćanstvo", "Muslims": "Islam", "Unaffiliated": "Neopredjeljeni", "Buddhists": "Budizam", "Hindus": "Hinduizam", "Jews": "Judaizam", "Other_religions": "Ostali" };
        let religionHtml = d.major1 ? (religionMap[d.major1 as keyof typeof religionMap] ?? d.major1) : "";
        if (d.major1_perc != null) religionHtml += ` ${Math.round(d.major1_perc * 100)}%`;
        if (d.major2) religionHtml += ` ${(religionMap[d.major2 as keyof typeof religionMap] ??
          d.major2)} ${d.major2_perc != null ?
            Math.round(d.major2_perc * 100) + "%" : ""}`;
        function formatMoney(value?: number | null) {
          if (!value) return "";
          if (value >= 1e9) return (value / 1e9).toFixed(2) + " mlrd.";
          if (value >= 1e6) return (value / 1e6).toFixed(2) + " mil.";
          return value.toString();
        }
        setTooltip({
          x: event.clientX - containerRect.left + 10,
          y: event.clientY - containerRect.top + 10,
          content: (
            <div>
              <strong>{d.country_hr}</strong><br />
              Ukupno stanovnika: {formatMoney(d.total_pop)} (2024)<br />
              {migLabel}: {formatMoney(d.total_mig)}<br />
              {d.gni != null && <>GNI per capita: {new Intl.NumberFormat('fr-FR').format(Math.round(d.gni))} USD<br /></>}
              {d.remit != null && <>Doznake: {formatMoney(d.remit)} USD<br /></>}
              {d.life != null && <>Očekivana dob: {Math.round(d.life)} godina<br /></>}

              {d.major1_perc != null ? `Glavna religija: ${religionHtml}` : ""}
            </div>
          ),
          opacity: 0.9,
        });



      })
      .on("mousemove", event => {
        const containerRect = containerRef.current!.getBoundingClientRect();
        setTooltip(prev => prev
          ? {
            ...prev,
            x: event.clientX - containerRect.left + 10,
            y: event.clientY - containerRect.top + 10
          }
          : null
        );

      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).attr("stroke", "#fde0dd");

        setTooltip(prev => prev ? { ...prev, opacity: 0 } : null);
      });


    if (animateOnScroll && !animationDoneRef.current) {
      rects
        .attr("transform-origin", d => `${d.x}px ${d.y}px`) // center of each rect
        .transition()
        .duration(600)
        .delay((_, i) => i * 6)
        .attr("transform", "scale(1)")
        .attr("fill-opacity", 0.5);

      animationDoneRef.current = true; // animation done

    } else if (animationDoneRef.current) {
      rects
        .attr("transform", "scale(1)")
        .attr("fill-opacity", 0.5)
        .attr("transform-origin", d => `${d.x}px ${d.y}px`);
    }


  }, [data, worldData, size, mode, animateOnScroll, scaleOverride, metaPage]);



  return (
    <div >
      <div className={`flex flex-wrap items-center ${metaPage  ? "   justify-center sm:justify-between": "  justify-between"}  gap-5 mt-5 `}>

        <div className="flex flex-wrap  gap-2.5 mb-2.5">

          {["origin", "destination"].map(m => (
            <button
              key={m}
              aria-pressed={mode === m} // for the screen reader
              lang="hr" // Croatian TTS
              onClick={() => setMode(m)}
              className="button"
              style={{
                backgroundColor: mode === m ? "#c51b8a" : "#eee",
                color: mode === m ? "#fff" : "#000",
                userSelect: "none",
              }}
            >
              {m === "origin" ? "Podrijetlo" : "Destinacija"}
            </button>
          ))}

        </div>

        <div style={{ fontSize: "1.5rem", color: "#333" }}>
          <span style={{ animation: "fadeMoveIn 1s forwards" }}>
            {new Intl.NumberFormat('fr-FR').format(totalMig)}
          </span> <b>{mode === "destination" ? " useljenika" : " iseljenika"}</b>
        </div>

      </div>


      <div ref={containerRef} className={`relative w-[80vw] xl:w-[90vw]  flex justify-center
      ${sidebarVisible ? "ml-[-90] w-[80vw] " : "ml-0 w-screen"} xl:ml-[-90] portrait:ml-0 portrait:w-screen
      mt-20 ${metaPage  ? "  mt-30 md:mt-20  lg:mt-10 xl:mt-5  !w-full  md:!ml-20": " md:mt-10"} 
      mb-10 md:mb-0`} >


        
        <svg ref={svgRef} />

        {tooltip && (
          <div
            className="tooltip"
            style={{
              position: "absolute",
              left: Math.min(tooltip.x, (containerRef.current?.clientWidth ?? window.innerWidth) - (window.innerWidth > 1000 ? 300 : 240)),
              top: Math.min(tooltip.y, (containerRef.current?.clientHeight ?? 0) - 200),
              opacity: tooltip.opacity,
              transition: "opacity 0.2s ease",
            }}
          >
            {tooltip.content}
          </div>
        )}


      </div>
    </div>
  );
}