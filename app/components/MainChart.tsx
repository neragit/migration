"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObs";

interface LineChartProps {
  width?: number;
  height?: number;
}

export default function LineChart({ width = 700, height = 500 }: LineChartProps) {

  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const size = useResizeObserver(containerRef); // width, height
  const hasAnimated = useRef(false);


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


  const moveLegend = size ? size.vw < 900 : true;

  function drawChart(svgNode: SVGSVGElement, parent: HTMLElement) {
    if (!size || !migrationData || migrationData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Legend position inside the SVG
    let x = moveLegend ? 0 : size.width + 70 ;
    let y = moveLegend ? - 50 : 0;

    // xScale
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(migrationData, (d) => d.year) as [number, number])
      .range([0, width]);

    // yScale
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(migrationData, (d) => Math.max(d.immigrants, d.emigrants))! * 1.1])
      .range([height, 0]);

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

    const xAxisGroup = g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
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
        yOffset: height * 0.55,
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
        yOffset: height * 0.22,
        labels: [{ text: "Rat u Ukrajini" }],
      },
      {
        year: 2023,
        yOffset: height * 0.08,
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
        .attr("y2", height)
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

            console.log("EVENT PAGE X/Y:", event.pageX, event.pageY);
            console.log("SVG SIZE:", svgRef.current?.clientWidth, svgRef.current?.clientHeight);
            console.log("CONTAINER SIZE:", size?.vw, size?.vh);

            tooltip
              .style("display", "block")
              .html(`<b>${label}:</b> ${new Intl.NumberFormat('fr-FR').format(value)}`)
              .style("left", `${Math.min(event.pageX + 10, size?.vw - 100)}px`)
              .style("top", `${Math.min(event.pageY + 10, size?.vh - 10)}px`)
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

      let legend = svg.select<SVGGElement>(".legend");



      if (legend.empty()) {
        legend = svg.append("g").attr("class", "legend");

        legend.append("circle")
          .attr("class", "imm")
          .attr("r", 6)
          .attr("fill", "#00a651");

        legend.append("text")
          .attr("class", "imm-text")
          .attr("x", 18)
          .attr("y", 4)
          .text("Imigranti")
          .attr("font-size", "13px")
          .attr("fill", "#555");

        legend.append("circle")
          .attr("class", "emg")
          .attr("r", 6)
          .attr("fill", "#6a0dad");

        legend.append("text")
          .attr("class", "emg-text")
          .attr("x", 18)
          .attr("y", 4)
          .text("Emigranti")
          .attr("font-size", "13px")
          .attr("fill", "#555");
      }

      legend.attr("transform", `translate(${x}, ${y})`);

      legend.select(".imm").attr("cx", 6).attr("cy", 6);
      legend.select(".imm-text").attr("y", 10);

      legend.select(".emg").attr("cx", 6).attr("cy", 26);
      legend.select(".emg-text").attr("y", 30);

    });

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
    <>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: `${width}px`,
          height: "auto",
          border: "2px solid red",
          boxSizing: "border-box",
          paddingTop: moveLegend ? "5%" : "0",
          paddingLeft: moveLegend ? "10%" : "5%",
          paddingBottom: moveLegend ? "10%" : "15%",

        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            width:  "100%", 
            maxHeight: "90%",
            display: "block",
            overflow: "visible",
            border: "1px dashed blue"
          }}
        ></svg>
      </div>

      <div
        ref={tooltipRef}
        className="tooltip"
        style={{
          position: "absolute",
        }}
      />
    </>
  );
}
