"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObs";

interface LangData {
    lang: string;
    residents: number;
    api_reach_min: number;
    api_reach_max: number;
    api_reach_avg: number;
    country: string;
}

interface Props {
    data: LangData[];
}


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

const apiExpats = [
    {
        "created_at": "2026-02-22T01:29:04.910489+00:00",
        "expat": "Serbia",
        "lang": "Srpski",
        "api_reach_min": 20700,
        "api_reach_avg": 22500,
        "api_reach_max": 24300
    },
    {
        "created_at": "2026-02-22T01:29:04.910489+00:00",
        "expat": "Nepal",
        "lang": "Nepalski",
        "api_reach_min": 23100,
        "api_reach_avg": 25150,
        "api_reach_max": 27200
    },
    {
        "created_at": "2026-02-22T01:29:04.910489+00:00",
        "expat": "Russia",
        "lang": "Ruski",
        "api_reach_min": 1500,
        "api_reach_avg": 1650,
        "api_reach_max": 1800
    },
    {
        "created_at": "2026-02-22T01:29:04.910489+00:00",
        "expat": "Philippines",
        "lang": "Filipinski",
        "api_reach_min": 13700,
        "api_reach_avg": 14900,
        "api_reach_max": 16100
    },
    {
        "created_at": "2026-02-22T01:29:04.910489+00:00",
        "expat": "India",
        "lang": "Hindski",
        "api_reach_min": 9500,
        "api_reach_avg": 10300,
        "api_reach_max": 11100
    },
    {
        "created_at": "2026-02-22T01:29:04.910489+00:00",
        "expat": "Bangladesh",
        "lang": "Bengalski",
        "api_reach_min": 3100,
        "api_reach_avg": 3400,
        "api_reach_max": 3700
    }
];

//2025 mup data
type Stranci = { Državljanstvo: string; lang: string; dozvola: number };

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

const DZS = [
    { lang: "Albanski", minority: "Albanci", number: 13817 },
    { lang: "Njemački", minority: "Austrijanci", number: 365 },
    { lang: "Bosanski", minority: "Bošnjaci", number: 24131 },
    { lang: "Bugarski", minority: "Bugari", number: 262 },
    { lang: "Crnogorski", minority: "Crnogorci", number: 3127 },
    { lang: "Češki", minority: "Česi", number: 7862 },
    { lang: "Mađarski", minority: "Mađari", number: 10315 },
    { lang: "Makedonski", minority: "Makedonci", number: 3555 },
    { lang: "Njemački", minority: "Nijemci", number: 3034 },
    { lang: "Poljski", minority: "Poljaci", number: 657 },
    { lang: "Romani", minority: "Romi", number: 17980 },
    { lang: "Rumunski", minority: "Rumunji", number: 337 },
    { lang: "Ruski", minority: "Rusi", number: 1481 },
    { lang: "Rusinski", minority: "Rusini", number: 1343 },
    { lang: "Slovački", minority: "Slovaci", number: 3688 },
    { lang: "Slovenski", minority: "Slovenci", number: 7729 },
    { lang: "Srpski", minority: "Srbi", number: 123892 },
    { lang: "Talijanski", minority: "Talijani", number: 13763 },
    { lang: "Turski", minority: "Turci", number: 404 },
    { lang: "Ukrajinski", minority: "Ukrajinci", number: 1905 },
    { lang: "Rumunski", minority: "Vlasi", number: 22 },
    { lang: "Hebrejski", minority: "Židovi", number: 410 },
    { lang: "Ostali", minority: "Ostali", number: 13196 },
    { lang: "Regionalni", minority: "Regionalni", number: 12712 },
    { lang: "Vjerski", minority: "Vjerski", number: 5874 },
    { lang: "Neraspoređeni", minority: "Neraspoređeni", number: 3108 },
    { lang: "Neizjašnjeni", minority: "Neizjašnjeni", number: 22388 },
    { lang: "Nepoznato", minority: "Nepoznato", number: 26862 }
];

interface MetaBarChartProps {
    width?: number;
    height?: number;
}



