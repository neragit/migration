"use client";

import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

interface LineChartProps {
  width?: number;
  height?: number;
}

export default function LineChart({ width = 700, height = 400 }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);


  const migrationData = [
    { year: 2015, immigrants: 11706, emigrants: 29651 },
    { year: 2016, immigrants: 13985, emigrants: 36436 },
    { year: 2017, immigrants: 15553, emigrants: 47352 },
    { year: 2018, immigrants: 26029, emigrants: 39515 },
    { year: 2019, immigrants: 37726, emigrants: 40148 },
    { year: 2020, immigrants: 33414, emigrants: 34046 },
    { year: 2021, immigrants: 35912, emigrants: 40424 },
    { year: 2022, immigrants: 57972, emigrants: 46287 },
    { year: 2023, immigrants: 69396, emigrants: 39218 },
    { year: 2024, immigrants: 70391, emigrants: 38997 },
  ];

  useEffect(() => {
    if (!migrationData || migrationData.length === 0) return;

    const margin = { top: 40, right: 40, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(migrationData, (d) => d.year) as [number, number])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(migrationData, (d) => Math.max(d.immigrants, d.emigrants))! * 1.1])
      .range([innerHeight, 0]);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ""))
      .attr("stroke-opacity", 0.05)
      .selectAll("line")
      .attr("stroke", "#888");

    // Axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).tickSize(0).tickPadding(20);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format("d")).tickSize(0).tickPadding(20);

    const xAxisGroup = g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .select(".domain")
      .attr("stroke", "#eee");

    const yAxisGroup = g.append("g")
      .call(yAxis)
      .select(".domain")
      .attr("stroke", "#eee");

    // Make tick labels hidden initially
    const xTicks = g.selectAll(".x-axis .tick text")
      .style("opacity", 0)  // hidden initially
      .attr("fill", "#555")
      .attr("font-size", "12px")
      .attr("font-family", "Mukta, sans-serif");

    g.selectAll(".tick text:not(.x-axis .tick text)")
      .attr("fill", "#555")
      .attr("font-size", "12px")
      .attr("font-family", "Mukta, sans-serif");

    const events = [
      {
        year: 2020,
        yOffset: 180,
        labels: [
          { text: "COVID-19 i ograničenja kretanja" },
          {
            text: "Vlada ukida kvote za zapošljavanje stranaca",
            link: "https://narodne-novine.nn.hr/clanci/sluzbeni/2020_12_133_2520.html"
          },
        ],
      },
      {
        year: 2022,
        yOffset: 60,
        labels: [{ text: "Rat u Ukrajini" }],
      },
      {
        year: 2023,
        yOffset: -15,
        labels: [{ text: "Uveden EURO" }],
      },
    ];

    const eventGroup = g.append("g").attr("class", "events");
    const baseY = 36;
    const lineHeight = 14;

    events.forEach((event, idx) => {
      const line = eventGroup
        .append("line")
        .attr("x1", xScale(event.year))
        .attr("x2", xScale(event.year))
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "#666")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4,4")
        .attr("opacity", 0);

      const text = eventGroup
        .append("text")
        .attr("x", xScale(event.year) + 6)
        .attr("y", baseY + event.yOffset)
        .attr("font-size", 13)
        .attr("font-weight", "bold")
        .attr("fill", "#00a651");

      const tspans = event.labels.map((labelObj, i) => {
        const tspan = text
          .append("tspan")
          .attr("x", xScale(event.year) + 6)
          .attr("y", baseY + event.yOffset + i * lineHeight)
          .text(labelObj.text)
          .style("opacity", 0)
          .style("cursor", labelObj.link ? "pointer" : "default");

        if (labelObj.link) tspan.on("click", () => window.open(labelObj.link, "_blank"));

        return tspan;
      });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            line
              .transition()
              .duration(3000)
              .delay(idx * 1000)
              .attr("opacity", 0.2);

            tspans.forEach((tspan, i) => {
              tspan
                .transition()
                .duration(3000)
                .delay(idx * 1000 + 4000)
                .style("opacity", 1);
            });

            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(svgRef.current!);
    });

    // Line generators
    const lineImmigrants = d3
      .line<{ year: number; immigrants: number; emigrants: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.immigrants))
      .curve(d3.curveMonotoneX);

    const lineEmigrants = d3
      .line<{ year: number; immigrants: number; emigrants: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.emigrants))
      .curve(d3.curveMonotoneX);

    const tooltip = d3.select(tooltipRef.current);

    const lines = [
      { line: lineImmigrants, color: "#00a651", class: "dot-imm" },
      { line: lineEmigrants, color: "#6a0dad", class: "dot-emg" },
    ];

    lines.forEach(({ line, color, class: cls }) => {
      const path = g
        .append("path")
        .datum(migrationData)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 3)
        .attr("d", line);

      const totalLength = path.node()!.getTotalLength();
      path.attr("stroke-dasharray", totalLength).attr("stroke-dashoffset", totalLength);

      const circles = g
        .selectAll(`.${cls}`)
        .data(migrationData)
        .enter()
        .append("circle")
        .attr("class", cls)
        .attr("cx", (d) => xScale(d.year))
        .attr("cy", (d) => (cls === "dot-imm" ? yScale(d.immigrants) : yScale(d.emigrants)))
        .attr("r", 4)
        .attr("fill", color)
        .style("opacity", 0)
        .on("mouseenter", (event, d) => {
          const value = cls === "dot-imm" ? d.immigrants : d.emigrants;
          const label = cls === "dot-imm" ? "Imigranti" : "Emigranti";

          tooltip
            .style("display", "block")
            .html(`<b>${label}:</b> ${new Intl.NumberFormat('fr-FR').format(value)}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`)
            .style("opacity", 0.90);
        })
        .on("mousemove", (event) => {
          tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 20}px`);
        })
        .on("mouseleave", () => {
          tooltip.style("display", "none");
        });

      // Animate line, circles, and now x-tick labels on scroll
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            path.transition().duration(5000).ease(d3.easeCubic).attr("stroke-dashoffset", 0);

            circles.transition().delay(4000).duration(1000).style("opacity", 1);

            // Animate x-axis tick labels sequentially
            xTicks.each((d, i, nodes) => {
              d3.select(nodes[i])
                .transition()
                .delay(i * 500)
                .duration(3000)
                .style("opacity", 1);
            });

            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(svgRef.current!);
    });

    const legend = svg.append("g").attr("transform", `translate(${width - margin.right + 40}, ${margin.top})`);

    legend
      .append("circle")
      .attr("cx", 6)
      .attr("cy", 6)
      .attr("r", 6)
      .attr("fill", "#00a651");
    legend
      .append("text")
      .attr("x", 18)
      .attr("y", 10)
      .text("Imigranti")
      .attr("font-size", "13px")
      .attr("fill", "#555");

    legend
      .append("circle")
      .attr("cx", 6)
      .attr("cy", 26)
      .attr("r", 6)
      .attr("fill", "#6a0dad");
    legend
      .append("text")
      .attr("x", 18)
      .attr("y", 30)
      .text("Emigranti")
      .attr("font-size", "13px")
      .attr("fill", "#555");
  }, [width, height]);

  return (
    <>
      <svg ref={svgRef} width={width} height={height} style={{ overflow: "visible" }}></svg>
      <div
        ref={tooltipRef}
        className = "tooltip"
        style={{
          position: "absolute",
        }}
      />
    </>
  );
}
