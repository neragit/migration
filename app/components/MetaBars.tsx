"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObs";

//2025 mup data
type Stranci = { Državljanstvo: string; lang: string; dozvola: number };

//2026 meta ads manager screenshots data
interface MetaManagerData {
    lang: string;
    avg: number;
    region: string;
    subgroup: string;
    min: number;
    max: number;
    country: string;
    r?: number;
    x?: number;
    y?: number;
    color?: string;
}

// Procjena publike prema jeziku na temelju pojedinačne pretrage putem Meta Ads Manager UI

const data: MetaManagerData[] = [
    { lang: 'Bosanski', avg: 67250, region: 'Europa', subgroup: 'Balkan', min: 61800, max: 72700, country: 'Bosna i Hercegovina' },
    { lang: 'Makedonski', avg: 53750, region: 'Europa', subgroup: 'Balkan', min: 49400, max: 58100, country: 'Sjeverna Makedonija' },
    { lang: 'Srpski', avg: 41350, region: 'Europa', subgroup: 'Balkan', min: 38000, max: 44700, country: 'Srbija, Kosovo, Bosna i Hercegovina' },
    { lang: 'Albanski', avg: 11850, region: 'Europa', subgroup: 'Balkan', min: 10900, max: 12800, country: 'Albanija, Kosovo, Sjeverna Makedonija' },
    { lang: 'Hrvatski', avg: 2600000, region: 'Europa', subgroup: 'Balkan', min: 2400000, max: 2800000, country: 'Hrvatska (i ostali)' },
    { lang: 'Slovenski', avg: 35800, region: 'Europa', subgroup: 'Balkan', min: 32900, max: 38700, country: 'Slovenija' },

    { lang: 'Slovački', avg: 4250, region: 'Europa', subgroup: 'Europa', min: 3900, max: 4600, country: 'Slovačka' },
    { lang: 'Češki', avg: 82300, region: 'Europa', subgroup: 'Europa', min: 75600, max: 89000, country: 'Češka' },
    { lang: 'Mađarski', avg: 3600, region: 'Europa', subgroup: 'Europa', min: 3300, max: 3900, country: 'Mađarska' },
    { lang: 'Rumunjski', avg: 2150, region: 'Europa', subgroup: 'Europa', min: 2000, max: 2300, country: 'Rumunjska' },
    { lang: 'Latvijski', avg: 6650, region: 'Europa', subgroup: 'Europa', min: 6100, max: 7200, country: 'Latvija' },
    { lang: 'Litvanski', avg: 9700, region: 'Europa', subgroup: 'Europa', min: 8900, max: 10500, country: 'Litva' },
    { lang: 'Nizozemski', avg: 3600, region: 'Europa', subgroup: 'Europa', min: 3500, max: 4200, country: 'Nizozemska' },
    { lang: 'Švedski', avg: 4550, region: 'Europa', subgroup: 'Europa', min: 4200, max: 4900, country: 'Švedska' },
    { lang: 'Poljski', avg: 6550, region: 'Europa', subgroup: 'Europa', min: 6000, max: 7100, country: 'Poljska' },
    { lang: 'Portugalski', avg: 5900, region: 'Europa', subgroup: 'Europa', min: 5400, max: 6400, country: 'Portugal, Latiska Amerika' },
    { lang: 'Danski', avg: 4850, region: 'Europa', subgroup: 'Europa', min: 4500, max: 5200, country: 'Danska' },

    { lang: 'Engleski', avg: 2600000, region: 'Global', subgroup: 'English', min: 2400000, max: 2800000, country: 'Svjetski (službeni u Filipinima, Indiji, Pakistanu...)' },
    { lang: 'Njemački', avg: 45250, region: 'Global', subgroup: 'Global', min: 41600, max: 48900, country: 'Njemačka, Austrija, Švicarska...' },
    { lang: 'Talijanski', avg: 33850, region: 'Global', subgroup: 'Global', min: 31100, max: 36600, country: 'Italija' },
    { lang: 'Španjolski', avg: 13950, region: 'Global', subgroup: 'Global', min: 12800, max: 15100, country: 'Španjolska, Latinska Amerika' },
    { lang: 'Francuski', avg: 6750, region: 'Global', subgroup: 'Global', min: 6200, max: 7300, country: 'Francuska, Belgija, Kanada' },
    { lang: 'Kineski', avg: 1700, region: 'Global', subgroup: 'Global', min: 1600, max: 1800, country: 'Kina' },
    { lang: 'Japanski', avg: 1700, region: 'Global', subgroup: 'Global', min: 1200, max: 1400, country: 'Japan' },

    { lang: 'Ruski', avg: 15300, region: 'Middle', subgroup: 'Euroazija', min: 14100, max: 16500, country: 'Ukrajina, Uzbekistan, Rusija' },
    { lang: 'Ukrajinski', avg: 8350, region: 'Middle', subgroup: 'Euroazija', min: 7700, max: 9000, country: 'Ukrajina' },
    { lang: 'Turski', avg: 4000, region: 'Middle', subgroup: 'Africa', min: 3700, max: 4300, country: 'Turska' },
    { lang: 'Arapski', avg: 6650, region: 'Middle', subgroup: 'Africa', min: 6100, max: 7200, country: 'Egipat, Bliski istok, Sjeverna Afrika' },
    { lang: 'Uzbečki', avg: 1750, region: 'Middle', subgroup: 'Euroazija', min: 1600, max: 1900, country: 'Uzbekistan' },

    { lang: 'Punjabi', avg: 1950, region: 'Asia', subgroup: 'Indija', min: 1800, max: 2100, country: 'Pakistan' },

    { lang: 'Hindski', avg: 5450, region: 'Asia', subgroup: 'Indija', min: 5000, max: 5900, country: 'Indija' },
    { lang: 'Bengalski', avg: 3400, region: 'Asia', subgroup: 'Indija', min: 3100, max: 3700, country: 'Bangladeš, Indija' },
    { lang: 'Nepalski', avg: 19700, region: 'Asia', subgroup: 'Indija', min: 18100, max: 21300, country: 'Nepal' },
    { lang: 'Filipinski', avg: 14000, region: 'Asia', subgroup: 'Filipini', min: 12900, max: 15100, country: 'Filipini' },
    { lang: 'Cebuano', avg: 1200, region: 'Asia', subgroup: 'Filipini', min: 1100, max: 1300, country: 'Filipini' },
];


