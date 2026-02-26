"use client";

import React, { useRef, useEffect, useState } from 'react';
import useResizeObserver from "../hooks/useResizeObs";
import * as d3 from 'd3';
import { Plus, Minus } from "lucide-react";



interface DataItem {
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
  opacity?: number;
}

// Procjena publike prema jeziku na temelju pojedinačne pretrage putem Meta Ads Manager UI

const data: DataItem[] = [
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



const clusterCenters: Record<string, { x: number; y: number }> = {
  'Balkan': { x: 290, y: 200 },
  'Global': { x: 520, y: 210 },
  'English': { x: 610, y: 140 },
  'Africa': { x: 600, y: 280 },
  'Euroazija': { x: 650, y: 280 },
  'Indija': { x: 690, y: 250 },
  'Filipini': { x: 740, y: 260 },
};

const langColors: Record<string, string> = {
  // Balkan
  'Bosanski': '#C2185B',
  'Makedonski': '#D81B60',
  'Srpski': '#E91E63',
  'Albanski': '#F06292',
  'Hrvatski': '#AD1457',
  'Slovenski': '#B71C1C',

  // Europa – dodajemo nijanse fuksije/ljubičaste za preostale
  'Slovački': '#BA458C',    // nijansa fuksije, ne kričava
  'Češki': '#C15FA3',       // svjetlija magenta
  'Mađarski': '#9C4D82',    // tamnija ljubičasta
  'Rumunjski': '#AC6CA1',   // svijetla lila
  'Latvijski': '#B075B2',   // pastelna ljubičasta
  'Litvanski': '#8F3B8F',   // tamna fuksija
  'Nizozemski': '#A54E9F',  // srednja magenta
  'Švedski': '#9A3F8C',     // nijansa ljubičaste
  'Poljski': '#B85FAE',     // svijetla fuksija
  'Portugalski': '#AD4B9A', // nježna magenta
  'Danski': '#873C80',       // tamnija nijansa

  // Global
  'Engleski': '#BA68C8',
  'Njemački': '#AB47BC',
  'Talijanski': '#9C27B0',
  'Španjolski': '#8E24AA',
  'Francuski': '#7B1FA2',
  'Kineski': '#8B5FAF',    // nova svijetla ljubičasta
  'Japanski': '#9C5BB0',   // nijansa magente

  // Middle / Euroazija / Africa
  'Ruski': '#F9A825',
  'Ukrajinski': '#FB8C00',
  'Turski': '#8B5E3C',
  'Uzbečki': '#FBC02D',
  'Arapski': '#6D4C41',

  // Asia / Indija / Filipini
  'Punjabi': '#608000',
  'Hindski': '#66BB6A',
  'Bengalski': '#81C784',
  'Nepalski': '#009688',
  'Filipinski': '#1976D2',
  'Cebuano': '#ace5ee',
};

interface BubbleChartProps {
  step: number;
}

const BubbleChart: React.FC<BubbleChartProps> = ({ step }) => {

  const [isInView, setIsInView] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const size = useResizeObserver(containerRef);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);


  const [bubbles, setBubbles] = useState<DataItem[]>(() =>
    data.map(d => ({ ...d, opacity: 1 }))
  );

  const zoomIn = () => {
    if (!svgRef.current || !zoomRef.current) return;

    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoomRef.current.scaleBy as any, 1.5);
  };

  const zoomOut = () => {
    if (!svgRef.current || !zoomRef.current) return;

    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoomRef.current.scaleBy as any, 0.75);
  };

  const circlesRef = useRef<d3.Selection<SVGCircleElement, DataItem, SVGGElement, unknown> | null>(null);



  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }


    const observer = new IntersectionObserver(
      ([entry]) => {

        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);


  useEffect(() => {
    if (!svgRef.current) return;

    const width = 900;
    const height = 500; // maintain 900x500 ratio

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // reset prije crtanja

    const tooltip = d3.select(tooltipRef.current);

    const rScale = d3.scaleSqrt()
      .domain([d3.min(data, d => d.avg) ?? 0, d3.max(data, d => d.avg) ?? 1])
      .range([10, 120]);

    const subgroups = Array.from(new Set(data.map(d => d.subgroup)));

    const nodes: DataItem[] = data.map(d => ({
      ...d,
      r: rScale(d.avg),
      x: Math.random() * width,
      y: Math.random() * height,
      color: langColors[d.lang] || '#90A4AE',
    }));


    // Force simulation with proper typing
    const simulation = d3.forceSimulation(nodes)
      .force('x', d3.forceX((d: DataItem) => clusterCenters[d.subgroup]?.x || width / 2).strength(0.3))
      .force('y', d3.forceY((d: DataItem) => clusterCenters[d.subgroup]?.y || height / 2).strength(0.3))
      .force('collide', d3.forceCollide((d: DataItem) => d.r! + 2))
      .force('charge', d3.forceManyBody().strength(((d: DataItem) => -Math.pow(d.r!, 1.2) * 0.2) as any))
      .stop();

    for (let i = 0; i < 300; i++) simulation.tick();

    //svg.attr('cursor', 'grab');

    const bubbleGroup = svg.append('g')
      .attr('cursor', 'default');



    const circleSelection = bubbleGroup
      .selectAll<SVGCircleElement, DataItem>('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 0)
      .attr('cx', d => d.x!)
      .attr('cy', d => d.y!)
      .attr('fill', d => d.color!)
      .style('opacity', 0)
      .on('mouseover', (event, d) => {
        tooltip
          .html(`<strong>${d.lang}</strong><br/>
         Procjena između ${d.min.toLocaleString("fr-FR")} i ${d.max.toLocaleString("fr-FR")}<br/>
         Područje: ${d.country}`)
          .style('opacity', 0.9);
      })
      .on('mousemove', (event) => {
        const tooltipEl = tooltipRef.current;
        if (!tooltipEl) return;

        const offset = 10;
        let x = event.clientX + offset;
        let y = event.clientY + offset;

        if (x + tooltipEl.offsetWidth > window.innerWidth)
          x = event.clientX - tooltipEl.offsetWidth - offset;

        if (y + tooltipEl.offsetHeight > window.innerHeight)
          y = event.clientY - tooltipEl.offsetHeight - offset;

        tooltip.style('left', `${x}px`).style('top', `${y}px`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

    circlesRef.current = circleSelection;

    if (isInView) {

      circleSelection
        .transition()
        .delay((_, i) => i * 30)
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attr("r", d => d.r!)
        .style("opacity", 1);
    }



    const textSelection = bubbleGroup
      .selectAll<SVGTextElement, DataItem>('text')
      .data(nodes)
      .join('text')
      .attr('x', d => d.x!)
      .attr('y', d => d.y! + 4)
      .text(d => d.lang)
      .attr('font-size', d => Math.min(12, d.r! / 3)) // final font size
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .style('opacity', 0)        // start invisible
      .style('pointer-events', 'none')
      .style('font-weight', '600');

    // Animate text in with staggered delay
    textSelection
      .transition()
      .delay(1000)    // stagger like circles
      .duration(1500)
      .style('opacity', 1);


    const isTouchDevice =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 2])
      .filter((event) => {
        // ❌ Disable ALL touch interactions completely
        if (event.type.startsWith("touch")) return false;

        // ❌ Disable wheel zoom too (optional, since you use buttons)
        if (event.type === "wheel") return false;

        // ❌ Disable drag entirely
        if (event.type === "mousedown") return false;

        return false;
      })
      .on("zoom", (event) => {
        bubbleGroup.attr("transform", event.transform.toString());
      });


    /*
  const zoom = d3.zoom<SVGSVGElement, unknown>()

    .scaleExtent([1, 2])
    .filter((event) => {

      return event.type === 'mousedown' || event.type === 'touchstart';
    })
    .on('zoom', (event) => {
      const { x, y, k } = event.transform;

      // Apply transform to bubble group
      bubbleGroup.attr('transform', `translate(${x},${y}) scale(${k})`);

   
      // Legend opacity fades out if zoomed in
      const legendOpacity = k > 1 ? 0 : 1;
      svg.select<SVGGElement>(".legend")
        .transition()
        .duration(300)
        .ease(d3.easeCubic)
        .style("opacity", legendOpacity);
        

      bubbleGroup.attr('cursor', 'grabbing');
      svg.attr('cursor', 'grabbing');
      tooltip
        .style('opacity', 0)
    })

    .on('end', () => {
      bubbleGroup.attr('cursor', 'default');
      svg.attr('cursor', 'grab'); // reset after drag
    });
    */


    /*
        const groupLegend = [
          { label: 'Balkan', color: '#C2185B' },
          { label: 'Svjetski drugi europski', color: '#BA68C8' },
          { label: 'Turska i Afrika', color: '#6D4C41' },
          { label: 'Post-sovjetski', color: '#F9A825' },
          { label: 'Indoarijski', color: '#2E7D32' },
          { label: 'Filipini', color: '#1976D2' },
        ];
    
        let legend = svg.select<SVGGElement>(".legend");
    
        if (legend.empty()) {
          legend = svg.append("g").attr("class", "legend");
    
          groupLegend.forEach((group, i) => {
            const row = legend.append("g")
              .attr("transform", `translate(0, ${i * 25})`);
    
            row.append("circle")
              .attr("r", 6)
              .attr("fill", group.color);
    
            row.append("text")
              .attr("x", 18)
              .attr("y", 4)
              .text(group.label)
              .attr("fill", "#555")
              .attr("font-size", "10px")
          });
        }
    
        legend.attr("transform", `translate(20, 20)`);
        */

    zoomRef.current = zoom;
    svg.call(zoom as any);

  }, [isInView]);

  useEffect(() => {
    const mup = ['Bosanski', 'Nepalski', 'Srpski', 'Filipinski', 'Cebuano', 'Hindski', 'Makedonski', 'Albanski', 'Uzbečki', 'Arapski', 'Bengalski'];
    setBubbles(prev =>
      prev.map(b => {
        if (step === 1) {
          // STEP 1: show only mup
          return { ...b, opacity: mup.includes(b.lang) ? 1 : 0.1 };
        }
        if (step === 2) {
          // STEP 2: show if NOT mup
          return { ...b, opacity: !mup.includes(b.lang) ? 1 : 0.1 };
        }
        // STEP 3 & 4: default
        return { ...b, opacity: 1 };
      })
    );



  }, [step]);


  useEffect(() => {
    if (!circlesRef.current) return;

    circlesRef.current
      .data(bubbles)
      .transition()
      .duration(300)
      .style('opacity', d => d.opacity ?? 1);
      
  }, [bubbles]);


  const zoomButtonStyle: React.CSSProperties = {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(30,30,30,0.3)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };


  return (
    <>
      <div ref={containerRef} style={{ position: "relative" }}>
        <svg
          ref={svgRef}
          width="100%"
          viewBox="0 0 900 500"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: "visible" }}
        />
        <div
          ref={tooltipRef}
          className="tooltip"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "20px",
            zIndex: 10,
          }}
        >
          <button
            onClick={zoomIn}
            style={zoomButtonStyle}
          >
            <Plus size={28} />
          </button>

          <button
            onClick={zoomOut}
            style={zoomButtonStyle}
          >
            <Minus size={28} />
          </button>
        </div>
      </div>

    </>
  );
};

export default BubbleChart;
