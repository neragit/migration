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

export default function DorlingWorld() {

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
    };

    const layout: Layout = (() => {
      if (!size) {
        return { width: 500, height: 250, baseScale: 200 };
      }

      const width = size.width * 0.7;

      return {
        width,
        height: width * 0.5,
        baseScale: Math.max(70, Math.min(260, width / 5))
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
      .range([5, 65]);


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
        tooltip.transition().duration(200).style("opacity", 0.90);
        const religionMap = {
          "Christians": "Kršćanstvo",
          "Muslims": "Islam",
          "Unaffiliated": "Neopredjeljeni",
          "Buddhists": "Budizam",
          "Hindus": "Hinduizam",
          "Jews": "Judaizam",
          "Other_religions": "Ostali"
        };

        const major1Label =
          d.major1 && religionMap[d.major1 as keyof typeof religionMap]
            ? religionMap[d.major1 as keyof typeof religionMap]
            : d.major1 ?? "";

        let religionHtml = `${major1Label} ${d.major1_perc != null ? Math.round(d.major1_perc * 100) + "%" : ""
          }`;

        if (d.major2 && d.major2.trim() !== "") {
          const major2Label =
            religionMap[d.major2 as keyof typeof religionMap] ?? d.major2;

          religionHtml += ` ${major2Label} ${d.major2_perc != null ? Math.round(d.major2_perc * 100) + "%" : ""
            }`;
        }


        const migLabel =
          mode === "destination" ? "Broj imigranata" : "Broj emigranata";

        function formatMoney(value?: number | null): string {
          if (typeof value !== "number" || !Number.isFinite(value)) return "";

          if (value >= 1_000_000_000)
            return `${(value / 1_000_000_000).toFixed(1)} mlrd.`;

          if (value >= 1_000_000)
            return `${(value / 1_000_000).toFixed(1)} mil.`;

          return value.toString();
        }


        tooltip.html(`
            <strong>${d.country_hr}</strong><br/>
            Ukupno stanovnika: ${formatMoney(d.total_pop)} (2024)<br/>
            ${migLabel}: ${formatMoney(d.total_mig)}<br/>
            ${typeof d.gni === "number"
            ? `GNI per capita: ${new Intl.NumberFormat("fr-FR").format(
              Math.round(d.gni)
            )} USD<br/>`
            : ""}

            ${d.remit !== null ? `Doznake: ${formatMoney(d.remit)} USD<br/>` : ""}
            ${typeof d.life === "number"
            ? `Očekivana dob: ${Math.round(d.life)} godina<br/>`
            : ""}
            ${typeof d.major1_perc === "number" ? `Glavna religija: ${religionHtml}` : ""}
          `)

          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY + 10) + "px");

      })

      .on("mousemove", (event) => {
        const [x, y] = d3.pointer(event); // relative to the SVG
        tooltip

          .style("left", x + 10 + "px")
          .style("top", y + 10 + "px");
      })


      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
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


  }, [data, worldData, size, mode, animateOnScroll]);



  return (
    <div >
      <div className="flex flex-wrap items-center justify-between gap-5 mt-5 mb pr-[70px]">

        <div className="flex flex-wrap gap-[5px] mb-2.5">

          {["origin", "destination"].map(m => (
            <button
              key={m}
              aria-pressed={mode === m} // for the screen reader
              lang="hr" // Croatian TTS
              onClick={() => setMode(m)}
              style={{
                padding: "5px 10px",
                backgroundColor: mode === m ? "#c51b8a" : "#eee",
                color: mode === m ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
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
          </span> <b>{mode === "destination" ? " imigranata" : " emigranata"}</b>
        </div>

      </div>

      <div
        ref={containerRef}
        className="w-full flex justify-center  mt-20 mb-10 md:mt-10 md:mb-0 "
      >
        <svg ref={svgRef} />

        <div ref={tooltipRef} className="tooltip"></div>
      </div>


    </div>


  );
}
