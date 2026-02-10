import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../hooks/useResizeObs";

const data = [
  { year: 2020, Imigranti: 8460, Emigranti: 20886 },
  { year: 2021, Imigranti: 10622, Emigranti: 25950 },
  { year: 2022, Imigranti: 10340, Emigranti: 32739 },
  { year: 2023, Imigranti: 10852, Emigranti: 25427 },
  { year: 2024, Imigranti: 13290, Emigranti: 20147 }
];


export default function PersonBars() {

  const ref = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const size = useResizeObserver(ref);
  const hasAnimated = useRef(false);


  function drawChart(svgNode: SVGSVGElement, parent: HTMLElement) {

    const parentRect = parent.getBoundingClientRect();
    if (!size) return;
    if (!parent) return;

    const height = 400;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    const sidebar = document.querySelector<HTMLElement>(".sidebar");

    let sidebarVisible = sidebar && sidebar.getBoundingClientRect().width > 0;

    let smallScreen = size.vw < 1000;

    let nudge = 0;

    if (smallScreen && sidebarVisible) {
      nudge += (sidebar?.offsetWidth || 0) + 300;
    }

    let width = size.width * 1.2;
    
    const maxIconsPerRow = 50;
    const PEOPLE_UNIT = 1000;
    const gap = width / 500;
    const iconW = Math.min(10, width / (2 * maxIconsPerRow));
    const iconH = iconW * 2.5;
    let viewportCenterX = window.innerWidth / 2 + nudge;
    const containerCenterX = parentRect.left + parentRect.width / 2;

    let offsetX = viewportCenterX - containerCenterX;
    let centerX = width / 2;

      if (smallScreen) {
      viewportCenterX = size.width / 2;
    }

    const svg = d3.select(svgNode);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const root = svg.append("g").attr("transform", `translate(${offsetX}, 0)`);

    const imageWidth = 700;

    root
      .append("image")
      .attr("href", "/hr.png")
      .attr("x", centerX - imageWidth / 2)
      .attr("y", 0)
      .attr("width", imageWidth)
      .attr("height", height)
      .attr("opacity", 0.05);


    const defs = svg.append("defs");
    const symbol = defs.append("symbol").attr("id", "line-icon").attr("viewBox", "0 0 98 284");
    symbol
      .append("path")
      .attr(
        "d",
        "M17.877,187.566c-9.675,-3.049 -16.698,-12.099 -16.698,-22.775l0,-79.586c0,-13.176 10.697,-23.874 23.874,-23.874l47.748,0c13.176,0 23.874,10.697 23.874,23.874l0,79.586c0,10.19 -6.398,18.898 -15.394,22.321l0,79.215c0,8.748 -7.102,15.851 -15.851,15.851l-31.702,0c-8.748,0 -15.851,-7.102 -15.851,-15.851l0,-78.762Z"
      )
      .attr("fill", "currentColor");
    symbol.append("circle").attr("cx", 48.927).attr("cy", 25.12).attr("r", 23.941).attr("fill", "currentColor");

    const yScale = d3.scaleBand<number>().domain(data.map(d => d.year)).range([margin.top, height - margin.bottom]).padding(0.2);

    function drawPeopleRow({ g, count, y, direction, color, centerGap = 30, label }: any) {

      const fullIcons = Math.floor(count / PEOPLE_UNIT);
      const remainder = (count % PEOPLE_UNIT) / PEOPLE_UNIT;

      const getX = (i: number) => direction * (centerGap + i * (iconW + gap));

      // grey
      d3.range(fullIcons + (remainder > 0 ? 1 : 0)).forEach(i => {
        g.append("use")
          .attr("href", "#line-icon")
          .attr("x", getX(i))
          .attr("y", y - iconH / 2)
          .attr("width", iconW)
          .attr("height", iconH)
          .style("color", "#ccc")
          .style("opacity", 0)
          .transition()
          .delay(i * 15)
          .duration(1000)
          .style("opacity", 1)

      });

      // colored
      d3.range(fullIcons).forEach(i => {
        g.append("use")
          .attr("href", "#line-icon")
          .attr("x", getX(i))
          .attr("y", y - iconH / 2)
          .attr("width", iconW)
          .attr("height", iconH)
          .style("color", color)
          .style("opacity", 0)
          .transition()
          .delay(i * 15 + 1) // after grey icons
          .duration(1000)
          .style("opacity", 1);
      });

      if (remainder > 0) {
        const clipId = `clip-${Math.random().toString(36).slice(2)}`;
        const clip = d3.select(g.node().ownerSVGElement).select("defs").append("clipPath").attr("id", clipId);
        clip.append("rect").attr("x", direction === -1 ? iconW * (1 - remainder) : 0).attr("y", 0).attr("width", iconW * remainder).attr("height", iconH);
        g.append("use")
          .attr("href", "#line-icon")
          .attr("x", getX(fullIcons))
          .attr("y", y - iconH / 2)
          .attr("width", iconW)
          .attr("height", iconH)
          .style("color", color)
          .style("opacity", 0)
          .attr("clip-path", `url(#${clipId})`)
          .transition()
          .delay(300)
          .duration(1000)
          .style("opacity", 1);
      }
    }

    // vertical line
    const line = root
      .append("line")
      .attr("x1", centerX)
      .attr("x2", centerX)
      .attr("y1", margin.top - 10)
      .attr("y2", margin.top - 10)
      .attr("stroke", "#ddd")
      .attr("stroke-dasharray", "3,3");

    const arrow = root
      .append("path")
      .attr(
        "d",
        d3.line()([
          [centerX, margin.top - 10],
          [centerX - 5, margin.top - 20],
          [centerX + 5, margin.top - 20],
          [centerX, margin.top - 10]
        ])
      )
      .attr("fill", "#ddd");

    const rows = root.selectAll(".row").data(data).join("g").attr("class", "row").attr("transform", d => `translate(${centerX}, ${yScale(d.year)! + yScale.bandwidth() / 2})`);
    rows.selectAll("text.year-label")
      .data(d => [d])
      .join("text")
      .attr("class", "year-label")
      .attr("y", 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#555")
      .style("opacity", 0)
      .text(d => d.year);


    // --- Animate vertical line + arrow ---
    line.transition()
      .duration(2000)
      .attr("y2", height - margin.bottom)
      .on("start", () => {
        arrow.transition()
          .duration(2000)
          .attrTween("transform", () => t => `translate(0, ${(height - margin.bottom - (margin.top - 10)) * t})`);
      })
      .on("end", () => {
        // Fade in year labels
        rows.selectAll("text.year-label")
          .transition()
          .delay((_, i) => i * 500)
          .duration(1000)
          .style("opacity", 1);

        // Draw people icons with grey → colored
        rows.each(function (d) {
          const g = d3.select(this);
          drawPeopleRow({ g, count: d.Imigranti, y: 0, direction: 1, color: "#00a651", centerGap: 30 });
          drawPeopleRow({ g, count: d.Emigranti, y: 0, direction: -1, color: "#6a0dad", centerGap: 40 });

          // tooltip
          g.selectAll("use") // each icon
            .on("mouseenter", function (event: MouseEvent) {
              if (!tooltipRef.current || !ref.current) return;

              const containerRect = ref.current.getBoundingClientRect();

              const iconColor = d3.select(this).style("color");
              const isImigranti = iconColor === "rgb(0, 166, 81)";

              d3.select(tooltipRef.current)
                .style("display", "block")
                .style("opacity", 1)
                .html(`<b>${d.year}</b><br>${isImigranti
                  ? `Useljenici: ${d.Imigranti.toLocaleString("fr-FR")}`
                  : `Iseljenici: ${d.Emigranti.toLocaleString("fr-FR")}`
                  }`)
                .style("left", `${event.clientX - containerRect.left + 10}px`)
                .style("top", `${event.clientY - containerRect.top + 10}px`);
            })
            .on("mousemove", (event: MouseEvent) => {
              if (!tooltipRef.current || !ref.current) return;

              const containerRect = ref.current.getBoundingClientRect();

              d3.select(tooltipRef.current)
                .style("left", `${event.clientX - containerRect.left + 10}px`)
                .style("top", `${event.clientY - containerRect.top + 10}px`);
            })
            .on("mouseleave", () => {
              if (!tooltipRef.current) return;
              d3.select(tooltipRef.current)
                .style("display", "none")
                .style("opacity", 0);
            });
        });
      });

    const scaleY = height - 20; // below the chart
    const step = 10000; // people per tick
    const maxValue = d3.max(data.flatMap(d => [d.Imigranti, d.Emigranti]))!;
    const pixelsPerPerson = (iconW + gap) / PEOPLE_UNIT;
    const axisHalf = (maxValue * pixelsPerPerson) + 5;
    const centerGap = 30;

    root
      .append("line")
      .attr("x1", centerX - axisHalf - 20)
      .attr("x2", centerX + axisHalf + 20)
      .attr("y1", scaleY)
      .attr("y2", scaleY)
      .attr("stroke", "#ddd")
      .attr("stroke-width", 0.5);


    for (let i = 1; i <= 3; i++) {
      const tickX = centerX + i * step * pixelsPerPerson + centerGap; // right
      const tickXLeft = centerX - i * step * pixelsPerPerson - centerGap; // left

      // Right tick
      root
        .append("line")
        .attr("x1", tickX)
        .attr("x2", tickX)
        .attr("y1", scaleY - 5)
        .attr("y2", scaleY + 5)
        .attr("stroke", "#ddd")
        .attr("stroke-width", 0.5);

      // Left tick
      root
        .append("line")
        .attr("x1", tickXLeft)
        .attr("x2", tickXLeft)
        .attr("y1", scaleY - 5)
        .attr("y2", scaleY + 5)
        .attr("stroke", "#ddd")
        .attr("stroke-width", 0.5);


      root
        .append("text")
        .attr("x", tickX)
        .attr("y", scaleY + 15)
        .attr("text-anchor", "middle")
        .attr("fill", "#ddd")
        .attr("font-size", 10)
        .text(i * step);

      root
        .append("text")
        .attr("x", tickXLeft)
        .attr("y", scaleY + 15)
        .attr("text-anchor", "middle")
        .attr("fill", "#ddd")
        .attr("font-size", 10)
        .text(i * step);
    }

    const labelY = margin.top + 2; // from top
    const labelOffsetX = 30; // from center

    root
      .append("text")
      .attr("x", centerX - labelOffsetX) // left
      .attr("y", labelY)
      .attr("text-anchor", "end")
      .attr("fill", "#6a0dad") // purple for Emigranti
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Iseljenici");

    root
      .append("text")
      .attr("x", centerX + labelOffsetX) // right
      .attr("y", labelY)
      .attr("text-anchor", "start")
      .attr("fill", "#00a651") // green for Imigranti
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Useljenici");
  }

  useEffect(() => {
    if (!ref.current) return;

    const svgNode = ref.current;

    const parent = svgNode.parentElement;
    if (!parent) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          drawChart(svgNode, parent);
        }
      },
      { root: null, threshold: 0.5 }
    );

    observer.observe(parent);
    return () => observer.disconnect();

  }, [size]);


  useEffect(() => {
    if (!size || !ref.current) return;
    if (!hasAnimated.current) return;

    const svgNode = ref.current;
    const parent = svgNode.parentElement;
    if (!parent) return;

    drawChart(svgNode, parent);
  }, [size?.width]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={tooltipRef} className="tooltip" style={{ position: "absolute" }} />
      <svg ref={ref} style={{ paddingTop: "30px", width: "100%", height: "auto", overflow: "visible" }} />
    </div>
  );
}