const MupData: Stranci[] = [
    { Državljanstvo: "BiH", dozvola: 32225, lang: "Bosanski" },
    { Državljanstvo: "Nepal", dozvola: 31708, lang: "Nepalski" },
    { Državljanstvo: "Srbija", dozvola: 24278, lang: "Srpski" },
    { Državljanstvo: "Filipini", dozvola: 17629, lang: "Filipinski" },
    { Državljanstvo: "Indija", dozvola: 15400, lang: "Hindski" },
    { Državljanstvo: "Sj. Makedonija", dozvola: 11856, lang: "Makedonski" },
    { Državljanstvo: "Kosovo", dozvola: 6355, lang: "Albanski" },
    { Državljanstvo: "Uzbekistan", dozvola: 5521, lang: "Uzbečki" },
    { Državljanstvo: "Egipat", dozvola: 5504, lang: "Arapski" },
    { Državljanstvo: "Bangladeš", dozvola: 3404, lang: "Bengalski" },
];

interface MetaBarChartProps {
    width?: number;
    height?: number;
}

export default function MetaBarChart({ width = 900, height = 500 }: MetaBarChartProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const size = useResizeObserver(containerRef);
    const hasAnimated = useRef(false);


    const [tooltip, setTooltip] = useState<{
        x: number;
        y: number;
        value: number;
        label: string;
        opacity: number;
        year?: number;
    } | null>(null);



    function drawChart(svgNode: SVGSVGElement) {
        if (!size || !svgNode || MupData.length === 0) return;

        const svg = d3.select(svgNode);
        svg.selectAll("*").remove();

        const margin = { top: 40, right: 20, bottom: 50, left: 70 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const mergedData = MupData.map(d => {
            const meta = data.find(m => m.lang === d.lang); // direct match
            return {
                lang: d.lang,
                mup: d.dozvola,
                Državljanstvo: d.Državljanstvo,
                meta: meta ? meta.avg : 0,
                min: meta ? meta.min : 0,
                max: meta ? meta.max : 0,
            };
        }).sort((a, b) => b.meta - a.meta);





        const x0 = d3.scaleBand()
            .domain(mergedData.map(d => d.Državljanstvo))
            .range([0, chartWidth])
            .padding(0.3);

        const x1 = d3.scaleBand()
            .domain(["Meta", "MUP"])
            .range([0, x0.bandwidth()])
            .padding(0.05);

        const y = d3.scaleLinear()
            .domain([0, d3.max(mergedData, d => Math.max(d.meta, d.mup))! * 1.1])
            .range([chartHeight, 0])
            .nice();

        const color = d3.scaleOrdinal<string, string>()
            .domain(["Meta", "MUP"])
            .range(["#1976D2", "#fdae6b"]);



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
        const langGroups = g.selectAll("g.lang")
            .data(mergedData)
            .join("g")
            .attr("class", "lang")
            .attr("transform", d => `translate(${x0(d.Državljanstvo)},0)`); 



        const bars = langGroups.selectAll("rect")
            .data(d => [
                { key: "Meta Ads Manager", value: d.meta, lang: d.lang },
                { key: "MUP", value: d.mup, lang: d.lang },
            ])
            .join("rect")
            .attr("x", d => x1(d.key)!)
            .attr("y", chartHeight)
            .attr("width", x1.bandwidth())
            .attr("height", 0)
            .attr("fill", d => color(d.key)!)
            .on("mouseenter", (event, d) => {
                setTooltip({
                    x: 0,
                    y: 0,
                    value: d.value,
                    label: d.key,
                    opacity: 0.9,
                    year: undefined,
                });

                hoverLine
                    .attr("y1", y(d.value))
                    .attr("y2", y(d.value))
                    .attr("opacity", 0.2);
            })
            .on("mousemove", (event, d) => {
                const tooltipWidth = 80;
                const tooltipHeight = 40;
                const padding = 4;

                // Calculate tooltip position relative to window
                let left = event.clientX + padding;
                let top = event.clientY - tooltipHeight - padding;

                // Keep tooltip inside window bounds
                if (left + tooltipWidth > window.innerWidth) left = window.innerWidth - tooltipWidth - padding;
                if (top < 0) top = padding;

                // Update tooltip state
                setTooltip(prev => prev ? { ...prev, x: left, y: top } : null);

                hoverLine.attr("y1", y(d.value)).attr("y2", y(d.value));
            })
            .on("mouseleave", () => {
                setTooltip(null);
                hoverLine.attr("opacity", 0);
            });

        // Animate
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                bars.transition()
                    .duration(1200)
                    .attr("y", d => y(d.value))
                    .attr("height", d => chartHeight - y(d.value));



                observer.disconnect();
            }
        }, { threshold: 0.5 });

        observer.observe(svgNode);
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
                    }}
                >
                    <b>{tooltip.label}</b><br />
                    {tooltip.value.toLocaleString("fr-FR")}
                </div>
            )}


        </div>
    );
}