export default function MetaBarChart(
    { data: propsData, width = 1200, height = 450 }: Props & MetaBarChartProps
) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const size = useResizeObserver(containerRef);
    const hasAnimated = useRef(false);

    const ALL_TYPES = ["MUP Dozvole", "DZS Manjine", "API Jezik", "Meta UI", "API Lokacija"] as const;
    type DataType = typeof ALL_TYPES[number];

    const [selectedTypes, setSelectedTypes] = useState([...ALL_TYPES]);

    const toggleType = (type: DataType) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

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

    const color = d3.scaleOrdinal<string, string>()
        .domain(["MUP Dozvole", "DZS Manjine", "Meta UI", "API Jezik", "API Lokacija"])
        .range([
            "#fdae6b",   // MUP
            "#ffcc89",    // DZS
            "#1976D2",   // Meta Ads Manager (dark blue)
            "#63B3ED",   // Meta Graph API (lighter blue)
            "#a8d4f5"
        ]);

    function drawChart(svgNode: SVGSVGElement) {
        if (!size || !svgNode || MupData.length === 0) return;

        const svg = d3.select(svgNode);
        svg.selectAll("*").remove();

        const margin = { top: 40, right: 20, bottom: 50, left: 70 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const mergedData = MupData.map(d => {
            const dzsItem = DZS.find(z => z.lang === d.lang);

            const meta = data.find(m => m.lang === d.lang);

            const api = propsData?.find(a => a.lang === d.lang);

            const apiExpatsMap = new Map(apiExpats.map(d => [d.lang, d]));
            const apiExpat = apiExpatsMap.get(d.lang);


            return {
                lang: d.lang,
                Državljanstvo: d.Državljanstvo,
                mup: d.dozvola,
                dzs: dzsItem ? dzsItem.number : 0,

                // Meta Ads Manager
                meta_avg: meta ? meta.avg : 0,
                meta_min: meta ? meta.min : 0,
                meta_max: meta ? meta.max : 0,

                // Meta Graph API
                api_avg: api ? api.api_reach_avg : 0,
                api_min: api ? api.api_reach_min : 0,
                api_max: api ? api.api_reach_max : 0,

                apiExpat_avg: apiExpat ? apiExpat.api_reach_avg : null,
                apiExpat_min: apiExpat ? apiExpat.api_reach_min : null,
                apiExpat_max: apiExpat ? apiExpat.api_reach_max : null,


            };
        });


        const x0 = d3.scaleBand()
            .domain(mergedData.map(d => d.Državljanstvo))
            .range([0, chartWidth])
            .padding(0.3);



        const stackSelected = selectedTypes.includes("MUP Dozvole") || selectedTypes.includes("DZS Manjine");
        const x1Domain = [
            ...(stackSelected ? ["MUP Dozvole+DZS Manjine"] : []),
            // fixed order for Meta/API/Lokacija
            ...(selectedTypes.includes("Meta UI") ? ["Meta UI"] : []),
            ...(selectedTypes.includes("API Jezik") ? ["API Jezik"] : []),
            ...(selectedTypes.includes("API Lokacija") ? ["API Lokacija"] : [])
        ];

        const x1 = d3.scaleBand()
            .domain(x1Domain)
            .range([0, x0.bandwidth()])
            .padding(0.05);

        const maxValue = d3.max(mergedData, d => {
            const values: number[] = [];

            if (selectedTypes.includes("MUP Dozvole")) values.push(d.mup);
            if (selectedTypes.includes("DZS Manjine")) values.push(d.dzs);
            if (selectedTypes.includes("Meta UI")) values.push(d.meta_max);
            if (selectedTypes.includes("API Jezik")) values.push(d.api_max);
            if (selectedTypes.includes("API Lokacija") && d.apiExpat_max)
                values.push(d.apiExpat_max);

            return d3.max(values) ?? 0;
        }) ?? 0;

        const y = d3.scaleLinear()
            .domain([0, maxValue * 1.1])
            .range([chartHeight, 0])
            .nice();



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
            .attr('transform', d => `translate(${x0(d.Državljanstvo)},0)`);



        const stackCategories: { key: "mup" | "dzs"; label: DataType; }[] = [
            { key: "mup", label: "MUP Dozvole" },
            { key: "dzs", label: "DZS Manjine" }
        ];

        langGroups.each(function (d) {
            let stackOffset = 0;

            stackCategories.forEach(cat => {
                if (!selectedTypes.includes(cat.label)) return;

                const value = d[cat.key];

                // store reference for later toggling if needed
                const rect = d3.select(this).append("rect")
                    .attr("x", x1("MUP Dozvole+DZS Manjine")!)
                    .attr("y", chartHeight) // start at bottom
                    .attr("width", x1.bandwidth())
                    .attr("height", 0)
                    .attr("fill", color(cat.label)!)
                    .attr("opacity", 0.8);

                // transition to stacked position
                rect.transition()
                    .duration(1200)
                    .attr("y", y(stackOffset + value))
                    .attr("height", y(stackOffset) - y(stackOffset + value));

                rect
                    .on("mouseenter", (e, d) => showTooltip(e, d, "stack"))
                    .on("mousemove", (e, d) => showTooltip(e, d, "stack"))
                    .on("mouseleave", hideTooltip);



                stackOffset += value;
            });

        });


        let metaRect = langGroups.append("rect")
            .attr("x", x1("Meta UI")!)
            .attr("y", chartHeight)
            .attr("width", x1.bandwidth())
            .attr("height", 0)
            .attr("fill", color("Meta UI")!)
            .attr("opacity", "0.8");

        if (selectedTypes.includes("Meta UI")) {
            metaRect.transition()
                .duration(1200)
                .attr("y", d => y(d.meta_avg))
                .attr("height", d => chartHeight - y(d.meta_avg));
        }


        let apiRect = langGroups.append("rect")
            .attr("x", x1("API Jezik")!)
            .attr("y", chartHeight)
            .attr("width", x1.bandwidth())
            .attr("height", 0)
            .attr("fill", color("API Jezik")!)
            .attr("opacity", "0.8");

        if (selectedTypes.includes("API Jezik")) {
            apiRect.transition()
                .duration(1200)
                .attr("y", d => y(d.api_avg))
                .attr("height", d => chartHeight - y(d.api_avg));

        }



        let apiExpatRect = langGroups.append("rect")
            .filter(d => d.apiExpat_avg !== null)
            .attr("x", x1("API Lokacija")!)
            .attr("y", chartHeight)
            .attr("width", x1.bandwidth())
            .attr("height", 0)
            .attr("fill", color("API Lokacija")!)
            .attr("opacity", 0.8);

        if (selectedTypes.includes("API Lokacija")) {
            apiExpatRect.transition()
                .duration(1200)
                .attr("y", d => y(d.apiExpat_avg!))
                .attr("height", d => chartHeight - y(d.apiExpat_avg!));
        }

        function drawWhisker(
            group: d3.Selection<SVGGElement, any, any, any>,
            type: "Meta UI" | "API Jezik" | "API Lokacija",
            minValueAccessor: (d: any) => number,
            maxValueAccessor: (d: any) => number,
            delay = 1200 // delay in ms before whisker animation starts
        ) {
            const whiskerWidth = x1.bandwidth() * 0.3;
            const filtered = group.filter(d => minValueAccessor(d) > 0 && maxValueAccessor(d) > 0);

            // Vertical line (from min to max)
            filtered.append("line")
                .attr("class", "whisker")
                .attr("x1", d => x1(type)! + x1.bandwidth() / 2)
                .attr("x2", d => x1(type)! + x1.bandwidth() / 2)
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
                .attr("x1", d => x1(type)! + x1.bandwidth() / 2 - whiskerWidth / 2)
                .attr("x2", d => x1(type)! + x1.bandwidth() / 2 + whiskerWidth / 2)
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
                .attr("x1", d => x1(type)! + x1.bandwidth() / 2 - whiskerWidth / 2)
                .attr("x2", d => x1(type)! + x1.bandwidth() / 2 + whiskerWidth / 2)
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

        if (selectedTypes.includes("Meta UI")) {
            drawWhisker(langGroups, "Meta UI", d => d.meta_min, d => d.meta_max);
        }
        if (selectedTypes.includes("API Jezik")) {
            drawWhisker(langGroups, "API Jezik", d => d.api_min, d => d.api_max);
        }
        if (selectedTypes.includes("API Lokacija")) {
            drawWhisker(langGroups, "API Lokacija", d => d.apiExpat_min!, d => d.apiExpat_max!);
        }





        function showTooltip(
            event: MouseEvent,
            d: any,
            type: "Meta UI" | "API Jezik" | "stack" | "expat"
        ) {
            const padding = 6;

            let left = event.clientX + padding;
            let top = event.clientY - 40;

            let note: React.ReactNode = null;
            if (d.Državljanstvo === "Kosovo") {
                note = <><br />DZS prikazuje Albansku nacionalnu manjinu.<br />MUP prikazuje broj dozvola za državljane Kosova.<br />Meta i API prikazuju podatke za Albanski jezik.</>;
            }

            if (type === "Meta UI") {
                setTooltip({
                    x: left,
                    y: top,
                    opacity: 0.95,
                    label: `${d.Državljanstvo === "BiH" ? "Bosna i Hercegovina" : d.Državljanstvo}`,
                    value: `${d.meta_min.toLocaleString("fr-FR")} - ${d.meta_max.toLocaleString("fr-FR")}`,
                    desc: ``,
                    note: note,


                });

                hoverLine
                    .attr("y1", y(d.meta_avg))
                    .attr("y2", y(d.meta_avg))
                    .attr("opacity", 0.2);

            } else if (type === "expat") {
                setTooltip({
                    x: left,
                    y: top,
                    opacity: 0.95,
                    label: `${d.Državljanstvo === "BiH" ? "Bosna i Hercegovina" : d.Državljanstvo}`,
                    value: `${d.apiExpat_min!.toLocaleString("fr-FR")} - ${d.apiExpat_max!.toLocaleString("fr-FR")}`,
                    desc: ``,
                    note: note,
                });

                hoverLine
                    .attr("y1", y(d.apiExpat_avg!))
                    .attr("y2", y(d.apiExpat_avg!))
                    .attr("opacity", 0.2);
            } else if (type === "API Jezik") {
                setTooltip({
                    x: left,
                    y: top,
                    opacity: 0.95,
                    label: `${d.Državljanstvo === "BiH" ? "Bosna i Hercegovina" : d.Državljanstvo}`,
                    value: `${d.api_min.toLocaleString("fr-FR")} - ${d.api_max.toLocaleString("fr-FR")}`,
                    desc: ``,
                    note: note,
                });

                hoverLine
                    .attr("y1", y(d.api_avg))
                    .attr("y2", y(d.api_avg))
                    .attr("opacity", 0.2);
            } else {
                setTooltip({
                    x: left,
                    y: top,
                    opacity: 0.95,
                    label: `${d.Državljanstvo === "BiH" ? "Bosna i Hercegovina" : d.Državljanstvo}`,
                    value: (d.mup + d.dzs).toLocaleString("fr-FR"),
                    desc: `${d.dzs > 0
                        ? `DZS: ${d.dzs.toLocaleString("fr-FR")}\n`
                        : ""}MUP: ${d.mup.toLocaleString("fr-FR")}`,
                    note: note,
                });

                hoverLine
                    .attr("y1", y(d.mup + d.dzs))
                    .attr("y2", y(d.mup + d.dzs))
                    .attr("opacity", 0.2);
            }
        }

        function hideTooltip() {
            setTooltip(null);
            hoverLine.attr("opacity", 0);
        }

        metaRect
            .on("mouseenter", (e, d) => showTooltip(e, d, "Meta UI"))
            .on("mousemove", (e, d) => showTooltip(e, d, "Meta UI"))
            .on("mouseleave", hideTooltip);

        apiRect
            .on("mouseenter", (e, d) => showTooltip(e, d, "API Jezik"))
            .on("mousemove", (e, d) => showTooltip(e, d, "API Jezik"))
            .on("mouseleave", hideTooltip);

        apiExpatRect
            .on("mouseenter", (e, d) => showTooltip(e, d, "expat"))
            .on("mousemove", (e, d) => showTooltip(e, d, "expat"))
            .on("mouseleave", hideTooltip);

    }

    useEffect(() => {
        if (!size || !svgRef.current) return;
        drawChart(svgRef.current);
    }, [size, selectedTypes]);

    useEffect(() => {
  console.log("propsData received:", propsData);
}, [propsData]);


    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                maxWidth: `${width}px`,
                position: "relative",
            }}
        >
            <div className="flex flex-wrap gap-3 justify-center ">
                {/* MUP + DZS buttons */}
                <div className="flex flex-col gap-2 bg-neutral-50 rounded-lg p-3">
                    <div className="flex justify-center items-center " >Službeni podaci</div>
                    <div className="flex  gap-2">
                        {(["MUP Dozvole", "DZS Manjine"] as const).map(type => (
                            <button
                                key={type}
                                aria-pressed={selectedTypes.includes(type)}
                                onClick={() => toggleType(type)}
                                className="button"
                                style={{
                                    backgroundColor: selectedTypes.includes(type)
                                        ? color(type)
                                        : "#eee",
                                    color: selectedTypes.includes(type) ? "#fff" : ""
                                }}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gap between stacks and the rest */}
                <div style={{ width: "1rem" }}></div>

                {/* Other types: Meta, API, API Expat */}
                <div className="flex flex-col gap-2 bg-neutral-50 rounded-lg p-3 ">
                    <div className="flex justify-center items-center " >Meta procjene</div>
                    <div className="flex  gap-2">
                        {(["Meta UI", "API Jezik", "API Lokacija"] as const).map(type => (
                            <button
                                key={type}
                                aria-pressed={selectedTypes.includes(type)}
                                onClick={() => toggleType(type)}
                                className="button"
                                style={{
                                    backgroundColor: selectedTypes.includes(type)
                                        ? color(type)
                                        : "#eee",
                                    color: selectedTypes.includes(type) ? "#fff" : ""
                                }}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

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
                    <br />{tooltip.desc}
                    {tooltip.note && <div>{tooltip.note}</div>}
                </div>
            )}

        </div>
    );
}
