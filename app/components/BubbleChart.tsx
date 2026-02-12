import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

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
}

const data: DataItem[] = [
  { lang: 'Bosanski', avg: 67250, region: 'Europe', subgroup: 'Balkans', min: 61800, max: 72700, country: 'Bosna i Hercegovina' },
  { lang: 'Makedonski', avg: 53750, region: 'Europe', subgroup: 'Balkans', min: 49400, max: 58100, country: 'Sjeverna Makedonija' },
  { lang: 'Srpski', avg: 41350, region: 'Europe', subgroup: 'Balkans', min: 38000, max: 44700, country: 'Srbija, Kosovo, Bosna i Hercegovina' },
  { lang: 'Albanski', avg: 11850, region: 'Europe', subgroup: 'Balkans', min: 10900, max: 12800, country: 'Albanija, Kosovo, Sjeverna Makedonija' },
  { lang: 'Hrvatski', avg: 2600000, region: 'Europe', subgroup: 'Balkans', min: 2400000, max: 2800000, country: 'Croatia (native & expat)' },
  { lang: 'Slovenski', avg: 35800, region: 'Europe', subgroup: 'Balkans', min: 32900, max: 38700, country: 'Slovenija' },

  { lang: 'Engleski', avg: 2600000, region: 'Global', subgroup: 'English', min: 2400000, max: 2800000, country: 'Global / Philippines, India, Pakistan, etc.' },
  { lang: 'Njemački', avg: 45250, region: 'Global', subgroup: 'Expat', min: 41600, max: 48900, country: 'Germany, Austria, Switzerland' },
  { lang: 'Talijanski', avg: 33850, region: 'Global', subgroup: 'Expat', min: 31100, max: 36600, country: 'Italy' },
  { lang: 'Španjolski', avg: 13950, region: 'Global', subgroup: 'Expat', min: 12800, max: 15100, country: 'Spain, Latin America' },
  { lang: 'Francuski', avg: 6750, region: 'Global', subgroup: 'Expat', min: 6200, max: 7300, country: 'France, Belgium' },

  { lang: 'Ruski', avg: 15050, region: 'Middle', subgroup: 'Euroasia', min: 13800, max: 16300, country: 'Ukrajina, Uzbekistan, Russia' },
  { lang: 'Ukrajinski', avg: 8350, region: 'Middle', subgroup: 'Euroasia', min: 7700, max: 9000, country: 'Ukrajina' },
  { lang: 'Turski', avg: 4000, region: 'Middle', subgroup: 'Africa', min: 3700, max: 4300, country: 'Turska' },
  { lang: 'Arapski', avg: 6650, region: 'Middle', subgroup: 'Africa', min: 6100, max: 7200, country: 'Egipat, Middle East / North Africa' },
  { lang: 'Uzbečki', avg: 1750, region: 'Middle', subgroup: 'Euroasia', min: 1600, max: 1900, country: 'Uzbekistan' },

  { lang: 'Punjabi', avg: 1950, region: 'Asia', subgroup: 'India', min: 1800, max: 2100, country: 'Pakistan' },
  { lang: 'Telugu', avg: 900, region: 'Asia', subgroup: 'India', min: 0, max: 1000, country: 'Indija' },
  { lang: 'Marathi', avg: 900, region: 'Asia', subgroup: 'India', min: 0, max: 1000, country: 'Indija' },
  { lang: 'Tamil', avg: 900, region: 'Asia', subgroup: 'India', min: 0, max: 1000, country: 'Indija' },
  { lang: 'Hindi', avg: 5450, region: 'Asia', subgroup: 'India', min: 5000, max: 5900, country: 'Indija' },
  { lang: 'Bengalski', avg: 3400, region: 'Asia', subgroup: 'India', min: 3100, max: 3700, country: 'Bangladeš, Indija' },
  { lang: 'Nepalski', avg: 19700, region: 'Asia', subgroup: 'India', min: 18100, max: 21300, country: 'Nepal' },
  { lang: 'Filipinski', avg: 14000, region: 'Asia', subgroup: 'Philippines', min: 12900, max: 15100, country: 'Filipini' },
];



const clusterCenters: Record<string, { x: number; y: number }> = {
  'Balkans': { x: 250, y: 300 },
  'Expat': { x: 450, y: 250 },
  'English': { x: 500, y: 200 },
  'Africa': { x: 450, y: 300 },
  'Euroasia': { x: 550, y: 350 },
  'India': { x: 650, y: 300 },
  'Philippines': { x: 700, y: 300 },
};

