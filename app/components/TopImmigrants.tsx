"use client";

import { useRef, useEffect } from "react";
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

interface TopImmigrantsProps {
  width?: number;
  height?: number;
}

export default function TopImmigrants({ width = 700, height = 500 }: TopImmigrantsProps) {

  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const size = useResizeObserver(containerRef); // { width, height }

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
    if (!size || !data.length) return;

    let isPortrait = size.vw / size.vh < 1.7;

    const margin = {
      top: isPortrait ? 160 : 20,
      bottom: isPortrait ? -30 : 50,
      left: isPortrait ? 60 : 60,
      right: isPortrait ? 0 : 0,
    };

    let x = isPortrait // legend x
      ? margin.left
      : size.width + 30;

    let y = isPortrait // legend y
      ? margin.top - 150
      : margin.top;

    const innerWidth = size.width - margin.left - margin.right;
    const innerHeight = size.height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const years = data[0].values.map(d => d.year);
    const xScale = d3.scaleLinear()
      .domain(d3.extent(years) as [number, number])
      .range([0, innerWidth]);

    const maxY = d3.max(data, c => d3.max(c.values, d => d.value)) || 0;
    const yScale = d3.scaleLinear()
      .domain([0, maxY * 1.1])
      .range([innerHeight, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(data.map(d => d.country));

    // Grid
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ""))
      .attr("stroke-opacity", 0.05)
      .selectAll("line")
      .attr("stroke", "#888");

    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format("d"))
      .tickSize(0)
      .tickPadding(20)
      .ticks(5);


    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.format("d"))
      .tickSize(0)
      .tickPadding(20)
      .ticks(6);


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

    const tooltip = d3.select(tooltipRef.current);

    const lineGen = d3.line<DataPoint>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    data.forEach((countryData, idx) => {
      const color = colorScale(countryData.country) as string;

      const path = g.append("path")
        .datum(countryData.values)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 3)
        .attr("d", lineGen);

      const totalLength = path.node()!.getTotalLength();
      path.attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength);

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
          tooltip
            .style("display", "block")
            .html(
              `<strong>${countryData.country}</strong><br/>
               Godina: ${d.year}<br/>
               Broj imigranata: ${new Intl.NumberFormat("fr-FR").format(d.value)}`
            )
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 30}px`);
        })
        .on("mousemove", event => {
          tooltip
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 30}px`);
        })
        .on("mouseleave", () => tooltip.style("display", "none"));

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          path.transition().duration(3000).attr("stroke-dashoffset", 0);
          circles.transition().delay(2500).duration(1000).style("opacity", 1);
          observer.disconnect();
        }
      }, { threshold: 0.5 });

      observer.observe(svgRef.current!);
    });


    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${x}, ${y})`);


    data.forEach((c, i) => {
      const row = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      row.append("circle")
        .attr("cx", 6)
        .attr("cy", 6)
        .attr("r", 6)
        .attr("fill", colorScale(c.country) as string);

      row.append("text")
        .attr("x", 18)
        .attr("y", 10)
        .attr("font-size", "13px")
        .attr("fill", "#555")
        .text(c.country);
    });


  }, [size, width, height]);

  return (
    <>
      <div
        ref={containerRef}
        style={{ width: "100%", maxWidth: `${width}px`, minWidth: `450px`, height: "auto"  }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ display: "block", overflow: "visible" }}
        ></svg>
      </div>

      <div
        ref={tooltipRef}
        className="tooltip"
        style={{
          position: "absolute"
        }}
      />
    </>
  );
}
