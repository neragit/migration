"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import * as d3 from "d3";
import allCountries from "world-countries";



const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function ChoroplethCro() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState("2020");
  const [isClient, setIsClient] = useState(false);
  const years = ["2020", "2021", "2022", "2023"];
  const mapRef = useRef<HTMLDivElement>(null);
  const lockScrollRef = useRef(false);
  const accumulatedDeltaRef = useRef(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => setWindowSize({
      width: windowSize.width,
      height: windowSize.height,
    });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);


  useEffect(() => {
    setIsClient(true);
    d3.csv("/data/hrv_choropleth.csv").then(setCsvData);
  }, []);

useEffect(() => {
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "choropleth-tooltip")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("background", "white")
    .style("padding", "8px")
    .style("border", "1px solid #aaa")
    .style("border-radius", "4px")
    .style("opacity", 0)
    .style("font-size", "12px")
    .style("z-index", "9999");

  return () => {
    tooltip.remove();
    // 👆 explicitly no return value
  };
}, []);


  // Tooltip follow
  useEffect(() => {
    const tooltip = d3.select(".choropleth-tooltip");
    const moveHandler = (e: MouseEvent) => {
      tooltip.style("left", e.pageX + 10 + "px").style("top", e.pageY + 10 + "px");
    };
    document.addEventListener("mousemove", moveHandler);
    return () => document.removeEventListener("mousemove", moveHandler);
  }, []);

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

  // Hover handlers
  const handleHover = (event: any) => {
    const tooltip = d3.select(".choropleth-tooltip");
    if (!event.points || event.points.length === 0) return;
    const pt = event.points[0];
    const code = pt.location;
    const dataEntry = dataMap.get(code);
    if (!dataEntry) return;
    tooltip
      .html(`<b>${dataEntry.country_name}</b><br>${new Intl.NumberFormat('hr-HR').format(dataEntry.value)}`)
      .transition()
      .duration(50)
      .style("opacity", 0.95);
  };

  const handleUnhover = () => {
    d3.select(".choropleth-tooltip").transition().duration(200).style("opacity", 0);
  };

  // Observe when map is fully visible
  useEffect(() => {
    if (!mapRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
          lockScrollRef.current = true; // map fully visible
        } else {
          lockScrollRef.current = false; // map partially/not visible
          accumulatedDeltaRef.current = 0; // reset scroll accumulation
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, [mapRef]);


  useEffect(() => {
    let lastScrollTime = 0; // timestamp of last year change
    const cooldown = 200;   // milliseconds between allowed scrolls

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
      // Otherwise: do NOT prevent default → lets the user scroll past the map
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [selectedYear]);


  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: "10px",
      }}>

        <div style={{  display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
              <span
                style={{
                  display: "inline-block",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: selectedYear === year ? "#4CAF50" : "#eee",
                  color: selectedYear === year ? "#fff" : "#000",
                  userSelect: "none",
                  transition: "all 0.2s ease",
                }}
              >
                {year}
              </span>
            </label>
          ))}
        </div>

        <div style={{ fontSize: "1.5rem", color: "#333" }}>
          {currentTotal?.toFixed(0) ?? "-"}<b> imigranata</b>
        </div>

      </div>

      <div ref={mapRef} style={{
        width: "90vw",     // full viewport width
        height: "90vh",    // full viewport height
        position: "relative",
        left: -310,
        top: 0,
        zIndex: 1,
      }}>
        {isClient && (
          <Plot
            data={[
              {
                type: "choropleth",
                locations,
                z: zValues,
                colorscale: "Greens",
                reversescale: true,
                autocolorscale: false,
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
                showcoastlines: false,
                showframe: false,
              },
              margin: { t: 0, b: 0, l: 0, r: 0 },
              width: mapRef.current?.clientWidth,
              height: mapRef.current?.clientHeight,
              autosize: true,
            }}
            config={{
              responsive: true,
              displaylogo: false,
              scrollZoom: false,
              modeBarButtonsToRemove: ["pan2d", "select2d", "lasso2d"],
            }}
            onHover={handleHover}
            onUnhover={handleUnhover}
          />
        )}
      </div>

      <style>{`
        .choropleth-tooltip {
          transition: transform 0.1s ease-out, opacity 0.1s ease-in-out;
        }
      `}</style>
    </div>
  );
}
