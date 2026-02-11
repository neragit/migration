"use client";

import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObs";

interface DataPoint {
  year: number;
  value: number;
}

interface CountryData {
  country: string;
  values: DataPoint[];
}

interface MultiLineChartProps {
  width?: number;
  height?: number;
}

export default function MultiLineChart({ width = 700, height = 450 }: MultiLineChartProps) {

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const size = useResizeObserver(containerRef);
  const hasAnimated = useRef(false);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    label: string;
    formattedValue: string;
    opacity: number;
    year: number;
  } | null>(null);

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

  const isPortrait = size ? size.vw / size.vh < 1.7 : true;

  function drawChart(svgNode: SVGSVGElement, parent: HTMLElement) {
    if (!size || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Legend position inside the SVG
    let x = isPortrait ? 0 : size.width + 100;
    let y = isPortrait ? -150 : 0;

    // xScale
    const years = data[0].values.map(d => d.year);
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(years) as [number, number])
      .range([0, width]);

    // yScale
    const maxY = d3.max(data, c => d3.max(c.values, d => d.value)) || 0;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxY * 1.1])
      .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(data.map(d => d.country));

    const g = svg.append("g").attr("transform", `translate(0,0)`);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-500).tickFormat(() => ""))
      .attr("stroke-opacity", 0.05)
      .selectAll("line")
      .attr("stroke", "#888");

    // Axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).tickSize(0).tickPadding(20);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format("d")).tickSize(0).tickPadding(20);

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .select(".domain")
      .attr("stroke", "#eee");

    g.append("g")
      .call(yAxis)
      .select(".domain")
      .attr("stroke", "#eee");

    // Make tick labels hidden initially
    const xTicks = g.selectAll(".x-axis .tick text")
      .style("opacity", 0)
      .attr("fill", "#555")
      .attr("font-size", "12px")
      .attr("font-family", "Mukta, sans-serif");

    g.selectAll(".tick text:not(.x-axis .tick text)")
      .attr("fill", "#555")
      .attr("font-size", "12px")
      .attr("font-family", "Mukta, sans-serif");

    const lineGen = d3.line<DataPoint>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    data.forEach((countryData, idx) => {
      const color = colorScale(countryData.country) as string;
      const cls = `line-${idx}`;

      const path = g
        .append("path")
        .datum(countryData.values)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 3)
        .attr("d", lineGen)
        .style("pointer-events", "none");

      const totalLength = path.node()!.getTotalLength();
      path.attr("stroke-dasharray", totalLength).attr("stroke-dashoffset", totalLength);

      const circles = g
        .selectAll(`.${cls}`)
        .data(countryData.values)
        .enter()
        .append("circle")
        .attr("class", cls)
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.value))
        .attr("r", 4)
        .attr("fill", color)
        .style("opacity", 0)
        .style("pointer-events", "none");

      const hoverCircles = g
        .selectAll(`.hover-${cls}`)
        .data(countryData.values)
        .enter()
        .append("circle")
        .attr("class", `hover-${cls}`)
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.value))
        .attr("r", 12)
        .attr("fill", "transparent")
        .on("mouseenter", (event, d) => {
          const svgWrapper = svgRef.current?.parentElement;
          const wrapperRect = svgWrapper?.getBoundingClientRect();
          if (!wrapperRect) return;

          const tooltipWidth = 70;
          const tooltipHeight = 10;
          const padding = 10;

          let left = event.clientX - wrapperRect.left + padding;
          let top = event.clientY - wrapperRect.top + padding;

          if (left + tooltipWidth > wrapperRect.width) {
            left = wrapperRect.width - tooltipWidth - padding;
          }
          if (top + tooltipHeight > wrapperRect.height) {
            top = event.clientY - wrapperRect.top - tooltipHeight - padding;
          }

          // Add highlight line
          g.selectAll(".highlight-line").remove();
          g.append("line")
            .attr("class", "highlight-line")
            .attr("x1", xScale(d.year))
            .attr("x2", xScale(d.year))
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "#ccc")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "4,4")
            .attr("opacity", 0.5)
            .attr("pointer-events", "none");

          setTooltip({
            x: left,
            y: top,
            label: countryData.country,
            formattedValue: new Intl.NumberFormat('fr-FR').format(d.value),
            year: d.year,
            opacity: 0.9
          });
        })
        .on("mousemove", (event) => {
          const svgWrapper = svgRef.current?.parentElement;
          const wrapperRect = svgWrapper?.getBoundingClientRect();
          if (!wrapperRect) return;

          const tooltipWidth = 70;
          let left = event.clientX - wrapperRect.left + 10;

          if (left + tooltipWidth > wrapperRect.width) {
            left = wrapperRect.width - tooltipWidth - 10;
          }

          setTooltip(prev => prev ? {
            ...prev,
            x: left,
            y: event.clientY - wrapperRect.top + 10
          } : null);
        })
        .on("mouseleave", () => {
          g.selectAll(".highlight-line").remove();
          setTooltip(null);
        });

      // Animate line, circles, and x-tick labels on scroll
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            path.transition().duration(5000).ease(d3.easeCubic).attr("stroke-dashoffset", 0);
            circles.transition().delay(4000).duration(1000).style("opacity", 1);

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

    // Legend
    let legend = svg.select<SVGGElement>(".legend");

    if (legend.empty()) {
      legend = svg.append("g").attr("class", "legend");

      data.forEach((countryData, i) => {
        const row = legend.append("g")
          .attr("transform", `translate(0, ${i * 20})`);

        row.append("circle")
          .attr("r", 6)
          .attr("fill", colorScale(countryData.country) as string);

        row.append("text")
          .attr("x", 18)
          .attr("y", 4)
          .text(countryData.country)
          .attr("font-size", "13px")
          .attr("fill", "#555");
      });
    }

    legend.attr("transform", `translate(${x}, ${y})`);
  }

  useEffect(() => {
    if (!size || !svgRef.current) return;

    const svgNode = svgRef.current;
    const parent = svgNode.parentElement;
    if (!parent) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          drawChart(svgNode, parent);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(svgNode);
    return () => observer.disconnect();
  }, [size]);

  useEffect(() => {
    if (!size || !svgRef.current) return;
    if (!hasAnimated.current) return;

    const svgNode = svgRef.current;
    const parent = svgNode.parentElement;
    if (!parent) return;

    drawChart(svgNode, parent);
  }, [size?.width]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: `${width}px`,
        height: (size?.height ?? 0) < 400 && !isPortrait ? "100vh" : "auto",
        paddingTop: isPortrait ? "15%" : "0",
        paddingLeft: isPortrait ? "10%" : "5%",
        paddingBottom: isPortrait ? "10%" : "15%",
        position: "relative"
      }}
    >
      <div style={{ position: "relative", overflow: "visible" }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            height: "100%",
            display: "block",
            overflow: "visible"
          }}
        ></svg>

        {tooltip && (
          <div
            className="tooltip"
            style={{
              position: "absolute",
              left: Math.min(
                tooltip.x,
                (containerRef.current?.clientWidth ?? 0) - 10
              ),
              top: Math.min(
                tooltip.y,
                (containerRef.current?.clientHeight ?? 0) - 10
              ),
              opacity: tooltip.opacity,
              transition: "opacity 0.2s ease",
            }}
          >
            <b>{tooltip.label}</b>
            <br />{tooltip.year}: {tooltip.formattedValue}
          </div>
        )}
      </div>
    </div>
  );
}