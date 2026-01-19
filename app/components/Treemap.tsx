"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface TreemapData {
  zanimanje: string;
  broj: number;
  placa: number;
  godina: number;
}

interface TreemapProps {
  data: TreemapData[];
}

const Treemap: React.FC<TreemapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2021);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [rects, setRects] = useState<
    { x0: number; x1: number; y0: number; y1: number; data: TreemapData }[]
  >([]);



  const workersPerIcon = 650;
  const iconSize = 20;
  const padding = 2;




  // Responsive container observer
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        const height = Math.max(250, width * 0.5);
        setDimensions({ width, height });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const years = React.useMemo(() => Array.from(new Set(data.map(d => d.godina))).sort(), [data]);

  useEffect(() => {
    let lastScrollTime = 0;
    const cooldown = 50; // ms

    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const lockScroll = rect.bottom < window.innerHeight && rect.top > 0;
      if (!lockScroll) return;

      const now = Date.now();
      if (now - lastScrollTime < cooldown) return;

      const currentIndex = years.indexOf(selectedYear);

      if (e.deltaY > 0 && currentIndex < years.length - 1) {
        e.preventDefault();
        setSelectedYear(years[currentIndex + 1]);
        lastScrollTime = now;
      } else if (e.deltaY < 0 && currentIndex > 0) {
        e.preventDefault();
        setSelectedYear(years[currentIndex - 1]);
        lastScrollTime = now;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [selectedYear, years]);


  const filteredData = React.useMemo(() => {
    return data.filter(d => d.godina === selectedYear);
  }, [data, selectedYear]);

  const statsPerYear = React.useMemo(() => {

    const stats: Record<string, { totalBroj: number; avgPlaca: number }> = {};
    years.forEach(y => {
      const yearData = data.filter(d => d.godina === y);
      stats[y] = {
        totalBroj: d3.sum(yearData, d => d.broj),
        avgPlaca: d3.mean(yearData, d => d.placa) || 0,
      };
    });
    return stats;
  }, [data, years]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Ensure <defs> exists
    let defs = svg.select<SVGDefsElement>("defs");
    if (defs.empty()) {
      defs = svg.append("defs");
    }

    // --- inside your useEffect for symbol creation ---
if (!defs.select("#person-icon").node()) {
  const symbol = defs.append("symbol")
    .attr("id", "person-icon")
    .attr("viewBox", "0 0 98 284")
    .attr("overflow", "visible");

  // Body
  symbol.append("path")
    .attr(
      "d",
      "M17.877,187.566c-9.675,-3.049 -16.698,-12.099 -16.698,-22.775l0,-79.586c0,-13.176 10.697,-23.874 23.874,-23.874l47.748,0c13.176,0 23.874,10.697 23.874,23.874l0,79.586c0,10.19 -6.398,18.898 -15.394,22.321l0,79.215c0,8.748 -7.102,15.851 -15.851,15.851l-31.702,0c-8.748,0 -15.851,-7.102 -15.851,-15.851l0,-78.762Z"
    )
    .attr("stroke", "white")
    .attr("stroke-width", 2.36)
    .attr("color", "currentColor"); // <-- currentColor ensures <use> controls fill

  // Head
  symbol.append("circle")
    .attr("cx", 48.927)
    .attr("cy", 25.12)
    .attr("r", 23.941)
    .attr("stroke", "white")
    .attr("stroke-width", 2.36)
    .attr("color", "currentColor");
}

  }, []);




  useEffect(() => {
    if (!filteredData.length || !dimensions.width) return;

    const { width, height } = dimensions;

    // Build hierarchy
    const root = d3
      .hierarchy({ children: filteredData } as any)
      .sum(d => d.broj)
      .sort((a, b) => b.value! - a.value!);

    d3.treemap<TreemapData>().size([width, height]).padding(1)(root);

    const leaves = root.leaves().map(d => ({
      x0: d.x0,
      x1: d.x1,
      y0: d.y0,
      y1: d.y1,
      data: d.data,
    }));

    setRects(leaves);

    const svg = d3.select(svgRef.current);


    const placaAll = d3.extent(data, d => d.placa) as [number, number]; // all years

    const color = d3.scaleSequential()
      .interpolator(d3.interpolateHcl("#9fd9ff", "#000"))
      .domain(placaAll);


    // Compute min and max salaries
    const minPlaca = placaAll[0];
    const maxPlaca = placaAll[1];

    // Log min/max for debugging
    console.log("Min salary:", minPlaca, "Max salary:", maxPlaca);





    // -------------------------
    // NODES
    // -------------------------
    const nodes = svg.selectAll<SVGGElement, typeof leaves[0]>('g.node')
      .data(leaves, d => d.data.zanimanje);

    // ENTER
    const nodesEnter = nodes.enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x0},${d.y0})`)
      .style('opacity', 0)
      .style('overflow', 'visible');

    nodesEnter.append('rect').attr('fill', 'none');
    nodesEnter.append('g').attr('class', 'icons');

    // ENTER fade in
    nodesEnter.transition().duration(400).style('opacity', 1);

    // UPDATE
    nodes.transition().duration(1000)
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // EXIT
    nodes.exit().transition().duration(400).style('opacity', 0).remove();

    // MERGE ENTER + UPDATE for icons
    nodesEnter.merge(nodes as any).each(function (d) {
      const g = d3.select(this).select<SVGGElement>('g.icons');

      const cellWidth = d.x1 - d.x0;
      const cellHeight = d.y1 - d.y0;

      const cols = Math.max(1, Math.floor(cellWidth / (iconSize + padding)));
      const rows = Math.floor(cellHeight / (iconSize + padding));
      if (cols <= 0 || rows <= 0) return;

      const maxIcons = cols * rows;
      const desiredIcons = Math.round(d.data.broj / workersPerIcon);
      const iconCount = Math.min(maxIcons, desiredIcons);

      const icons = g.selectAll<SVGUseElement, number>('use')
        .data(d3.range(iconCount));

      // ENTER icons
      const iconsEnter = icons.enter()
        .append('use')
        .attr('href', '#person-icon')
        .style('fill', color(d.data.placa)) 



      // ENTER + UPDATE positions
      iconsEnter.merge(icons)
      .style('fill', color(d.data.placa)) 
        .attr('transform', (i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          const jx = (Math.random() - 0.5) * 20;
          const jy = (Math.random() - 0.5) * 20;
          return `translate(${col * (iconSize + padding) + jx}, ${row * (iconSize + padding) + jy}) scale(${iconSize / 200})`;

        })


      // Fade in ENTER only
      iconsEnter.transition().duration(600).style('opacity', 0.9);

      // EXIT icons
      icons.exit().transition().duration(600).style('opacity', 0).remove();


    });

  }, [filteredData, dimensions]);


  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;

    const hovered = rects.find(r => mx >= r.x0 && mx <= r.x1 && my >= r.y0 && my <= r.y1);

    if (hovered) {
      const formattedBroj = new Intl.NumberFormat('fr-FR').format(hovered.data.broj);

      setTooltip({
        x: event.clientX + 10,
        y: event.clientY + 10,
        content: `${hovered.data.zanimanje}\nBroj radnika: ${formattedBroj}\nBruto plaća: ${hovered.data.placa.toFixed(2)} EUR`,
      });

    } else {
      setTooltip(null);
    }
  };

  const currentStats = statsPerYear[selectedYear];

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", maxWidth: "800px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTooltip(null)}
    >
      {/* Year buttons and stats */}
      <div style={{ display: "flex", gap: "20px", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "30px" }}>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {years.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              style={{
                padding: "5px 10px",
                backgroundColor: selectedYear === y ? "#4292c6" : "#eee",
                color: selectedYear === y ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {y}
            </button>
          ))}
        </div>

        <div style={{ fontSize: "1.5rem", color: "#333" }}>
          <span style={{ animation: "fadeMoveIn 1s forwards" }}>
            {currentStats.avgPlaca.toFixed(0)}
          </span> EUR<b> prosječna bruto plaća</b>
        </div>





      </div>




      <svg
        ref={svgRef}
        width="100%"
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        style={{ display: "block", overflow: "visible" }}
      />

      {tooltip && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y,
            left: tooltip.x,
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: "4px",
            pointerEvents: "none",
            whiteSpace: "pre-line",
            fontSize: "12px",
            zIndex: 9999,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default Treemap;
