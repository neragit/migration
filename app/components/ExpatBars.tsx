//app/components/ExpatBars.tsx 

"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObs";

interface ExpatApiData {
    expat: string;
    api_reach_min: number;
    api_reach_avg: number;
    api_reach_max: number;
}

const expatData: ExpatApiData[] = [
    { expat: "Nepal", api_reach_min: 23000, api_reach_avg: 25050, api_reach_max: 27100 },
    { expat: "Srbija", api_reach_min: 20600, api_reach_avg: 22400, api_reach_max: 24200 },
    { expat: "Njemačka", api_reach_min: 14200, api_reach_avg: 15450, api_reach_max: 16700 },
    { expat: "Filipini", api_reach_min: 13600, api_reach_avg: 14800, api_reach_max: 16000 },
    { expat: "SAD", api_reach_min: 11000, api_reach_avg: 12000, api_reach_max: 13000 },
    { expat: "Indija", api_reach_min: 9400, api_reach_avg: 10250, api_reach_max: 11100 },
    { expat: "Slovenija", api_reach_min: 6600, api_reach_avg: 7200, api_reach_max: 7800 },
    { expat: "Italija", api_reach_min: 3500, api_reach_avg: 3800, api_reach_max: 4100 },
    { expat: "Bangladeš", api_reach_min: 3100, api_reach_avg: 3400, api_reach_max: 3700 },
    { expat: "UK", api_reach_min: 2400, api_reach_avg: 2600, api_reach_max: 2800 },
    { expat: "Austrija", api_reach_min: 2100, api_reach_avg: 2300, api_reach_max: 2500 },
    { expat: "Australija", api_reach_min: 1700, api_reach_avg: 1850, api_reach_max: 2000 },
    { expat: "Španjolska", api_reach_min: 1600, api_reach_avg: 1750, api_reach_max: 1900 },
    { expat: "Rusija", api_reach_min: 1500, api_reach_avg: 1650, api_reach_max: 1800 },
    { expat: "Švicarska", api_reach_min: 1400, api_reach_avg: 1500, api_reach_max: 1600 },
    { expat: "Brazil", api_reach_min: 1300, api_reach_avg: 1450, api_reach_max: 1600 },
    { expat: "Kanada", api_reach_min: 1300, api_reach_avg: 1400, api_reach_max: 1500 },
    { expat: "Indonezija", api_reach_min: 1100, api_reach_avg: 1200, api_reach_max: 1300 },
    { expat: "Češka", api_reach_min: 1100, api_reach_avg: 1150, api_reach_max: 1200 },
    { expat: "Poljska", api_reach_min: 1000, api_reach_avg: 1100, api_reach_max: 1200 },
    { expat: "Francuska", api_reach_min: 1000, api_reach_avg: 1050, api_reach_max: 1100 }
];

interface Props {
    data?: ExpatApiData[];
    width?: number;
    height?: number;
}