const langColors: Record<string, string> = {
  'Bosanski': '#C2185B',
  'Makedonski': '#D81B60',
  'Srpski': '#E91E63',
  'Albanski': '#F06292',
  'Hrvatski': '#AD1457',
  'Slovenski': '#B71C1C',
  'Engleski': '#BA68C8',
  'Njemački': '#AB47BC',
  'Talijanski': '#9C27B0',
  'Španjolski': '#8E24AA',
  'Francuski': '#7B1FA2',
  'Ruski': '#F9A825',
  'Ukrajinski': '#FB8C00',
  'Turski': '#8B5E3C',
  'Uzbečki': '#FBC02D',
  'Arapski': '#6D4C41',
  'Telugu': '#2E7D32',
  'Marathi': '#388E3C',
  'Tamil': '#43A047',
  'Hindi': '#66BB6A',
  'Bengalski': '#81C784',
  'Nepalski': '#009688',
  'Filipinski': '#1976D2',
};


const BubbleChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 900;
    const height = 500;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    let tooltip = d3.select(tooltipRef.current);
    if (tooltip.empty()) {
      tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip');
    }

    const rScale = d3.scaleSqrt()
      .domain([d3.min(data, d => d.avg) ?? 0, d3.max(data, d => d.avg) ?? 1])
      .range([10, 140]);

    const subgroups = Array.from(new Set(data.map(d => d.subgroup)));

    const nodes: DataItem[] = data.map(d => ({
      ...d,
      r: rScale(d.avg),
      x: Math.random() * width,
      y: Math.random() * height,
      color: langColors[d.lang] || '#90A4AE',
    }));

    const simulation = d3.forceSimulation(nodes as any)
      .force('x', d3.forceX(d => clusterCenters[d.subgroup]?.x || width / 2).strength(0.3))
      .force('y', d3.forceY(d => clusterCenters[d.subgroup]?.y || height / 2).strength(0.3))
      .force('collide', d3.forceCollide(d => d.r! + 2))
      .force('charge', d3.forceManyBody().strength(d => -Math.pow(d.r!, 1.2) * 0.2))
      .stop();

    for (let i = 0; i < 300; i++) simulation.tick();

    const bubbleGroup = svg.append('g');

    bubbleGroup.selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => d.r!)
      .attr('cx', d => d.x!)
      .attr('cy', d => d.y!)
      .attr('fill', d => d.color!)
      .on('mouseover', (event, d) => {
        tooltip
          .html(`<strong>${d.lang}</strong><br/>
             Procjena između ${d.min} i ${d.max}<br/>
             Područje: ${d.country}`)
          .style('opacity', 1);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

    bubbleGroup.selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', d => d.x!)
      .attr('y', d => d.y! + 4)
      .text(d => d.lang)
      .attr('font-size', d => Math.min(12, d.r! / 3))
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .style('pointer-events', 'none')
      .style('font-weight', '600');


    const groupLegend = [
      { label: 'Balkan', color: '#C2185B' },            // Red
      { label: 'Globalni jezici', color: '#BA68C8' },     // Pink/Purple
      { label: 'Turska i Afrika', color: '#6D4C41' },    // Brown
      { label: 'Post-sovjetski', color: '#F9A825' }, // Yellow
      { label: 'Indija', color: '#2E7D32' },               // Green
      { label: 'Filipini', color: '#1976D2' }, // Blue
    ];

    // Legend
    let legend = svg.select<SVGGElement>(".legend");

    if (legend.empty()) {
      legend = svg.append("g").attr("class", "legend");

      groupLegend.forEach((group, i) => {
        const row = legend.append("g")
          .attr("transform", `translate(0, ${i * 25})`); // 25px spacing

        row.append("circle")
          .attr("r", 6)
          .attr("fill", group.color);

        row.append("text")
          .attr("x", 18)
          .attr("y", 4)
          .text(group.label)
          .attr("font-size", "13px")
          .attr("fill", "#555")
          .attr("font-family", "Mukta, sans-serif");
      });
    }

    // Position legend top-right inside SVG
    legend.attr("transform", `translate(${width - 150}, 30)`);


  }, []);



  return (
    <>
      <svg ref={svgRef} width={1000} height={500} />
      <div ref={tooltipRef} className="tooltip"></div>
    </>
  );
};

export default BubbleChart;
