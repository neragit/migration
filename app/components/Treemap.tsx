"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface TreemapData {
  zanimanje: string;
  broj: number;
  placa: number;
  godina: number;
}

const Treemap: React.FC = () => {
  const [data, setData] = useState<TreemapData[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2021);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
    opacity: number;
  } | null>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [rects, setRects] = useState<
    { x0: number; x1: number; y0: number; y1: number; data: TreemapData }[]
  >([]);

  const workersPerIcon = 650;
  const iconSize = 20;
  const padding = 2;

  // Load CSV internally
  useEffect(() => {
    d3.csv("/data/poslovi.csv").then((raw) => {
      setData(
        raw.map((d: any) => ({
          zanimanje: d.zanimanje,
          broj: +d.broj,
          placa: +d.placa.replace(/\./g, "").replace(",", "."),
          godina: +d.godina,
        }))
      );
    });
  }, []);


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
    if (data.length && !years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }
  }, [data, years]);


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
    const fd = data.filter(d => d.godina === selectedYear);
    return fd;
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

  const iconPositionsRef = useRef<Map<string, { jx: number; jy: number }[]>>(new Map());

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);


    const ensurePersonIcon = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
      let defs = svg.select<SVGDefsElement>("defs");
      if (defs.empty()) defs = svg.append("defs");

      if (!defs.select("#treemap-icon").node()) {
        const symbol = defs.append("symbol")
          .attr("id", "treemap-icon")
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
          .attr("color", "currentColor");

        // Head
        symbol.append("circle")
          .attr("cx", 48.927)
          .attr("cy", 25.12)
          .attr("r", 23.941)
          .attr("stroke", "white")
          .attr("stroke-width", 2.36)
          .attr("color", "currentColor");
      }
    };


    ensurePersonIcon(svg);

    // Clear positions only for occupations not in current filtered data
    const currentOccupations = new Set(filteredData.map(d => `${d.zanimanje}`));
    const keysToDelete: string[] = [];
    iconPositionsRef.current.forEach((_, key) => {
      if (!currentOccupations.has(key)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => iconPositionsRef.current.delete(key));


    if (!filteredData.length || !dimensions.width) return;

    const { width, height } = dimensions;

    const root = d3
      .hierarchy({ children: filteredData } as any)
      .sum(d => d.broj)
      .sort((a, b) => b.value! - a.value!);

    const treemapRoot = d3.treemap<TreemapData>()
      .size([width, height])
      .padding(1)(root) as d3.HierarchyRectangularNode<TreemapData>;

    const leaves = treemapRoot.leaves().map(d => ({
      x0: d.x0,
      x1: d.x1,
      y0: d.y0,
      y1: d.y1,
      data: d.data,
    }));

    setRects(leaves);

    const placaAll = d3.extent(data, d => d.placa) as [number, number];
    const color = d3.scaleSequential()
      .interpolator(d3.interpolateHcl("#9fd9ff", "#000"))
      .domain(placaAll);

    const nodes = svg.selectAll<SVGGElement, typeof leaves[0]>('g.node')
      .data(leaves, d => d.data.zanimanje);

    const isInitialRender = svg.selectAll<SVGGElement, typeof leaves[0]>('g.node').empty();

    // ENTER
    const nodesEnter = nodes.enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x0},${d.y0})`)
      .style('opacity', 1)
      .style('overflow', 'visible');

    nodesEnter.append('rect').attr('fill', 'none');
    nodesEnter.append('g').attr('class', 'icons');

    nodesEnter.transition().duration(400).style('opacity', 1);
    nodes.transition().duration(1000).attr('transform', d => `translate(${d.x0},${d.y0})`);
    nodes.exit().transition().duration(400).style('opacity', 0).remove();

    // Icons

    nodesEnter.merge(nodes as any).each(function (d) {
      // Select the 'g' element with class 'icons' inside the current node
      const g = d3.select(this).select<SVGGElement>('g.icons');


      // Calculate the width of the current cell
      const cellWidth = d.x1 - d.x0;
      // Calculate the height of the current cell
      const cellHeight = d.y1 - d.y0;
      // Calculate how many icons can fit horizontally in the cell (at least 1)
      const cols = Math.max(1, Math.floor(cellWidth / (iconSize + padding)));
      // Calculate how many icons can fit vertically in the cell
      const rows = Math.floor(cellHeight / (iconSize + padding));
      // If either dimension cannot fit any icons, skip this cell
      if (cols <= 0 || rows <= 0) return;

      // Maximum number of icons that can fit in the cell
      const maxIcons = cols * rows;
      // Desired number of icons based on data and workersPerIcon ratio
      const desiredIcons = Math.round(d.data.broj / workersPerIcon);
      // Actual number of icons to display (cannot exceed maxIcons)
      const iconCount = Math.min(maxIcons, desiredIcons);

      // Bind the icon data to 'use' elements (one per icon)
      const icons = g.selectAll<SVGUseElement, number>('use')
        .data(d3.range(iconCount));

      const iconsEnter = icons.enter()
        .append('use')
        .attr('href', '#treemap-icon')
        .style('fill', color(d.data.placa))
        .style('opacity', 1);



      iconsEnter.merge(icons)
        .attr('transform', (i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;

          const cellKey = d.data.zanimanje;

          if (!iconPositionsRef.current.has(cellKey)) {
            iconPositionsRef.current.set(cellKey, []);
          }
          const positions = iconPositionsRef.current.get(cellKey)!;

          // Generate jitter only if this position doesn't exist yet
          if (!positions[i]) {
            positions[i] = {
              jx: (Math.random() - 0.5) * 20,
              jy: (Math.random() - 0.5) * 20
            };
          }

          const { jx, jy } = positions[i];

          return `translate(${col * (iconSize + padding) + jx}, ${row * (iconSize + padding) + jy}) scale(${iconSize / 200})`;
        });


      icons.transition() // Only existing icons, not iconsEnter
        .duration(600) // Smooth transition duration
        .style('fill', color(d.data.placa)); // Gradually update color

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


      setTooltip({
        x: event.clientX + 10,
        y: event.clientY + 10,
        content: (
          <div>
            <b>{hovered.data.zanimanje}</b>
            <br />
            Broj radnika: {new Intl.NumberFormat('fr-FR').format(hovered.data.broj)}
            <br />
            Bruto plaća: {hovered.data.placa.toFixed(2)} EUR
          </div>
        ),
        opacity: 0.9,
      });

    } else {
      setTooltip(null);
    }
  };

  const currentStats = statsPerYear[selectedYear] ?? { totalBroj: 0, avgPlaca: 0 };



  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", maxWidth: "800px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTooltip(null)}
    >

      <div style={{ display: "flex", gap: "20px", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "50px" }}>
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
          </span> EUR <b>prosječna bruto plaća</b>
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
          className="tooltip"
          style={{
            position: "fixed",
            left: Math.min(tooltip.x, window.innerWidth - 250),
            top: Math.min(tooltip.y, window.innerHeight - 150),
            opacity: tooltip.opacity,
            transition: "opacity 0.2s ease",
          }}
        >
          {tooltip.content}
        </div>
      )}

    </div>
  );
};

export default Treemap;