export default function ExpatBars({
    data = expatData,
    width = 1200,
    height = 600
}: Props) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const size = useResizeObserver(containerRef);
    const hasAnimated = useRef(false);


    const [tooltip, setTooltip] = useState<{
        x: number;
        y: number;
        value: number | string;
        desc?: string;
        note?: React.ReactNode;
        label: string;
        opacity: number;
        year?: number;
    } | null>(null);



    function drawChart(svgNode: SVGSVGElement) {
        if (!size || !svgNode || expatData.length === 0) return;

        const svg = d3.select(svgNode);
        svg.selectAll("*").remove();

        const margin = { top: 40, right: 20, bottom: 50, left: 70 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);



        const mergedData = [...expatData].sort(
            (a, b) => b.api_reach_avg - a.api_reach_avg
        );





        const x0 = d3.scaleBand()
            .domain(mergedData.map(d => d.expat))
            .range([0, chartWidth])
            .padding(0.3);


        const y = d3.scaleLinear()
            .domain([
                0,
                d3.max(mergedData, d => d.api_reach_max)! * 1.1
            ])
            .range([chartHeight, 0])
            .nice();

        const color = d3.scaleOrdinal<string, string>()
            .domain(["expat"])
            .range([
                "#1976D2",   // Meta (dark blue)

            ]);

        const hoverLine = g.append("line")
            .attr("class", "hover-line")
            .attr("x1", 0)
            .attr("x2", chartWidth)       // full width
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("stroke", "#666")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4")
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
        const langGroups = g.selectAll<SVGGElement, typeof mergedData[0]>('g.lang')
            .data(mergedData)
            .join('g')
            .attr('class', 'lang')
            .attr('transform', d => `translate(${x0(d.expat)},0)`);



        const apiExpatRect = langGroups.append("rect")
            .attr("x", 0)
            .attr("y", chartHeight)
            .attr("width", x0.bandwidth())
            .attr("height", 0)
            .attr("fill", "#1976D2")
            .attr("opacity", 0.8);

        apiExpatRect.transition()
            .duration(1200)
            .attr("y", d => y(d.api_reach_avg!))
            .attr("height", d => chartHeight - y(d.api_reach_avg!));


        function drawWhisker(
            group: d3.Selection<SVGGElement, any, any, any>,
            type: "expat",
            minValueAccessor: (d: any) => number,
            maxValueAccessor: (d: any) => number,
            delay = 1200 // delay in ms before whisker animation starts
        ) {
            const whiskerWidth = x0.bandwidth() * 0.3;
            const filtered = group.filter(d => minValueAccessor(d) > 0 && maxValueAccessor(d) > 0);

            // Vertical line (from min to max)
            filtered.append("line")
                .attr("class", "whisker")
                .attr("x1", x0.bandwidth() / 2)
                .attr("x2", x0.bandwidth() / 2)
                .attr("y1", d => y(minValueAccessor(d)))
                .attr("y2", d => y(maxValueAccessor(d)))
                .attr("stroke", color(type)!)
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "4 2")
                .attr("opacity", 0) // start invisible
                .transition()
                .delay(delay)
                .duration(800)
                .attr("opacity", 1);

            // Top cap
            filtered.append("line")
                .attr("class", "whisker")
                .attr("x1", x0.bandwidth() / 2 - whiskerWidth / 2)
                .attr("x2", x0.bandwidth() / 2 + whiskerWidth / 2)
                .attr("y1", d => y(maxValueAccessor(d)))
                .attr("y2", d => y(maxValueAccessor(d)))
                .attr("stroke", color(type)!)
                .attr("stroke-width", 2)
                .attr("opacity", 0) // start invisible
                .transition()
                .delay(delay)
                .duration(800)
                .attr("opacity", 1);

            // Bottom cap
            filtered.append("line")
                .attr("x1", x0.bandwidth() / 2 - whiskerWidth / 2)
                .attr("x2", x0.bandwidth() / 2 + whiskerWidth / 2)
                .attr("y1", d => y(minValueAccessor(d)))
                .attr("y2", d => y(minValueAccessor(d)))
                .attr("stroke", color(type)!)
                .attr("stroke-width", 2)
                .attr("opacity", 0) // start invisible
                .transition()
                .delay(delay)
                .duration(800)
                .attr("opacity", 1);
        }

        drawWhisker(langGroups, "expat", d => d.api_reach_min, d => d.api_reach_max);





        function showTooltip(
            event: MouseEvent,
            d: any,
            type: "expat"
        ) {
            const padding = 6;

            let left = event.clientX + padding;
            let top = event.clientY - 40;

            let note: React.ReactNode = null;


            if (type === "expat") {
                setTooltip({
                    x: left,
                    y: top,
                    opacity: 0.95,
                    label: `${d.expat === "BiH" ? "Bosna i Hercegovina" : d.expat}`,
                    value: `${d.api_reach_min.toLocaleString("fr-FR")} - ${d.api_reach_max.toLocaleString("fr-FR")}`,
                    desc: ``,
                });

                hoverLine
                    .attr("y1", y(d.api_reach_avg))
                    .attr("y2", y(d.api_reach_avg))
                    .attr("opacity", 0.2);

            }
        }

        function hideTooltip() {
            setTooltip(null);
            hoverLine.attr("opacity", 0);
        }


        apiExpatRect
            .on("mouseenter", (e, d) => showTooltip(e, d, "expat"))
            .on("mousemove", (e, d) => showTooltip(e, d, "expat"))
            .on("mouseleave", hideTooltip);


    }

    useEffect(() => {
        if (!size || !svgRef.current) return;
        drawChart(svgRef.current);
    }, [size]);

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
                        position: "fixed",
                        left: tooltip.x,
                        top: tooltip.y,
                        opacity: tooltip.opacity,
                        transition: "opacity 0.2s ease",
                        whiteSpace: "pre-line",
                    }}
                >
                    <b>{tooltip.label}</b><br />
                    {typeof tooltip.value === "number" ? tooltip.value.toLocaleString("fr-FR") : tooltip.value}
                </div>
            )}


        </div>
    );
}
