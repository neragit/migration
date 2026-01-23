"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface DataPoint {
  year: number;
  value: number;
}

interface CountryData {
  country: string;
  values: DataPoint[];
}

interface TopImmigrantsProps {
  width?: number;
  height?: number;
}

export default function TopImmigrants({ width = 740, height = 420 }: TopImmigrantsProps) {

  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Internal dataset
  const data: CountryData[] = [
    {
      country: "Azija",
      values: [
        { year: 2020, value: 2159 },
        { year: 2021, value: 4358 },
        { year: 2022, value: 11874 },
        { year: 2023, value: 17923 },
        { year: 2024, value: 26601 },
      ],
    },
    {
      country: "Bosna i Hercegovina",
      values: [
        { year: 2020, value: 7634 },
        { year: 2021, value: 6371 },
        { year: 2022, value: 6949 },
        { year: 2023, value: 7010 },
        { year: 2024, value: 6510 },
      ],
    },
    {
      country: "Srbija",
      values: [
        { year: 2020, value: 4191 },
        { year: 2021, value: 3131 },
        { year: 2022, value: 3948 },
        { year: 2023, value: 4897 },
        { year: 2024, value: 5071 },
      ],
    },
    {
      country: "Ukrajina",
      values: [
        { year: 2020, value: 951 },
        { year: 2021, value: 735 },
        { year: 2022, value: 11121 },
        { year: 2023, value: 13101 },
        { year: 2024, value: 3530 },
      ],
    },
    {
      country: "Afrika",
      values: [
        { year: 2020, value: 135 },
        { year: 2021, value: 177 },
        { year: 2022, value: 675 },
        { year: 2023, value: 1673 },
        { year: 2024, value: 2567 },
      ],
    },
    {
      country: "Sjeverna Makedonija",
      values: [
        { year: 2020, value: 1106 },
        { year: 2021, value: 1027 },
        { year: 2022, value: 1578 },
        { year: 2023, value: 2118 },
        { year: 2024, value: 2084 },
      ],
    },
    {
      country: "Kosovo",
      values: [
        { year: 2020, value: 2443 },
        { year: 2021, value: 1835 },
        { year: 2022, value: 2258 },
        { year: 2023, value: 2336 },
        { year: 2024, value: 1885 },
      ],
    },
  ];

  useEffect(() => {
    if (!data || data.length === 0) return;

    const isMobile = window.innerWidth < 900;

    const margin = {
      top: isMobile ? 20 : 40,
      right: isMobile ? 40 : 80,
      bottom: isMobile ? 20 : 50,
      left: isMobile ? 10 : 60,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale
    const years = data[0].values.map(d => d.year);
    const xScale = d3.scaleLinear().domain(d3.extent(years) as [number, number]).range([0, innerWidth]);

    // Y scale
    const maxY = d3.max(data, c => d3.max(c.values, d => d.value)) || 0;
    const yScale = d3.scaleLinear().domain([0, maxY * 1.1]).range([innerHeight, 0]);

    // Color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(data.map(d => d.country));

    // Grid lines
        g.append("g")
          .attr("class", "grid")
          .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ""))
          .attr("stroke-opacity", 0.05)
          .selectAll("line")
          .attr("stroke", "#888");
    
        // Axes
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).tickSize(0).tickPadding(20).ticks(5);
        const yAxis = d3.axisLeft(yScale).tickFormat(d3.format("d")).tickSize(0).tickPadding(20).ticks(6);
    
        g.append("g")
          .attr("transform", `translate(0,${innerHeight})`)
          .call(xAxis)
          .select(".domain")
          .attr("stroke", "#eee");
    
        g.append("g")
          .call(yAxis)
          .select(".domain")
          .attr("stroke", "#eee");
    
        g.selectAll(".tick text")
          .attr("fill", "#555")
          .attr("font-family", "Mukta, sans-serif")
          .attr("font-size", "12px");

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Line generator
    const lineGen = d3.line<DataPoint>().x(d => xScale(d.year)).y(d => yScale(d.value)).curve(d3.curveMonotoneX);

    // Draw lines and circles
    data.forEach((countryData, idx) => {
      const color = colorScale(countryData.country) as string;

      // Line path
      const path = g.append("path")
        .datum(countryData.values)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 3)
        .attr("d", lineGen);

      const totalLength = path.node()!.getTotalLength();
      path.attr("stroke-dasharray", totalLength).attr("stroke-dashoffset", totalLength);

      // Animate on scroll
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          path.transition().duration(3000).attr("stroke-dashoffset", 0);
          circles.transition().delay(2500).duration(1000).style("opacity", 1);
          observer.disconnect();
        }
      }, { threshold: 0.5 });

      const circles = g.selectAll(`.circle-${idx}`)
        .data(countryData.values)
        .enter()
        .append("circle")
        .attr("class", `circle-${idx}`)
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.value))
        .attr("r", 5)
        .attr("fill", color)
        .style("opacity", 0)
        .on("mouseenter", (event, d) => {
          tooltip.style("display", "block")
            .html(`<strong>${countryData.country}</strong><br/>Godina: ${d.year}<br/>Broj imigranata: ${new Intl.NumberFormat('fr-FR').format(d.value)}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 30}px`);
        })
        .on("mousemove", (event) => {
          tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 30}px`);
        })
        .on("mouseleave", () => tooltip.style("display", "none"));

      observer.observe(svgRef.current!);
    });

    // Legend
    const legend = svg.append("g").attr("transform", `translate(${width - margin.right + 40}, ${margin.top})`);
    data.forEach((c, i) => {
      const color = colorScale(c.country) as string;
      const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
      row.append("circle")
        .attr("cx", 6)        // circle center x
        .attr("cy", 6)        // circle center y
        .attr("r", 6)         // radius
        .attr("fill", color);

      row.append("text").attr("x", 18).attr("y", 10).attr("font-size", 12).attr("fill", "#555").text(c.country);
    });

  }, [width, height]);

  return (
    <>
      <svg ref={svgRef} width={width} height={height} style={{ overflow: "visible" }}></svg>
      <div
        ref={tooltipRef}
        className="tooltip"
        style={{
          position: "absolute",
          opacity: "0.90",
        }}
      />
    </>
  );
}
