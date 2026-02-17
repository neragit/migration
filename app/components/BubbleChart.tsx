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

  { lang: 'Hindi', avg: 5450, region: 'Asia', subgroup: 'Indija', min: 5000, max: 5900, country: 'Indija' },
  { lang: 'Bengalski', avg: 3400, region: 'Asia', subgroup: 'Indija', min: 3100, max: 3700, country: 'Bangladeš, Indija' },
  { lang: 'Nepalski', avg: 19700, region: 'Asia', subgroup: 'Indija', min: 18100, max: 21300, country: 'Nepal' },
  { lang: 'Filipinski', avg: 14000, region: 'Asia', subgroup: 'Filipini', min: 12900, max: 15100, country: 'Filipini' },
  { lang: 'Cebuano', avg: 1200, region: 'Asia', subgroup: 'Filipini', min: 1100, max: 1300, country: 'Filipini' },
];



const clusterCenters: Record<string, { x: number; y: number }> = {
  'Balkan': { x: 250, y: 290 },
  'Global': { x: 480, y: 270 },
  'English': { x: 550, y: 170 },
  'Africa': { x: 550, y: 350 },
  'Euroazija': { x: 610, y: 340 },
  'Indija': { x: 650, y: 310 },
  'Filipini': { x: 700, y: 320 },
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
  'Hindi': '#66BB6A',
  'Bengalski': '#81C784',
  'Nepalski': '#009688',
  'Filipinski': '#1976D2',
  'Cebuano': '#ace5ee',
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


    const tooltip = d3.select(tooltipRef.current);


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


    // Force simulation with proper typing
    const simulation = d3.forceSimulation(nodes)
      .force('x', d3.forceX((d: DataItem) => clusterCenters[d.subgroup]?.x || width / 2).strength(0.3))
      .force('y', d3.forceY((d: DataItem) => clusterCenters[d.subgroup]?.y || height / 2).strength(0.3))
      .force('collide', d3.forceCollide((d: DataItem) => d.r! + 2))
      .force('charge', d3.forceManyBody().strength(((d: DataItem) => -Math.pow(d.r!, 1.2) * 0.2) as any))
      .stop();

    for (let i = 0; i < 300; i++) simulation.tick();

    svg.attr('cursor', 'grab');

    const bubbleGroup = svg.append('g')
      .attr('cursor', 'default');

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
        const container = svgRef.current?.parentElement;
        if (!container) return;

        const rect = container.getBoundingClientRect(); // container's position on screen
        const x = event.clientX - rect.left + 10; // 10px offset
        const y = event.clientY - rect.top + 10;

        tooltip
          .style('left', `${x}px`)
          .style('top', `${y}px`);
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


    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 5]) // minimalno 1 (početno), maksimalno 5
      .on('start', (event) => {
        tooltip.style('opacity', 0);

        if (event.sourceEvent?.type === 'wheel') {
          // scrolling: zoom in or out
          svg.attr('cursor', event.transform?.k >= 1 ? 'zoom-in' : 'zoom-out');
          bubbleGroup.attr('cursor', event.transform?.k >= 1 ? 'zoom-in' : 'zoom-out');
        } else if (event.sourceEvent?.type === 'mousedown' || event.sourceEvent?.type === 'touchstart') {
          // dragging: show grabbing hand
          svg.attr('cursor', 'grabbing');
          bubbleGroup.attr('cursor', 'grabbing');
        }

      })
      .on('zoom', (event) => {
        // Ograniči transformaciju da k ne padne ispod 1
        const transform = event.transform.k < 1
          ? d3.zoomIdentity // reset na početni zoom
          : event.transform;

        bubbleGroup.attr('transform', transform);
        bubbleGroup.attr('transform', event.transform);

        const legendOpacity = transform.k > 1 ? 0 : 1;

        svg.select<SVGGElement>(".legend")
          .transition()
          .duration(300)
          .ease(d3.easeCubic)
          .style("opacity", legendOpacity);

        if (event.sourceEvent?.type === 'wheel') {
          svg.attr('cursor', event.sourceEvent.deltaY < 0 ? 'zoom-in' : 'zoom-out');
          bubbleGroup.attr('cursor', event.sourceEvent.deltaY < 0 ? 'zoom-in' : 'zoom-out');
        }

      })



      .on('end', () => {
        bubbleGroup.attr('cursor', 'default');
        svg.attr('cursor', 'grab'); // reset after drag
        tooltip.style('opacity', 0.9);
      });


    // Only attach zoom on non-mobile devices
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      svg.call(zoom as any); // TypeScript workaround
    }



    const groupLegend = [
      { label: 'Balkan', color: '#C2185B' },            // Red
      { label: 'Svjetski drugi europski', color: '#BA68C8' },     // Pink/Purple
      { label: 'Turska i Afrika', color: '#6D4C41' },    // Brown
      { label: 'Post-sovjetski', color: '#F9A825' }, // Yellow
      { label: 'Indoarijski', color: '#2E7D32' },               // Green
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
    legend.attr("transform", `translate(20, 20)`);


  }, []);



  return (
    <>
      <div style={{ position: "relative" }}>
        <svg
          ref={svgRef}
          width="100%"
          height="500"
          viewBox="0 0 900 500" // width x height of your design
          preserveAspectRatio="xMidYMid meet"
        />
        <div
          ref={tooltipRef}
          className="tooltip"
          style={{
            position: "absolute",
            top: 0,
            left: 0,

          }}
        ></div>

      </div>

    </>
  );
};

export default BubbleChart;
