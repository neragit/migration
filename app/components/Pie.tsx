"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObs"; // size

interface PieSlice {
  group: string;
  count: number;
}

const dataByYear = {
  2021: { procjena: 3862305, stranci: 81995 },
  2022: { procjena: 3850894, stranci: 124121 },
  2023: { procjena: 3861967, stranci: 172499 },
  2024: { procjena: 3874350, stranci: 206529 },
  2025: { procjena: 3874350, stranci: 170723 },
};



const years = Object.keys(dataByYear).map(Number).sort();

const CroatiaPie: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useResizeObserver(containerRef);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
  } | null>(null);
  const [selectedYear, setSelectedYear] = useState(years[0]);

  const createPieData = (year: number): PieSlice[] => {
    const yearData = dataByYear[year as keyof typeof dataByYear]; // Type-safe

    return [
      { group: "Lokalno stanovništvo", count: yearData.procjena - yearData.stranci },
      { group: "Strani radnici", count: yearData.stranci },
    ];
  };


  useEffect(() => {
    if (!size || !svgRef.current) return;

    const data = createPieData(selectedYear);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const parent = svgRef.current.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const sidebar = document.querySelector<HTMLElement>(".sidebar");

    let sidebarVisible = sidebar && sidebar.getBoundingClientRect().width > 0;

    let viewportCenterX = size.vw / 2;
    let smallScreen = size.vw < 1000;


    if (smallScreen && sidebarVisible) {
      viewportCenterX += (sidebar?.offsetWidth || 0) / 2; // nudge right
    }

    const offsetX = viewportCenterX - (parentRect.left + parentRect.width / 2);

    let width = size.width;
    let height = size.width * 0.5;

    let radius = size.vw > 1000 ? window.innerHeight * 0.25
    : Math.max(
      120, // min
      Math.min( // max
        height * (0.3 + 0.25 * Math.pow(size.width / 1200, 0.6)), // original width-based
        window.innerHeight * 0.2 //  landscape cap
      )
    );

    let iconSize = size.vw < 400 ? 8 : 4;

    const perIcon = 6000;


    const g = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2 + offsetX}, ${height / 2})`);


    const defs = svg.append("defs");

    const symbol = defs.append("symbol").attr("id", "pie-icon").attr("viewBox", "0 0 98 284");

    symbol
      .append("path")
      .attr(
        "d",
        "M17.877,187.566c-9.675,-3.049 -16.698,-12.099 -16.698,-22.775l0,-79.586c0,-13.176 10.697,-23.874 23.874,-23.874l47.748,0c13.176,0 23.874,10.697 23.874,23.874l0,79.586c0,10.19 -6.398,18.898 -15.394,22.321l0,79.215c0,8.748 -7.102,15.851 -15.851,15.851l-31.702,0c-8.748,0 -15.851,-7.102 -15.851,-15.851l0,-78.762Z"
      )
      .attr("stroke", "white")
      .attr("stroke-width", 2.36);

    symbol
      .append("circle")
      .attr("cx", 48.927)
      .attr("cy", 25.12)
      .attr("r", 23.941)
      .attr("stroke", "white")
      .attr("stroke-width", 2.36);


    const color = d3
      .scaleOrdinal<string, string>()
      .domain(["Lokalno stanovništvo", "Strani radnici"])
      .range(["#4292c6", "#fdae6b"]);

    const pie = d3
      .pie<PieSlice>()
      .value((d) => d.count)
      .sort(null);

    const arcs = pie(data);

    // helper
    const randomPointInArc = (d: d3.PieArcDatum<PieSlice>): [number, number] => {
      const angle = d.startAngle + Math.random() * (d.endAngle - d.startAngle);
      const r = Math.sqrt(Math.random()) * radius * 0.95;
      return [Math.cos(angle - Math.PI / 2) * r, Math.sin(angle - Math.PI / 2) * r];
    };

    // icon render
    [...arcs]
      .reverse()
      .forEach((d) => {
        const totalIcons = Math.floor(d.data.count / perIcon);
        const iconGroup = g.append("g");

        for (let i = totalIcons - 1; i >= 0; i--) {
          const [x, y] = randomPointInArc(d);

          iconGroup
            .append("use")
            .attr("href", "#pie-icon")
            .attr("xlink:href", "#pie-icon")
            .attr("transform", `translate(${x}, ${y}) scale(${iconSize / 100})`)
            .attr("fill", color(d.data.group))
            .style("opacity", 0.95)
            .on("mousemove", (event) => {
              setTooltip({
                x: event.clientX + 10,
                y: event.clientY + 10,
                content: (
                  <div>
                    <b>{d.data.group}</b>
                    <br />
                    {d.data.count.toLocaleString('fr-FR')} osoba
                  </div>
                ),
              });
            })
            .on("mouseleave", () => setTooltip(null));
        }
      });
  }, [size, selectedYear]);


  useEffect(() => {
    if (!size) return;

    let lastScrollTime = 0;
    const cooldown = 50; // ms

    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();


      const lockScroll = rect.top < size.height && rect.top < 200;
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
  }, [size, selectedYear]);


  const totalWorkers = dataByYear[selectedYear as keyof typeof dataByYear].stranci;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: 1200,
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >

      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",

        }}
      >

        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              style={{
                padding: "6px 12px",
                backgroundColor: y === selectedYear ? "#4292c6" : "#eee",
                color: y === selectedYear ? "white" : "black",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              aria-pressed={y === selectedYear}
              type="button"
            >
              {y}
            </button>
          ))}
        </div>

        <div className="lg:mr-[300px] text-2xl text-[#333333]">
          {new Intl.NumberFormat('fr-FR').format(totalWorkers)} <b>stranih radnika</b>
        </div>

      </div>

      <div className="portrait:pt-20 portrait:pr-5  " >
        <svg
          ref={svgRef}
          className="w-full "
          style={{ overflow: "visible" }}
        />

        {tooltip && (
          <div className="tooltip"
          style={{
              position: "fixed",
              top: tooltip.y,
              left: tooltip.x,
              opacity: 0.9,
              transition: "opacity 0.1s ease-in-out, transform 0.1s ease-out"
            }}
          >
            {tooltip.content}
          </div>
        )}

      </div>

    </div>
  );
};

export default CroatiaPie;
