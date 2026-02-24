"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import * as d3 from "d3";
import allCountries from "world-countries";
import useResizeObserver from "../hooks/useResizeObs";
import { ColorScale } from 'plotly.js';
import { ChevronUp } from "lucide-react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type Props = {
  sidebarVisible: boolean;
};

export default function ChoroplethHr({ sidebarVisible }: Props) {

    const [open, setOpen] = useState(false);
    const [tooltip, setTooltip] = useState<{
        x: number;
        y: number;
        country: string;
        value: number;
    } | null>(null);

    const [csvData, setCsvData] = useState<any[]>([]);
    const [selectedMode, setselectedMode] = useState("Iseljenici");
    const [isClient, setIsClient] = useState(false);
    const modes = ["Iseljenici", "Useljenici"];
    const containerRef = useRef<HTMLDivElement>(null);
    const lockScrollRef = useRef(false);
    const accumulatedDeltaRef = useRef(0);
    const size = useResizeObserver(containerRef);

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


    const isDesktop = size ? size.width > 768 : true; // fallback to desktop if size unknown

    useEffect(() => {
        setIsClient(true);
        d3.csv("/data/hrvati_choropleth.csv").then(setCsvData);
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


    useEffect(() => {
        if (!containerRef.current) return;

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

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [containerRef]);


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
            // Otherwise: do NOT prevent default = lets the user scroll past the map
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

                <div className="flex flex-wrap gap-1.5">
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
                            <span className="button"
                                style={{
                                    display: "inline-block",

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

            <div ref={containerRef} className={`relative top-0 z-10 justify-center 
       ${sidebarVisible ? " ml-[-80]  " : "ml-0  "} w-[95vw] lg:ml-[-60]  portrait:w-screen portrait:ml-0 `}
       onMouseMove={handleMouseMove}>

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

                            }}
                            config={{
                                responsive: true,
                                displaylogo: false,
                                scrollZoom: false,
                                displayModeBar: false,
                            }}
                            onHover={handleHover}
                            onUnhover={handleUnhover}
                        />

                        <div >
                            <button
                                onClick={() => setOpen(!open)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "6px 0",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    marginBottom: "8px",
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
                                    maxHeight: open ? 600 : 0,
                                    opacity: open ? 1 : 0,
                                    transition: "max-height 0.4s ease, opacity 0.4s ease",
                                }}
                            >
                                <table
                                    style={{
                                        width: "100%",
                                        maxWidth: "420px",
                                        borderCollapse: "collapse",
                                        fontSize: "12px",
                                        color: "#333",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: "left", paddingBottom: "6px" }}>
                                                {tableHeaders[0]}
                                            </th>
                                            <th style={{ textAlign: "right", paddingBottom: "6px" }}>
                                                {tableHeaders[1]}
                                            </th>
                                            <th style={{ textAlign: "right", paddingBottom: "6px" }}>
                                                {tableHeaders[2]}
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {tableData.map((row) => (
                                            <tr key={row.label}>
                                                <td
                                                    style={{
                                                        padding: "4px 0",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {row.label}
                                                </td>

                                                <td
                                                    style={{
                                                        padding: "4px 0",
                                                        textAlign: "right",
                                                        fontWeight: row.bold ? 600 : 400,
                                                    }}
                                                >
                                                    {new Intl.NumberFormat("fr-FR").format(row.a)}
                                                </td>

                                                <td
                                                    style={{
                                                        padding: "4px 0",
                                                        textAlign: "right",
                                                        fontWeight: row.bold ? 600 : 400,
                                                    }}
                                                >
                                                    {new Intl.NumberFormat("fr-FR").format(row.b)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </>
                )}
            </div>

            {tooltip && (
                <div
                    className="tooltip"
                    style={{
                        position: "fixed",
                        left: Math.min(tooltip.x, window.innerWidth - 150),
                        top: Math.min(tooltip.y, window.innerHeight - 150),
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