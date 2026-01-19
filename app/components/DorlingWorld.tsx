"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import countries from "i18n-iso-countries";
import hrLocale from "i18n-iso-countries/langs/hr.json";



export default function DorlingWorld() {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [worldData, setWorldData] = useState(null); // <-- load GeoJSON dynamically
  const [mode, setMode] = useState("origin");
  const [totalMig, setTotalMig] = useState(0);


  // Register Croatian locale
  countries.registerLocale(hrLocale);


  // Load CSV
  useEffect(() => {
    d3.csv("/data/dorling.csv", d => ({
      ...d,
      total_pop: +d.total_pop,
      total_mig: +d.total_mig,
      life: d.life ? +d.life : null,
      gni: d.gni ? +d.gni : null,
      major1_perc: d.major1_perc ? +d.major1_perc : null,
      major2_perc: d.major2_perc ? +d.major2_perc : null,
      remit: d.remit ? +d.remit : null,
    })).then(setData);
  }, []);

  // Load GeoJSON dynamically from public folder
  useEffect(() => {
    d3.json("/maps/countries.json").then(setWorldData);
  }, []);

  useEffect(() => {
    if (!data.length || !worldData) return;

    const width = 1000;
    const height = 500;
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");

    svg.selectAll("*").remove(); // Clear previous drawing

    // Scale for square sizes
    const sizeScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.total_pop)])
      .range([5, 70]);

    // Filter out "World" and aggregate by country
    const countryData = Object.values(
      data
        .filter(d => mode === "destination" ? d.destination !== "World" : d.origin !== "World")
        .reduce((acc, d) => {
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
              remit: d.remit ? +d.remit : null
            };
          } else {
            acc[key].total_mig += d.total_mig;
          }
          return acc;
        }, {})
    );

    // Sum of total migration (immigrants or emigrants depending on mode)
    const totalMigration = countryData.reduce((sum, d) => sum + d.total_mig, 0);
    setTotalMig(totalMigration);



    // Color scale based on total_mig
    const colorScale = d3.scaleLinear()
      .domain([0, d3.max(countryData, d => d.total_mig)])
      .range(["#fff0f5", "#c51b8a"]);

    // Tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "dorling-tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("background", "white")
      .style("padding", "8px")
      .style("border", "1px solid #aaa")
      .style("border-radius", "4px")
      .style("opacity", 0);

    const polyProjection = d3.geoNaturalEarth1()
      .scale(160)
      .rotate([120, 0]) // rotation applied only to polygons
      .translate([width / 2, height / 2]);

    const pointProjection = d3.geoNaturalEarth1()
      .scale(160)
      .rotate([-60, 0])
      .translate([width / 2, height / 2]); // no rotation

    const centroids = {};
    const isPointFeature = {};

    worldData.features.forEach(f => {
      const code = f.properties.ISO_N3_EH?.trim();
      if (!code) return;

      if (f.geometry.type === "Point") {
        // Use point projection (no rotation)
        const [x, y] = pointProjection(f.geometry.coordinates);
        centroids[code] = { x, y };
        isPointFeature[code] = true;
      } else {
        // Polygon centroid with rotation
        const [x, y] = polyProjection(d3.geoCentroid(f));
        centroids[code] = { x, y };
        isPointFeature[code] = false;
      }
    });


    const nodes = countryData.map(d => {
      const csvCode = String(d.country_code).padStart(3, "0");
      const centroid = centroids[csvCode];
      const pointFeature = isPointFeature[csvCode];
      const croName = countries.getName(csvCode, 'hr', { select: "official" }) || d.country;

      return {
        ...d,
        country_hr: croName,
        r: sizeScale(d.total_pop),
        x: centroid ? centroid.x : width / 2,
        y: centroid ? (pointFeature ? centroid.y : height - centroid.y) : height / 2,
        fxTarget: centroid ? centroid.x : width / 2,
        fyTarget: centroid ? (pointFeature ? centroid.y : height - centroid.y) : height / 2,
      };
    });




    //zoomable
    const g = svg.append("g").attr("class", "nodes-group");

    // --- After nodes array is created ---
    const simulation = d3.forceSimulation(nodes)
      .force("x", d3.forceX(d => d.fxTarget).strength(0.05)) // pull toward centroid x
      .force("y", d3.forceY(d => d.fyTarget).strength(0.05)) // pull toward centroid y
      .force("collide", d3.forceCollide(d => d.r * 0.5)) // small padding to avoid collision
      .stop();

    // Run the simulation for a few ticks
    for (let i = 0; i < 50; i++) simulation.tick();

    // Update the squares positions after simulation
    g.selectAll("rect")
      .data(nodes)
      .join("rect")
      .attr("x", d => d.x - d.r / 2)
      .attr("y", d => d.y - d.r / 2)
      .attr("rx", 2)   // horizontal corner radius
      .attr("ry", 2)  // vertical corner radius
      .attr("width", d => d.r)
      .attr("height", d => d.r)
      .attr("fill", d => colorScale(d.total_mig))
      .attr("fill-opacity", 0.5)
      .attr("stroke", "#fde0dd")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.95);
        const religionMap = {
          "Christians": "Kršćanstvo",
          "Muslims": "Islam",
          "Unaffiliated": "Neopredjeljeni",
          "Buddhists": "Budizam",
          "Hindus": "Hinduizam",
          "Jews": "Judaizam",
          "Other_religions": "Ostali"
        };

        let religionHtml = `${religionMap[d.major1] ?? d.major1} ${d.major1_perc != null ? Math.round(d.major1_perc * 100) + "%" : ""}`;
        if (d.major2 && d.major2.trim() !== "") {
          religionHtml += ` ${religionMap[d.major2] ?? d.major2} ${d.major2_perc != null ? Math.round(d.major2_perc * 100) + "%" : ""}`;
        }


        const migLabel =
          mode === "destination" ? "Broj imigranata" : "Broj emigranata";

        function formatMoney(value) {
          if (!Number.isFinite(value)) return ""; // skip invalid numbers
          if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} mlrd.`;
          if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} mil.`;
          return value.toString();
        }

        tooltip.html(`
  <strong>${d.country_hr}</strong><br/>
  Ukupno stanovnika: ${formatMoney(d.total_pop)} (2024)<br/>
  ${migLabel}: ${formatMoney(d.total_mig)}<br/>
  ${d.gni !== null ? `GNI per capita: ${new Intl.NumberFormat('fr-FR').format(Math.round(d.gni))} USD<br/>` : ""}
  ${d.remit !== null ? `Doznake: ${formatMoney(d.remit)} USD<br/>` : ""}
  ${d.life !== null ? `Očekivana dob: ${Math.round(d.life)} godina<br/>` : ""}
  ${d.major1_perc !== null ? `Glavna religija: ${religionHtml}` : ""}
`)

          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY + 10) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });

    // --- D3 Zoom ---
    const zoom = d3.zoom()
      .scaleExtent([0.5, 10]) // min/max zoom
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

  }, [data, worldData, mode]);

  return (
    <div>
      <div style={{ display: "flex", gap: "20px", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginTop: "20px", marginBottom: "10px" }}>

        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "10px" }}>
          {["origin", "destination"].map(m => (
            <label
              key={m}
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
              <input
                type="radio"
                value={m}
                checked={mode === m}
                onChange={() => setMode(m)}
                style={{ display: "none" }} // hide the actual radio
              />
              {m === "origin" ? "Podrijetlo" : "Destinacija"}
            </label>
          ))}
        </div>



        <div style={{ fontSize: "1.5rem", color: "#333" }}>
          <span style={{ animation: "fadeMoveIn 1s forwards" }}>
            {new Intl.NumberFormat('fr-FR').format(totalMig)}
          </span> <b>{mode === "destination" ? " imigranata" : " emigranata"}</b>
        </div>

      </div>

      <svg ref={svgRef}></svg>
      <style>{`
        .dorling-tooltip {
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
