"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObs";

type Data = {
    ID: string;
    POLICIJSKA: string;
    NOVO: number;
    PRODULJENJE: number;
    SEZONSKO: number;
    UKUPNO: number;
    GODINA: number;
};

interface StackedProps {
    width?: number;
    height?: number;
}

export default function StackedBars({ width = 1000, height = 600 }: StackedProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const size = useResizeObserver(containerRef);


    const [data, setData] = useState<Data[]>([]);
    const [tooltip, setTooltip] = useState<{
        x: number;
        y: number;
        value: number;
        uprava: string;
        category: string;
        year: number;
        opacity: number;
    } | null>(null);

    // Filter states
    const [selectedYears, setSelectedYears] = useState<number[]>([2023, 2024, 2025]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(["NOVO", "PRODULJENJE", "SEZONSKO"]);

    const toggleYear = (year: number) => {
        setSelectedYears(prev =>
            prev.includes(year)
                ? prev.filter(y => y !== year)
                : [...prev, year].sort()
        );
    };

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev =>
            prev.includes(cat)
                ? prev.filter(c => c !== cat)
                : [...prev, cat]
        );
    };

    useEffect(() => {
        d3.csv("/data/mup_zupanije.csv").then((raw) => {
            const parsed: Data[] = raw
                .filter(d => d.ID !== "TOT")
                .map(d => ({
                    ID: d.ID,
                    POLICIJSKA: d.POLICIJSKA,
                    NOVO: d.NOVO ? +d.NOVO : 0,
                    PRODULJENJE: d.PRODULJENJE ? +d.PRODULJENJE : 0,
                    SEZONSKO: d.SEZONSKO ? +d.SEZONSKO : 0,
                    UKUPNO: d.UKUPNO ? +d.UKUPNO : 0,
                    GODINA: d.GODINA ? +d.GODINA : 0,
                }));
            setData(parsed);
        });
    }, []);

    useEffect(() => {
        if (!size || !svgRef.current) return;

        drawChart(svgRef.current);
    }, [size, data, selectedYears, selectedCategories]);


    function drawChart(svgNode: SVGSVGElement) {
        if (!size || !svgNode || data.length === 0) return;

        const svg = d3.select(svgNode);
        svg.selectAll("*").remove();

        const margin = { top: 50, right: 0, bottom: 120, left: size?.isPortrait ? 30 : 45 };
        const chartWidth = size?.width - margin.left - margin.right;
        const chartHeight = size?.height - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        // --- IDs and years ---
        const ids = Array.from(
            new Set(
                data
                    .filter(d => d.GODINA === 2025)
                    .sort((a, b) => b.UKUPNO - a.UKUPNO)
                    .map(d => d.ID)
            )
        );

        const yearsSorted = [...selectedYears].sort();
        const categories = selectedCategories;

        // --- Scales ---
        let xScale: any, yScale: any, xAxisFunc: any, yAxisFunc: any;

        if (!size?.isPortrait) {
            // Vertical: X = ID groups, Y = value
            xScale = d3.scaleBand().domain(ids).range([0, chartWidth]).paddingInner(0.2).paddingOuter(0.5);
            yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.UKUPNO)! * 1.1]).range([chartHeight, 0]);
            xAxisFunc = d3.axisBottom(xScale);
            yAxisFunc = d3.axisLeft(yScale).tickSize(0).ticks(6).tickFormat(d => new Intl.NumberFormat('fr-FR').format(d as number));
        } else {
            // Horizontal: Y = ID groups, X = value
            xScale = d3.scaleLinear().domain([0, d3.max(data, d => d.UKUPNO)! * 1.1]).range([0, chartWidth]);
            yScale = d3.scaleBand().domain(ids).range([0, chartHeight]).paddingInner(0.2).paddingOuter(0.5);
            xAxisFunc = d3.axisTop(xScale).tickSize(0).ticks(6).tickFormat(d => new Intl.NumberFormat('fr-FR').format(d as number));
            yAxisFunc = d3.axisLeft(yScale);
        }

        // --- Axis ---
        g.append("g")
            .attr("transform", `translate(0,${!size?.isPortrait ? chartHeight : 0})`)
            .call(xAxisFunc)
            .call(g => g.selectAll("path, line").attr("stroke", "#eee"))
            .call(g => g.selectAll("text").attr("font-family", "Mukta, sans-serif").attr("font-size", 12));

        g.append("g")
            .call(yAxisFunc)
            .call(g => g.selectAll("path, line").attr("stroke", "#eee"))
            .call(g => g.selectAll("text").attr("font-family", "Mukta, sans-serif").attr("font-size", 12));

        // --- Color ---
        const color = d3.scaleOrdinal<string>()
            .domain(["NOVO", "PRODULJENJE", "SEZONSKO"])
            .range(["#4CAF50", "#fdae6b", "#87CEEB"]);

        // --- Grouping ---
        const idGroups = g.selectAll("g.id-group")
            .data(ids)
            .join("g")
            .attr("class", "id-group")
            .attr("transform", d => !size?.isPortrait ? `translate(${xScale(d)},0)` : `translate(0,${yScale(d)})`);

        // Width / height per year within group
        const yearCount = yearsSorted.length;
        const yearBand = !size?.isPortrait ? xScale.bandwidth() / yearCount : yScale.bandwidth() / yearCount;


        idGroups.selectAll("g.year")
            .data(d => yearsSorted.map(y => data.find(r => r.ID === d && r.GODINA === y)).filter(Boolean) as Data[])
            .join("g")
            .attr("class", "year")
            .attr("transform", (_d, i) => !size?.isPortrait
                ? `translate(${i * yearBand},0)` // horizontal offset inside ID group
                : `translate(0,${i * yearBand})` // vertical offset inside ID group
            )
            .each(function (d) {
                const gYear = d3.select(this);
                let stackOffset = 0;

                categories.forEach(cat => {
                    const value = d[cat as keyof Data] as number;

                    gYear.append("rect")
                        .attr("fill", color(cat)!)
                        .attr("data-year", d.GODINA)
                        .attr("data-category", cat)
                        .attr("x", () => !size?.isPortrait ? 0 : xScale(stackOffset))
                        .attr("y", () => !size?.isPortrait ? yScale(stackOffset + value) : 0)
                        .attr("width", () => !size?.isPortrait ? yearBand - 1 : xScale(value))
                        .attr("height", () => !size?.isPortrait ? yScale(stackOffset) - yScale(stackOffset + value) : yearBand - 1)
                        .on("mouseenter", function () {
                            g.selectAll("rect")
                                .attr("opacity", function () {
                                    const rect = d3.select(this);
                                    const rectYear = +rect.attr("data-year");
                                    const rectCategory = rect.attr("data-category");
                                    return (rectYear === d.GODINA && rectCategory === cat) ? 1 : 0.2;
                                });

                            setTooltip({
                                x: 0,
                                y: 0,
                                value,
                                uprava: d.POLICIJSKA,
                                category: cat,
                                year: d.GODINA,
                                opacity: 0.9
                            });
                        })
                        .on("mousemove", event => {
                            if (!containerRef.current) return;
                            const rect = containerRef.current.getBoundingClientRect();
                            setTooltip(prev => prev ? {
                                ...prev,
                                x: event.clientX - rect.left + 8,
                                y: event.clientY - rect.top - 30
                            } : null);
                        })
                        .on("mouseleave", () => {
                            g.selectAll("rect").attr("opacity", 1);
                            setTooltip(null);
                        });

                    stackOffset += value;
                });
            });
    }



    return (
        < >
            <div className="flex flex-wrap w-full items-center gap-3 justify-center sm:justify-between ">

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                    {["NOVO", "PRODULJENJE", "SEZONSKO"].map(cat => {
                        const catColors: { [key: string]: string } = {
                            NOVO: "#4CAF50",
                            PRODULJENJE: "#fdae6b",
                            SEZONSKO: "#87CEEB"
                        };
                        return (
                            <button
                                key={cat}
                                aria-pressed={selectedCategories.includes(cat)}
                                lang="hr" // Croatian TTS
                                onClick={() => toggleCategory(cat)}
                                className="button"
                                style={{
                                    backgroundColor: selectedCategories.includes(cat) ? catColors[cat] : "#eee",
                                    color: selectedCategories.includes(cat) ? "#fff" : "#333",
                                }}

                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                    {[2023, 2024, 2025].map(year => (
                        <button
                            key={year}
                            aria-pressed={selectedYears.includes(year)} // for the screen reader
                            lang="hr" // Croatian TTS
                            onClick={() => toggleYear(year)}
                            className="button"
                            style={{
                                backgroundColor: selectedYears.includes(year) ? "#999" : "#eee",
                                color: selectedYears.includes(year) ? "#fff" : "#333",
                            }}

                        >
                            {year}
                        </button>
                    ))}
                </div>

            </div>

            <div ref={containerRef} style={{ width: "100%", maxWidth: "900px", height: `${height}px`, position: "relative" }}>
                <svg ref={svgRef} width="100%" height="100%" />

                {tooltip && (
                    <div className="tooltip"
                        style={{
                            position: "absolute",
                            left: tooltip.x,
                            top: tooltip.y,
                            opacity: tooltip.opacity,
                        }}>
                        <b>{tooltip.uprava}</b><br />
                        <b>{tooltip.year}:</b> {new Intl.NumberFormat('fr-FR').format(tooltip.value)}
                    </div>
                )}
            </div>
        </>
    );
}