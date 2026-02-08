"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import * as d3 from "d3";
import allCountries from "world-countries";
import useResizeObserver from "../hooks/useResizeObs";
import { ColorScale } from 'plotly.js';
import { ChevronUp } from "lucide-react";



const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function ChoroplethHr() {

    const [open, setOpen] = useState(false);


    const [csvData, setCsvData] = useState<any[]>([]);
    const [selectedMode, setselectedMode] = useState("Iseljenici");
    const [isClient, setIsClient] = useState(false);
    const modes = ["Iseljenici", "Useljenici"];
    const mapRef = useRef<HTMLDivElement>(null);
    const lockScrollRef = useRef(false);
    const accumulatedDeltaRef = useRef(0);
    const mapSize = useResizeObserver(mapRef);

    const tableHeaders = ["Regija", "Iseljenici", "Useljenici"];
    const tableData = [
        { label: "Europska Unija", a: 14017, b: 9184 },
        { label: "Ostale europske države", a: 4561, b: 3135 },
        { label: "Sjeverna i Srednja Amerika", a: 430, b: 540 },
        { label: "Oceanija", a: 150, b: 206 },
        { label: "Azija", a: 160, b: 130 },
        { label: "Južna Amerika", a: 17, b: 62 },
        { label: "Afrika", a: 10, b: 31 },
        { label: "Nepoznato", a: 802, b: 2 },
        { label: "Ukupno", a: 20147, b: 13290, bold: true },
    ];




    // Decide whether to apply the desktop hack
    const isDesktop = mapSize ? mapSize.width > 768 : true; // fallback to desktop if size unknown

    useEffect(() => {
        setIsClient(true);
        d3.csv("/data/choropleth_dzs.csv").then(setCsvData);
    }, []);

    useEffect(() => {
        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("opacity", 0)

        const cleanup = (): void => {
            tooltip.remove();
        };

        return cleanup;
    }, []);



    // Tooltip follow
    useEffect(() => {
        const tooltip = d3.select(".tooltip");
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
            { value: parseFloat(d[selectedMode]), country_name: d.DZS },
        ])
    );

    const zValues = allCountryISO3.map((code) => dataMap.get(code)?.value ?? null);
    const numericZ = zValues.filter((v) => v != null) as number[];
    const zmin = Math.min(...numericZ);
    const zmax = Math.max(...numericZ);
    const markerColors = zValues.map((v) => (v == null ? "#eeeeee" : undefined));

    const currentTotal = React.useMemo(() => {
        const stats: Record<string, number> = {};

        modes.forEach((mode) => {
            const modeData = csvData
                .map((d) => parseFloat(d[mode]))
                .filter((v) => !isNaN(v));

            // normal sum
            let total = d3.sum(modeData);

            // override for special total row
            if (mode === "Useljenici") total = 13290;
            if (mode === "Iseljenici") total = 20147;

            stats[mode] = total;
        });

        return stats[selectedMode] ?? 0;
    }, [csvData, selectedMode]);


    // Hover handlers
    const handleHover = (event: any) => {
        const tooltip = d3.select(".tooltip");
        if (!event.points || event.points.length === 0) return;
        const pt = event.points[0];
        const code = pt.location;
        const dataEntry = dataMap.get(code);
        if (!dataEntry) return;
        tooltip
            .html(`<b>${dataEntry.country_name}</b><br>${new Intl.NumberFormat('fr-FR').format(dataEntry.value)}`)
            .style("opacity", 0.90);
    };

    const handleUnhover = () => {
        d3.select(".tooltip").style("opacity", 0);
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
        let lastScrollTime = 0; // timestamp of last mode change
        const cooldown = 200;   // milliseconds between allowed scrolls

        const handleWheel = (e: WheelEvent) => {
            if (!lockScrollRef.current) return; // only act when map fully visible

            const now = Date.now();
            if (now - lastScrollTime < cooldown) return; // ignore if within cooldown

            const currentIndex = modes.indexOf(selectedMode);

            if (e.deltaY > 0 && currentIndex < modes.length - 1) {
                e.preventDefault(); // only prevent default if we are actually changing the mode
                setselectedMode(modes[currentIndex + 1]);
                lastScrollTime = now;
            } else if (e.deltaY < 0 && currentIndex > 0) {
                e.preventDefault(); // only prevent default if we are actually changing the mode
                setselectedMode(modes[currentIndex - 1]);
                lastScrollTime = now;
            }
            // Otherwise: do NOT prevent default → lets the user scroll past the map
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => window.removeEventListener("wheel", handleWheel);
    }, [selectedMode]);



    const colors: ColorScale = selectedMode === "Useljenici"
        ? "Greens"
        : [
            [0, '#4b0082'],
            [0.5, '#b266ff'],
            [1, '#fcfaff']
        ];


    return (
        <div>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "20px",
                marginBottom: "10px",
            }}>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {modes.map((mode) => (
                        <label key={mode} style={{ display: "inline-block" }}>
                            <input
                                type="radio"
                                name="mode"
                                value={mode}
                                checked={selectedMode === mode}
                                onChange={() => setselectedMode(mode)}
                                style={{ display: "none" }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    padding: "5px 10px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    backgroundColor:
                                        selectedMode === mode
                                            ? mode === "Iseljenici"
                                                ? "#6a0dad"
                                                : "#4CAF50"
                                            : "#eee",
                                    color: selectedMode === mode ? "#fff" : "#000",
                                    userSelect: "none",
                                }}
                            >
                                {mode}
                            </span>
                        </label>
                    ))}
                </div>

                <div style={{ fontSize: "1.5rem", color: "#333" }}>
                    {new Intl.NumberFormat('fr-FR').format(currentTotal)} <b> hrvatskih državljana</b>
                </div>

            </div>

            <div
                ref={mapRef}
                style={{
                    width: "93vw",
                    height: "93vh",
                    position: "relative",
                    left: isDesktop ? -310 : 0, // only offset on desktop
                    top: 0,
                    zIndex: 1,
                }}
            >
                {isClient && (
                    <>
                        <Plot
                            data={[
                                {
                                    type: "choropleth",
                                    locations,
                                    z: zValues,

                                    colorscale: colors,

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
                                    showcoastlines: false,
                                    showframe: false,

                                },
                                margin: { t: 0, b: 0, l: 0, r: 0 },
                                width: mapSize?.width,
                                height: mapSize?.height,
                                autosize: true,
                                dragmode: isDesktop ? "pan" : false,

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

                        <div className="hidden sm:block">
                            <button
                                onClick={() => setOpen(!open)}
                                style={{
                                    position: "absolute",
                                    left: "300px",
                                    top: mapSize!.height - 180,
                                    zIndex: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "6px 12px",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    transition: "color 0.2s ease, background 0.2s ease",
                                    marginBottom: "6px",
                                }}
                            >
                                {open ? "Sakrij" : "Podaci po regijama 2024."}
                                <ChevronUp
                                    size={16}
                                    style={{
                                        transition: "transform 0.3s ease",
                                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                                    }}
                                />
                            </button>


                            <div
                                style={{
                                    overflow: "hidden",
                                    maxHeight: open ? 500 : 0,
                                    transition: "max-height 0.4s ease, opacity 0.4s ease",
                                    opacity: open ? 1 : 0,
                                }}
                            >
                                <svg
                                    width="100%"
                                    height="100%"
                                    style={{
                                        position: "absolute",
                                        bottom: "15%",
                                        left: "20%",
                                        pointerEvents: "none",
                                    }}
                                >
                                    <g
                                        transform={`translate(26, ${mapSize?.height! - 130 - tableData.length * 18})`}
                                        fill="#333"
                                        fontSize={"12px"}
                                    >
                                        {mapSize?.width && mapSize.width > 800 && (
                                            <g transform={`translate(0, 0)`}>
                                                <text x={0} y={-25} dominantBaseline="hanging" fontWeight={600}>
                                                    {tableHeaders[0]}
                                                </text>
                                                <text x={220} y={-25} textAnchor="end" dominantBaseline="hanging" fontWeight={600}>
                                                    {tableHeaders[1]}
                                                </text>
                                                <text x={300} y={-25} textAnchor="end" dominantBaseline="hanging" fontWeight={600}>
                                                    {tableHeaders[2]}
                                                </text>

                                            </g>
                                        )}

                                        {tableData.map((row, i) => (
                                            <g key={row.label} transform={`translate(0, ${i * 24})`}>
                                                {!row.bold && (
                                                    <line
                                                        x1={0}
                                                        x2={300}
                                                        y1={17}
                                                        y2={17}
                                                        stroke="#eee"
                                                    />

                                                )}

                                                <text
                                                    x={0}
                                                    y={0}
                                                    dominantBaseline="hanging"
                                                    fontWeight={600}
                                                >
                                                    {row.label}
                                                </text>

                                                <text
                                                    x={220}
                                                    y={0}
                                                    textAnchor="end"
                                                    dominantBaseline="hanging"
                                                    fontWeight={row.bold ? 600 : 400}
                                                >
                                                    {new Intl.NumberFormat("fr-FR").format(row.a)}
                                                </text>

                                                <text
                                                    x={300}
                                                    y={0}
                                                    textAnchor="end"
                                                    dominantBaseline="hanging"
                                                    fontWeight={row.bold ? 600 : 400}
                                                >
                                                    {new Intl.NumberFormat("fr-FR").format(row.b)}
                                                </text>


                                            </g>
                                        ))}
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
