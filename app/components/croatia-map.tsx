"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

type Zahtjev = { zupanija: string; neg: number; poz: number; godina: number };

interface CroatiaMapProps {
  data: Zahtjev[];
}

export default function CroatiaMap({ data }: CroatiaMapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const topoRef = useRef<GeoJSON.FeatureCollection | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [year, setYear] = useState<number>(data[0]?.godina ?? 2021);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);

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

  // ──────────────────────────────────────────────
  // Draw map
  // ──────────────────────────────────────────────
  const draw = () => {
    if (!svgRef.current || !topoRef.current || !dataByYear[year]) return;

    const container = svgRef.current.parentElement!;
    const width = container.clientWidth;

    const maxHeight =
      Math.min(window.innerHeight, document.documentElement.clientHeight) * 0.9;

    const height = Math.min(
      Math.max(350, width * 0.75),
      maxHeight
    );

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
        const name = d.properties?.name;      // optional chaining
        if (!name) return;                    // do nothing if name missing
        const v = selectedData[name.toUpperCase()];
        if (!v) return;

        setTooltip({
          x: event.clientX + 10,
          y: event.clientY + 10,
          content: `${name}\nOdobreno: ${formatNumber(v.pos)}\nNeodobreno: ${formatNumber(v.neg)}`,
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
      <div style={{ display: "flex", gap: "20px", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "10px" }}>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
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
        <div style={{ marginRight: 300, fontSize: "1.5rem", color: "#333" }}>
          {formatNumber(totalYear)} <b> radnika</b>
        </div>
      </div>

      <svg
        ref={svgRef}
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      {tooltip && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y,
            left: tooltip.x,
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: "4px",
            pointerEvents: "none",
            whiteSpace: "pre-line",
            fontSize: "12px",
            zIndex: 9999,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
