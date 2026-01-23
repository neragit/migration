"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObs";

interface CountryData {
  country: string;
  [year: number]: number | null | string;
}

interface Props {
  width: number;
  height: number;
}

interface NodeDatum extends d3.SimulationNodeDatum {
  x: number;
  y: number;
  r: number;
  data: {
    country: string;
    value: number;
  };
}


export default function Mup({ width, height }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<CountryData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2021);
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useResizeObserver(containerRef);

  const isMobile = (size?.width ?? 0) < 900;


  const svgWidth = size?.width ?? isMobile ? 250 : 400;
  const svgHeight = size ? Math.min(isMobile ? 600 : 500, size.width * 0.55) : 300;




  const iconSize = 8;

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
  } | null>(null);

  // ─────────────────────────────────────────────────────
  // Fixed positions per region
  // ─────────────────────────────────────────────────────
  const regionRanges: Record<string, [number, number]> = {
    Europe: [0.1, 0.35],
    Ukraine: [0.45, 0.55],
    MiddleEast: [0.5, 0.55],
    Asia: [0.75, 0.95]
  };

  const countryRegion: Record<string, string> = {
    "Bosna i Hercegovina": "Europe",
    "Srbija": "Europe",
    "Sjeverna Makedonija": "Europe",
    "Kosovo": "Europe",
    "Albanija": "Europe",
    "Ukrajina": "Ukraine",
    "Turska": "MiddleEast",
    "Egipat": "MiddleEast",
    "Nepal": "Asia",
    "Indija": "Asia",
    "Filipini": "Asia",
    "Uzbekistan": "Asia",
    "Bangladeš": "Asia",
  };

  // Store constant node positions
  const nodesRef = useRef<Record<string, { x: number; y: number }>>({});

  // ─────────────────────────────────────────────────────
  // Load CSV
  // ─────────────────────────────────────────────────────
  useEffect(() => {
    d3.csv("/data/mup_top10.csv").then(rawData => {
      const parsed: CountryData[] = rawData.map(row => {
        const countryRow: CountryData = { country: row["Državljanstvo"]! };
        [2021, 2022, 2023, 2024, 2025].forEach(year => {
          countryRow[year] =
            row[year.toString()] === "" || row[year.toString()] == null
              ? 0
              : +row[year.toString()]!;
        });
        return countryRow;
      });
      setData(parsed);
    });
  }, []);

  const filteredData = React.useMemo(
    () =>
      data.map(d => ({
        country: d.country,
        value: (d[selectedYear] as number) || 0
      })),
    [data, selectedYear]
  );

  // ─────────────────────────────────────────────────────
  // Ensure person icon
  // ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    let defs = svg.select<SVGDefsElement>("defs");
    if (defs.empty()) defs = svg.append("defs");

    if (!defs.select("#person-icon").node()) {
      const symbol = defs
        .append("symbol")
        .attr("id", "person-icon")
        .attr("viewBox", "0 0 98 284");

      symbol.append("path")
        .attr(
          "d",
          "M17.877,187.566c-9.675,-3.049 -16.698,-12.099 -16.698,-22.775l0,-79.586c0,-13.176 10.697,-23.874 23.874,-23.874l47.748,0c13.176,0 23.874,10.697 23.874,23.874l0,79.586c0,10.19 -6.398,18.898 -15.394,22.321l0,79.215c0,8.748 -7.102,15.851 -15.851,15.851l-31.702,0c-8.748,0 -15.851,-7.102 -15.851,-15.851l0,-78.762Z"
        )
        .attr("fill", "currentColor");

      symbol.append("circle")
        .attr("cx", 48.927)
        .attr("cy", 25.12)
        .attr("r", 23.941)
        .attr("fill", "currentColor");
    }
  }, []);

  // ─────────────────────────────────────────────────────
  // Draw bubbles with stable positions and smooth transitions
  // ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    if (!filteredData.length) return;

    const radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(filteredData, d => d.value)!])
      .range([10, 45]);

    // Initialize nodes with positions if missing
    const nodes = filteredData.map(d => {
      if (!nodesRef.current[d.country]) {
        const region = countryRegion[d.country] || "Europe";
        const [xMin, xMax] = regionRanges[region];

        nodesRef.current[d.country] = {
          x: width * (xMin + Math.random() * (xMax - xMin)),
          y: height / 2 + (Math.random() - 0.5) * height * 0.15
        };
      }

      return {
        ...nodesRef.current[d.country],
        data: d,
        r: radiusScale(d.value)
      };
    });

    // ───────────── Weak collision once ─────────────
    const sim = d3.forceSimulation<NodeDatum>(nodes)
      .force("x", d3.forceX(d => d.x!).strength(0.05))
      .force("y", d3.forceY(d => d.y!).strength(0.05))
      .force(
        "collide",
        d3.forceCollide(d => {
          const region = countryRegion[d.data.country] || "Europe";
          const baseRadius = d.r * 3;
          return region === "Asia" ? baseRadius * 1.5 : baseRadius;
        })
      )
      .stop();


    for (let i = 0; i < 80; i++) sim.tick();

    nodes.forEach(n => {
      nodesRef.current[n.data.country] = { x: n.x, y: n.y };
    });

    const tableauExtended = [
      ...d3.schemeTableau10,
      ...d3.schemeTableau10.map(c => d3.color(c)!.brighter(0.8).formatHex()),
      ...d3.schemeTableau10.map(c => d3.color(c)!.darker(0.8).formatHex())
    ];

    const color = d3.scaleOrdinal(tableauExtended)
      .domain(filteredData.map(d => d.country));

    // ───────────── DATA JOIN FOR GROUPS ─────────────
    const groups = svg.selectAll<SVGGElement, any>("g.country-group")
      .data(nodes, d => d.data.country);

    groups.exit()
      .transition().duration(500)
      .style("opacity", 0)
      .remove();

    const enterGroups = groups.enter()
      .append("g")
      .attr("class", "country-group")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("opacity", 0);

    enterGroups.transition().duration(500)
      .style("opacity", 1);

    const allGroups = enterGroups.merge(groups);

    // ───────────── ICONS ─────────────
    allGroups.each(function (d) {
      const g = d3.select(this);

      const iconCount = Math.max(1, Math.round(d.data.value / 100));
      const jitter = d.r * d.r / 10;
      const positions = d3.range(iconCount).map(() => {
        const a = Math.random() * Math.PI * 2;
        const rr = Math.random() * jitter;
        return [Math.cos(a) * rr, Math.sin(a) * rr];
      });

      const icons = g.selectAll("use").data(positions);

      icons.style("opacity", 1)


      icons.exit()
        .transition().duration(500)
        .style("opacity", 0)
        .remove();

      icons.enter()
        .append("use")
        .attr("href", "#person-icon")
        .attr("fill", color(d.data.country))
        .attr("transform", ([dx, dy]) =>
          `translate(${dx},${dy}) scale(${iconSize / 250})`
        )
        .style("opacity", 0)
        .on("mousemove", function (event) {
          const parent = this.parentNode as SVGElement; // cast to SVGElement
          const parentData = d3.select(parent).datum() as {
            data: { country: string; value: number };
          };

          const value = parentData.data.value;

          setTooltip({
            x: event.clientX + 10,
            y: event.clientY + 10,
            content:
              value === 0 ? (
                <div>
                  <strong>{parentData.data.country}</strong>
                  <br />
                  Nije u top 10 u navedenoj godini
                </div>
              ) : (
                <div>
                  <strong>{parentData.data.country}</strong>
                  <br />
                  {value.toLocaleString("fr-FR")}
                </div>
              ),
          });
        })


        .on("mouseleave", () => setTooltip(null))

        .transition()
        .duration(500)
        .style("opacity", 1);


      icons.transition().duration(500)
        .attr("transform", ([dx, dy]) =>
          `translate(${dx},${dy}) scale(${iconSize / 250})`
        );
    });

    // ───────────── LABELS LAYER (ALWAYS ON TOP) ─────────────
    let labelsLayer = svg.select<SVGGElement>(".labels-layer");
    if (labelsLayer.empty()) labelsLayer = svg.append("g").attr("class", "labels-layer");

    const labels = labelsLayer.selectAll<SVGTextElement, any>("text")
      .data(nodes, d => d.data.country);

    // remove old labels
    labels.exit().remove();

    // append new labels
    labels.enter()
      .append("text")
      .text(d => d.data.country)
      .attr("x", d => d.x)   // set x only on enter
      .attr("y", d => d.y)   // set y only on enter
      .attr("text-anchor", "middle")
      .attr("font-size", 16)
      .attr("font-weight", 700)
      .attr("fill", "#333")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("paint-order", "stroke")
      .style("pointer-events", "none");



  }, [filteredData, width, height]);


  const years = [2021, 2022, 2023, 2024, 2025];

  // ─────────────────────────────────────────────────────
  // Scroll to change year
  // ─────────────────────────────────────────────────────
  useEffect(() => {
    let lastScrollTime = 0;
    const cooldown = 500; // ms

    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const lockScroll = rect.bottom < window.innerHeight && rect.top > 0;
      if (!lockScroll) return;

      const now = Date.now();
      if (now - lastScrollTime < cooldown) return;

      const currentIndex = years.indexOf(selectedYear);

      if (e.deltaY > 0 && currentIndex < years.length - 1) {
        e.preventDefault();
        setSelectedYear(years[currentIndex + 1]);
        lastScrollTime = now;
      } else if (e.deltaY < 0 && currentIndex > 0) {
        e.preventDefault();
        setSelectedYear(years[currentIndex - 1]);
        lastScrollTime = now;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [selectedYear, years]);


  // ─────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────
  return (
    <div ref={containerRef} style={{ width: "100%", height: "auto" }}>

      <div style={{ display: "flex", gap: 6, marginBottom: 5 }}>
        {years.map(y => (
          <button
            key={y}
            onClick={() => setSelectedYear(y)}
            style={{
              padding: "4px 10px",
              background: selectedYear === y ? "#4e79a7" : "#eee",
              color: selectedYear === y ? "#fff" : "#000",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            {y}
          </button>
        ))}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: "100%", // fills container width
          height: "auto", // keeps aspect ratio
          display: "block",
          overflow: "visible"
        }}
      />


      {tooltip && (
        <div
          className="tooltip"
          style={{
            position: "fixed",
            top: tooltip.y,
            left: tooltip.x,
            opacity: "0.90"
          }}
        >
          {tooltip.content}
        </div>
      )}

    </div>
  );

}
