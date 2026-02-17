"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import * as d3 from "d3";
import allCountries from "world-countries";
import useResizeObserver from "../hooks/useResizeObs";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type Props = {
  sidebarVisible: boolean;
};

export default function ChoroplethCro({ sidebarVisible }: Props) {



  const [csvData, setCsvData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState("2020");
  const [isClient, setIsClient] = useState(false);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    country: string;
    value: number;
  } | null>(null);
  const years = ["2020", "2021", "2022", "2023"];
  const containerRef = useRef<HTMLDivElement>(null);
  const lockScrollRef = useRef(false);
  const accumulatedDeltaRef = useRef(0);
  const size = useResizeObserver(containerRef);

  const isDesktop = size ? size.width > 768 : true; // fallback to desktop if size unknown

  useEffect(() => {
    setIsClient(true);
    d3.csv("/data/hrv_choropleth.csv").then(setCsvData);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
          lockScrollRef.current = true; // fully visible
        } else {
          lockScrollRef.current = false; // partial/not
          accumulatedDeltaRef.current = 0; // reset
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    let lastScrollTime = 0; // timestamp of last year change
    const cooldown = 200;   // ms

    const handleWheel = (e: WheelEvent) => {
      if (!lockScrollRef.current) return; // only act when map fully visible

      const now = Date.now();
      if (now - lastScrollTime < cooldown) return; // ignore if within cooldown

      const currentIndex = years.indexOf(selectedYear);

      if (e.deltaY > 0 && currentIndex < years.length - 1) {
        e.preventDefault(); // only prevent default if we are actually changing the year
        setSelectedYear(years[currentIndex + 1]);
        lastScrollTime = now;

      } else if (e.deltaY < 0 && currentIndex > 0) {
        e.preventDefault(); // only prevent default if we are actually changing the year
        setSelectedYear(years[currentIndex - 1]);
        lastScrollTime = now;
      }
      // Otherwise: do NOT prevent default, let the user scroll past the map
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [selectedYear]);

  const allCountryISO3 = allCountries.map((c) => c.cca3);
  const locations = allCountryISO3;

  const dataMap = new Map(
    csvData.map((d) => [
      d.country_code,
      { value: parseFloat(d[selectedYear]), country_name: d.EUROSTAT },
    ])
  );

  const zValues = allCountryISO3.map((code) => dataMap.get(code)?.value ?? null);
  const numericZ = zValues.filter((v) => v != null) as number[];
  const zmin = Math.min(...numericZ);
  const zmax = Math.max(...numericZ);
  const markerColors = zValues.map((v) => (v == null ? "#eeeeee" : undefined));

  const currentTotal = React.useMemo(() => {
    const stats: Record<string, number> = {};
    years.forEach((year) => {
      const yearData = csvData.map((d) => parseFloat(d[year])).filter((v) => !isNaN(v));
      stats[year] = d3.sum(yearData);
    });
    return stats[selectedYear] ?? 0;
  }, [csvData, selectedYear]);

  const handleHover = (event: any) => {
    if (!event.points || event.points.length === 0) return;
    const pt = event.points[0];
    const code = pt.location;
    const dataEntry = dataMap.get(code);
    if (!dataEntry) return;

    setTooltip({
      x: event.event.clientX + 10,
      y: event.event.clientY + 10,
      country: dataEntry.country_name,
      value: dataEntry.value,
    });
  };

  const handleUnhover = () => {
    setTooltip(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip) {
      setTooltip(prev => prev ? { ...prev, x: e.clientX + 10, y: e.clientY + 10 } : null);
    }
  };

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: "10px",
        gap: "20px",
      }}>

        <div className="flex flex-wrap gap-1.5">
          {years.map((year) => (
            <label key={year} style={{ display: "inline-block" }}>
              <input
                type="radio"
                name="year"
                value={year}
                checked={selectedYear === year}
                onChange={() => setSelectedYear(year)}
                style={{ display: "none" }}
              />
              <span className="button"
                style={{
                  display: "inline-block",
                  backgroundColor: selectedYear === year ? "#4CAF50" : "#eee",
                  color: selectedYear === year ? "#fff" : "#000",
                  userSelect: "none",
                }}
              >
                {year}
              </span>
            </label>
          ))}
        </div>

        <div style={{ fontSize: "1.5rem", color: "#333" }}>
          {new Intl.NumberFormat('fr-FR').format(currentTotal)} <b> imigranata</b>
        </div>

      </div>


      <div ref={containerRef} className={`relative top-0 z-10 justify-center 
       ${sidebarVisible ? " ml-[-80]  " : "ml-0  "} w-[95vw] lg:ml-[-60]  portrait:w-screen portrait:ml-0 `}
       onMouseMove={handleMouseMove}>

        {isClient && (
          <Plot
            data={[
              {
                type: "choropleth",
                locations,
                z: zValues,
                colorscale: "Greens",
                reversescale: true,
                zmin,
                zmax,
                marker: { line: { color: "white", width: 0.5 }, color: markerColors },
                showscale: false,
                hoverinfo: "none",
                hovertemplate: "",
              },
            ]}
            layout={{
              geo: {
                projection: { type: "natural earth" },
                center: {
                  lon: 40,
                  lat: 0,
                },

                showcoastlines: false,
                showframe: false,

              },
              margin: { t: 0, b: 0, l: 0, r: 0 },
              width: size?.width,
              height: (size?.width ?? 0) * 0.5,
              autosize: true,
              dragmode: isDesktop ? "pan" : false,

            }
            }
            config={{
              responsive: true,
              displaylogo: false,
              scrollZoom: false,
              displayModeBar: false,
            }}
            onHover={handleHover}
            onUnhover={handleUnhover}
          />
        )}
      </div>

      {tooltip && (
        <div
          className="tooltip"
          style={{
            position: "fixed",
            left: Math.min(tooltip.x, window.innerWidth - 100),
            top: Math.min(tooltip.y, window.innerHeight - 50),
            opacity: 0.9,
            transition: "opacity 0.1s ease-in-out, transform 0.1s ease-out",
          }}
        >
          <b>{tooltip.country}</b>
          <br />
          {new Intl.NumberFormat('fr-FR').format(tooltip.value)}
        </div>
      )}

    </div>
  );
}