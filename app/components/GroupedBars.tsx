"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObs";

type Zahtjev = { zupanija: string; neg: number; poz: number; godina: number };
type Stranci = { year: number; stranci: number };

const stranciData: Stranci[] = [
    { year: 2021, stranci: 81995 },
    { year: 2022, stranci: 124121 },
    { year: 2023, stranci: 172499 },
    { year: 2024, stranci: 206529 },
    { year: 2025, stranci: 170723 },
];

interface GroupedBarChartProps {
    width?: number;
    height?: number;
}

export default function GroupedBarChart({ width = 700, height = 450 }: GroupedBarChartProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const size = useResizeObserver(containerRef);
    const hasAnimated = useRef(false);

    const [csvData, setCsvData] = useState<Zahtjev[]>([]);
    const [tooltip, setTooltip] = useState<{
        x: number;
        y: number;
        value: number;
        label: string;
        opacity: number;
        year?: number;
    } | null>(null);

    useEffect(() => {
        d3.csv("/data/zahtjevi.csv").then((raw) => {
            const parsed = raw.map((d: any) => ({
                zupanija: d.zupanija,
                neg: +d.neg,
                poz: +d.poz,
                godina: +d.godina,
            }));
            setCsvData(parsed);
        });
    }, []);

    function drawChart(svgNode: SVGSVGElement) {
        if (!size || !svgNode || csvData.length === 0) return;

        const svg = d3.select(svgNode);
        svg.selectAll("*").remove();

        const margin = { top: 40, right: 20, bottom: 50, left: 70 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const totalsByYear = Array.from(
            d3.rollup(csvData, v => d3.sum(v, d => d.poz), d => d.godina),
            ([year, total]) => ({ year, total })
        ).sort((a, b) => a.year - b.year);

        const dataByYear = totalsByYear.map(d => ({
            year: d.year,
            total: d.total,
            stranci: stranciData.find(s => s.year === d.year)?.stranci ?? 0
        }));

        const x0 = d3.scaleBand()
            .domain(dataByYear.map(d => d.year.toString()))
            .range([0, chartWidth])
            .padding(0.3);

        const x1 = d3.scaleBand()
            .domain(["Total", "Stranci"])
            .range([0, x0.bandwidth()])
            .padding(0.05);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dataByYear, d => Math.max(d.total, d.stranci))! * 1.1])
            .range([chartHeight, 0])
            .nice();

        const color = d3.scaleOrdinal<string, string>()
            .domain(["Total", "Stranci"])
            .range(["#4CAF50", "#fdae6b"]);

        g.append("g")
            .attr("class", "grid")
            .attr("stroke-opacity", 0.05) // set opacity on the parent <g>
            .call(d3.axisLeft(y)
                .tickSize(-chartWidth)
                .tickFormat(() => "")
            )
            .selectAll("line")
            .attr("stroke", "#888"); // only set color per line, not opacity

        const hoverLine = g.append("line")
            .attr("class", "hover-line")
            .attr("x1", 0)
            .attr("x2", chartWidth)       // full width
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("stroke", "#666")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4,4")
            .attr("opacity", 0);



        // Axes with styling
        const xAxis = d3.axisBottom(x0)
            .tickSize(0)
            .tickPadding(20);

        const yAxis = d3.axisLeft(y)
            .ticks(5)
            .tickSize(0)
            .tickPadding(20)
            .tickFormat(d => new Intl.NumberFormat("fr-FR").format(d as number));


        // X-axis
        const xAxisGroup = g.append("g")
            .attr("transform", `translate(0,${chartHeight})`)
            .call(xAxis);

        xAxisGroup.selectAll("text")
            .attr("fill", "#555")
            .attr("font-family", "Mukta, sans-serif")
            .attr("font-size", 12)
            .style("opacity", 1);

        xAxisGroup.select(".domain")
            .attr("stroke", "#eee");

        // Y-axis
        const yAxisGroup = g.append("g")
            .call(yAxis);

        yAxisGroup.selectAll("text")
            .attr("fill", "#555")
            .attr("font-family", "Mukta, sans-serif")
            .attr("font-size", 12);

        yAxisGroup.select(".domain")
            .attr("stroke", "#eee");

        // Bars
        const yearGroups = g.selectAll("g.year-group")
            .data(dataByYear)
            .join("g")
            .attr("class", "year-group")
            .attr("transform", d => `translate(${x0(d.year.toString())},0)`);


        const bars = yearGroups.selectAll("rect")
            .data(d => [
                { key: "Total", value: d.total, year: d.year },
                { key: "Stranci", value: d.stranci, year: d.year }
            ])
            .join("rect")
            .attr("x", d => x1(d.key)!)
            .attr("y", chartHeight)
            .attr("width", x1.bandwidth())
            .attr("height", 0)
            .attr("fill", d => color(d.key)!)
            .on("mouseenter", (event, d) => {
                setTooltip({
                    x: 0, // will be updated in mousemove
                    y: 0,
                    value: d.value,
                    label: d.key === "Total" ? "HZZ" : "MUP",
                    opacity: 0.9,
                    year: d.year
                });

                hoverLine
                    .attr("y1", y(d.value))
                    .attr("y2", y(d.value))
                    .attr("opacity", 0.2);

            })
            .on("mousemove", (event, d) => {
                if (!containerRef.current) return;

                const containerRect = containerRef.current.getBoundingClientRect();
                const tooltipWidth = 80;
                const tooltipHeight = 40;
                const padding = 4;

                let left = event.clientX - containerRect.left + padding;
                let top = event.clientY - containerRect.top - tooltipHeight - padding;

                // clamp to container edges
                if (left + tooltipWidth > containerRect.width) {
                    left = containerRect.width - tooltipWidth - padding;
                }
                if (top < 0) top = padding;

                setTooltip(prev => prev ? { ...prev, x: left, y: top } : null);

                hoverLine.attr("y1", y(d.value)).attr("y2", y(d.value));
            })
            .on("mouseleave", () => {
                setTooltip(null);
                hoverLine.attr("opacity", 0);
            });




        // Scroll-triggered animation
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;

                    bars.transition()
                        .duration(1200)
                        .attr("y", d => y(d.value))
                        .attr("height", d => chartHeight - y(d.value));


                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(svgNode);
    }

    useEffect(() => {
        if (!size || !svgRef.current) return;
        drawChart(svgRef.current);
    }, [size, csvData]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                maxWidth: `${width}px`,
                position: "relative",
            }}
        >
            <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="xMidYMid meet"
                style={{ width: "100%", height: "100%", display: "block" }}
            />
            {tooltip && (
                <div className="tooltip"
                    style={{
                        position: "absolute",
                        left: tooltip.x,
                        top: tooltip.y,
                        opacity: tooltip.opacity,
                        transition: "opacity 0.2s ease",
                    }}
                >
                    <b>{tooltip.label}</b><br />
                    <b>{tooltip.year}:</b> {tooltip.value.toLocaleString("fr-FR")}
                </div>
            )}


        </div>
    );
}
