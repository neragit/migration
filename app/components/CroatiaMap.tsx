"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

type Zahtjev = { zupanija: string; neg: number; poz: number; godina: number };

export default function CroatiaMap() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const topoRef = useRef<GeoJSON.FeatureCollection | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [data, setData] = useState<Zahtjev[]>([]);
  const [year, setYear] = useState<number>(2021);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: React.ReactNode; // allow JSX
  } | null>(null);


  // ──────────────────────────────────────────────
  // Load CSV data
  // ──────────────────────────────────────────────
  useEffect(() => {
    d3.csv("/data/zahtjevi.csv").then((raw) => {
      const parsed = raw.map((d: any) => ({
        zupanija: d.zupanija,
        neg: +d.neg,
        poz: +d.poz,
        godina: +d.godina,
      }));
      setData(parsed);
      if (parsed.length) setYear(parsed[0].godina);
    });
  }, []);

  const countyMap: Record<string, string> = {
    "GRAD ZAGREB": "ZAGREB",
    "ZAGREBA?KA": "ZAGREBAČKA",
    "KARLOVA?KA": "KARLOVAČKA",
    "KOPRIVNI?KO-KRI�EVA?KA": "KOPRIVNIČKO-KRIEVAČKA",
    "ME?IMURSKA": "MEĐIMURSKA",
    "LI?KO-SENJSKA": "LIČKO-SENJSKA",
    "SISA?KO-MOSLAVA?KA": "SISAČKO-MOSLAVAČKA",
    "OSJE?KO-BARANJSKA": "OSJEČKO-BARANJSKA",
    "PO�E�KO-SLAVONSKA": "POŽEŠKO-SLAVONSKA",
    "�IBENSKO-KNINSKA": "ŠIBENSKO-KNINSKA",
    "VARA�DINSKA": "VARAŽDINSKA",
    "VIROVITI?KO-PODRAVSKA": "VIROVITIČKO-PODRAVSKA",
    "DUBROVA?KO-NERETVANSKA": "DUBROVAČKO-NERETVANSKA",
    "PRIMORSKO-GORANSKA": "PRIMORSKO-GORANSKA",
    "SPLITSKO-DALMATINSKA": "SPLITSKO-DALMATINSKA",
    "ISTARSKA": "ISTARSKA",
    "BJELOVARSKO-BILOGORSKA": "BJELOVARSKO-BILOGORSKA",
    "BRODSKO-POSAVSKA": "BRODSKO-POSAVSKA",
    "KRAPINSKO-ZAGORSKA": "KRAPINSKO-ZAGORSKA",
    "ZADARSKA": "ZADARSKA",
    "VUKOVARSKO-SRIJEMSKA": "VUKOVARSKO-SRIJEMSKA",
  };

  const dataByYear: Record<number, Record<string, { pos: number; neg: number }>> = {};
  data.forEach(d => {
    const cleanName = countyMap[d.zupanija] || d.zupanija.toUpperCase();
    if (!dataByYear[d.godina]) dataByYear[d.godina] = {};
    dataByYear[d.godina][cleanName] = { pos: d.poz, neg: d.neg };
  });

  const years = Object.keys(dataByYear).map(Number).sort((a, b) => a - b);

  const maxPosGlobal = Math.max(
    ...Object.values(dataByYear).flatMap(y =>
      Object.values(y).map(v => v.pos)
    )
  );

  const totalYear = dataByYear[year]
    ? Object.values(dataByYear[year]).reduce(
      (sum, v) => sum + v.pos + v.neg,
      0
    )
    : 0;

  const formatNumber = (num: number) => num.toLocaleString("fr-FR");

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
  }, []);

  // ──────────────────────────────────────────────
  // Load TopoJSON
  // ──────────────────────────────────────────────
  useEffect(() => {
    d3.json("/maps/zupanije.topojson").then((topology: any) => {
      topoRef.current = topojson.feature(
        topology,
        topology.objects.zupanije_srpj
      ) as GeoJSON.FeatureCollection;
      draw();
    });
  }, []);

  const draw = () => {
    if (!svgRef.current || !topoRef.current || !dataByYear[year]) return;


    const container = svgRef.current.parentElement!;
    const width = container.clientWidth;
    let height = width * 0.75; // default proportional

    // Minimum height for small phones
    if (width < 800) height = 350;

    // Cap the height to a maximum so it doesn't get huge on large screens
    const maxHeight = 600;
    if (height > maxHeight) height = maxHeight;



    const svg = d3.select(svgRef.current);

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const projection = d3.geoMercator();
    projection.fitSize(
      [width * 0.85, height - 40],
      topoRef.current
    );

    const path = d3.geoPath(projection);

    const color = d3
      .scaleSequential(d3.interpolateGreens)
      .domain([0, maxPosGlobal]);

    const selectedData = dataByYear[year];

    const paths = svg
      .selectAll<SVGPathElement, any>("path")
      .data(topoRef.current.features);

    paths
      .enter()
      .append("path")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.6)
      .merge(paths as any)

      .attr("d", path)
      .attr("fill", d => {
        const name = d.properties?.name?.toUpperCase();
        if (!name) return "#eee";                        // return default color if name is missing
        const v = selectedData[name];
        return v ? color(v.pos) : "#eee";
      })

      .on("mousemove", (event, d) => {
        const name = d.properties?.name;
        if (!name) return;

        const v = selectedData[name.toUpperCase()];
        if (!v) return;

        setTooltip({
          x: event.clientX + 10,
          y: event.clientY + 10,
          content: (
            <div>
              <b>{name}</b>
              <br />
              Odobreno: {formatNumber(v.pos)}
              <br />
              Neodobreno: {formatNumber(v.neg)}
            </div>
          ),
        });
      })
      .on("mouseleave", () => setTooltip(null));


    paths.exit().remove();
  };

  useEffect(() => {
    draw();
  }, [year, data]);

  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ──────────────────────────────────────────────
  // Scroll to change year
  // ──────────────────────────────────────────────
  useEffect(() => {
    let lastScrollTime = 0;
    const cooldown = 50; // ms

    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const lockScroll = rect.top < window.innerHeight && rect.top < 200;
      if (!lockScroll) return;

      const now = Date.now();
      if (now - lastScrollTime < cooldown) return;

      const currentIndex = years.indexOf(year);

      if (e.deltaY > 0 && currentIndex < years.length - 1) {
        e.preventDefault();
        setYear(years[currentIndex + 1]);
        lastScrollTime = now;
      } else if (e.deltaY < 0 && currentIndex > 0) {
        e.preventDefault();
        setYear(years[currentIndex - 1]);
        lastScrollTime = now;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [year, years]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >

      <div className="flex gap-5 flex-wrap justify-between items-start max-w-[850px] mb-10">


        <div style={{ display: "flex", gap: "5px" }}>
          {years.map(y => (
            <button
              key={y}
              onClick={() => setYear(y)}
              style={{
                padding: "5px 10px",
                backgroundColor: y === year ? "#4CAF50" : "#eee",
                color: y === year ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {y}
            </button>
          ))}
        </div>
        <div className="text-2xl text-gray-800 ">

          {formatNumber(totalYear)}<b> radnika</b>
        </div>
      </div>

      <svg
        ref={svgRef}
        className="w-full max-w-full h-auto block ml-5 xl:ml-0 "
      />


      {tooltip && (
        <div
          className="tooltip"
          style={{
            position: "fixed",
            top: tooltip.y,
            left: tooltip.x,
            opacity: 0.90,
            transition: "opacity 0.1s ease-in-out, transform 0.1s ease-out",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
