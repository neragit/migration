// components/MetaPlot.tsx
"use client";

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import useResizeObserver from "../hooks/useResizeObs";


interface LangData {
  lang: string;
  residents: number;
  api_reach_min: number;
  api_reach_max: number;
  api_reach_avg: number;
  country: string;
}



interface Props {
  data: LangData[];
}

interface MetaManagerData {
  lang: string;
  adsAvg: number;
  adsMin: number;
  adsMax: number;
  region: string;
  subgroup: string;
  country: string;
}

const defaultData: MetaManagerData[] = [
  { lang: 'Bosanski', adsAvg: 67250, region: 'Europa', subgroup: 'Balkan', adsMin: 61800, adsMax: 72700, country: 'Bosna i Hercegovina' },
  { lang: 'Makedonski', adsAvg: 53750, region: 'Europa', subgroup: 'Balkan', adsMin: 49400, adsMax: 58100, country: 'Sjeverna Makedonija' },
  { lang: 'Srpski', adsAvg: 41350, region: 'Europa', subgroup: 'Balkan', adsMin: 38000, adsMax: 44700, country: 'Srbija, Kosovo, Bosna i Hercegovina' },
  { lang: 'Albanski', adsAvg: 11850, region: 'Europa', subgroup: 'Balkan', adsMin: 10900, adsMax: 12800, country: 'Albanija, Kosovo, Sjeverna Makedonija' },
  { lang: 'Hrvatski', adsAvg: 2600000, region: 'Europa', subgroup: 'Balkan', adsMin: 2400000, adsMax: 2800000, country: 'Hrvatska (i ostali)' },
  { lang: 'Slovenski', adsAvg: 35800, region: 'Europa', subgroup: 'Balkan', adsMin: 32900, adsMax: 38700, country: 'Slovenija' },
  { lang: 'Slovački', adsAvg: 4250, region: 'Europa', subgroup: 'Europa', adsMin: 3900, adsMax: 4600, country: 'Slovačka' },
  { lang: 'Češki', adsAvg: 82300, region: 'Europa', subgroup: 'Europa', adsMin: 75600, adsMax: 89000, country: 'Češka' },
  { lang: 'Mađarski', adsAvg: 3600, region: 'Europa', subgroup: 'Europa', adsMin: 3300, adsMax: 3900, country: 'Mađarska' },
  { lang: 'Rumunjski', adsAvg: 2150, region: 'Europa', subgroup: 'Europa', adsMin: 2000, adsMax: 2300, country: 'Rumunjska' },
  { lang: 'Latvijski', adsAvg: 6650, region: 'Europa', subgroup: 'Europa', adsMin: 6100, adsMax: 7200, country: 'Latvija' },
  { lang: 'Litvanski', adsAvg: 9700, region: 'Europa', subgroup: 'Europa', adsMin: 8900, adsMax: 10500, country: 'Litva' },
  { lang: 'Nizozemski', adsAvg: 3600, region: 'Europa', subgroup: 'Europa', adsMin: 3500, adsMax: 4200, country: 'Nizozemska' },
  { lang: 'Švedski', adsAvg: 4550, region: 'Europa', subgroup: 'Europa', adsMin: 4200, adsMax: 4900, country: 'Švedska' },
  { lang: 'Poljski', adsAvg: 6550, region: 'Europa', subgroup: 'Europa', adsMin: 6000, adsMax: 7100, country: 'Poljska' },
  { lang: 'Portugalski', adsAvg: 5900, region: 'Europa', subgroup: 'Europa', adsMin: 5400, adsMax: 6400, country: 'Portugal, Latiska Amerika' },
  { lang: 'Danski', adsAvg: 4850, region: 'Europa', subgroup: 'Europa', adsMin: 4500, adsMax: 5200, country: 'Danska' },
  { lang: 'Engleski', adsAvg: 2600000, region: 'Global', subgroup: 'English', adsMin: 2400000, adsMax: 2800000, country: 'Svjetski (službeni u Filipinima, Indiji, Pakistanu...)' },
  { lang: 'Njemački', adsAvg: 45250, region: 'Global', subgroup: 'Global', adsMin: 41600, adsMax: 48900, country: 'Njemačka, Austrija, Švicarska...' },
  { lang: 'Talijanski', adsAvg: 33850, region: 'Global', subgroup: 'Global', adsMin: 31100, adsMax: 36600, country: 'Italija' },
  { lang: 'Španjolski', adsAvg: 13950, region: 'Global', subgroup: 'Global', adsMin: 12800, adsMax: 15100, country: 'Španjolska, Latinska Amerika' },
  { lang: 'Francuski', adsAvg: 6750, region: 'Global', subgroup: 'Global', adsMin: 6200, adsMax: 7300, country: 'Francuska, Belgija, Kanada' },
  { lang: 'Kineski', adsAvg: 1700, region: 'Global', subgroup: 'Global', adsMin: 1600, adsMax: 1800, country: 'Kina' },
  { lang: 'Japanski', adsAvg: 1700, region: 'Global', subgroup: 'Global', adsMin: 1200, adsMax: 1400, country: 'Japan' },
  { lang: 'Ruski', adsAvg: 15300, region: 'Middle', subgroup: 'Euroazija', adsMin: 14100, adsMax: 16500, country: 'Ukrajina, Uzbekistan, Rusija' },
  { lang: 'Ukrajinski', adsAvg: 8350, region: 'Middle', subgroup: 'Euroazija', adsMin: 7700, adsMax: 9000, country: 'Ukrajina' },
  { lang: 'Turski', adsAvg: 4000, region: 'Middle', subgroup: 'Africa', adsMin: 3700, adsMax: 4300, country: 'Turska' },
  { lang: 'Arapski', adsAvg: 6650, region: 'Middle', subgroup: 'Africa', adsMin: 6100, adsMax: 7200, country: 'Egipat, Bliski istok, Sjeverna Afrika' },
  { lang: 'Uzbečki', adsAvg: 1750, region: 'Middle', subgroup: 'Euroazija', adsMin: 1600, adsMax: 1900, country: 'Uzbekistan' },
  { lang: 'Punjabi', adsAvg: 1950, region: 'Asia', subgroup: 'Indija', adsMin: 1800, adsMax: 2100, country: 'Pakistan' },
  { lang: 'Hindski', adsAvg: 5450, region: 'Asia', subgroup: 'Indija', adsMin: 5000, adsMax: 5900, country: 'Indija' },
  { lang: 'Bengalski', adsAvg: 3400, region: 'Asia', subgroup: 'Indija', adsMin: 3100, adsMax: 3700, country: 'Bangladeš, Indija' },
  { lang: 'Nepalski', adsAvg: 19700, region: 'Asia', subgroup: 'Indija', adsMin: 18100, adsMax: 21300, country: 'Nepal' },
  { lang: 'Filipinski', adsAvg: 14000, region: 'Asia', subgroup: 'Filipini', adsMin: 12900, adsMax: 15100, country: 'Filipini' },
  { lang: 'Cebuano', adsAvg: 1200, region: 'Asia', subgroup: 'Filipini', adsMin: 1100, adsMax: 1300, country: 'Filipini' }
];


const MetaPlot: React.FC<Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const size = useResizeObserver(containerRef);

  const scatterRef = useRef<SVGSVGElement | null>(null);
  const barsRef = useRef<SVGSVGElement | null>(null);


  // Guard against undefined data
  if (!data || data.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No data available</div>;
  }

  // Filter data: exclude outliers (api_reach_avg <= 0)
  const filteredData = data.filter(d => d.api_reach_avg > 0);

  // Merge MetaManager data with LangData
  const mmMap = new Map(defaultData.map(d => [d.lang, d]));
  const barsData = filteredData.map(d => {
    const mm = mmMap.get(d.lang);
    return {
      lang: d.lang,
      residents: d.residents,
      api_reach_avg: d.api_reach_avg,
      api_reach_min: d.api_reach_min,
      api_reach_max: d.api_reach_max,
      adsAvg: mm?.adsAvg ?? 0,
      adsMin: mm?.adsMin ?? 0,
      adsMax: mm?.adsMax ?? 0,
      country: d.country || mm?.country || 'N/A'
    };
  });



  // Determine responsive dimensions
  const chartWidth = size?.width ? (size.width - 60) / 2 : 400;
  const chartHeight = chartWidth; // square charts

  // Scatter plot
  useEffect(() => {
    if (!scatterRef.current) return;

    const svg = d3.select(scatterRef.current);
    svg.selectAll('*').remove();

    const width = 400;
    const height = 400;
    const padding = { top: 30, right: 30, bottom: 30, left: 60 };

    const xMax = d3.max(filteredData, d => d.residents) ?? 0;
    const yMax = d3.max(filteredData, d => d.api_reach_avg) ?? 0;
    const maxDomain = Math.max(xMax, yMax) * 1.1;

    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;


    const xScale = d3.scaleLinear()
      .domain([0, maxDomain])
      .range([padding.left, padding.left + plotWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, maxDomain])
      .range([padding.top + plotHeight, padding.top]);

    const ticksCount = 4;

    // X-axis
    svg.append('g')
      .attr('transform', `translate(0,${height - padding.bottom})`)
      .call(d3.axisBottom(xScale).tickSize(0).ticks(ticksCount).tickFormat(d => d.toLocaleString('fr-FR')))
      .attr("font-family", "Mukta, sans-serif")
      .select('.domain')
      .attr('stroke', '#eee');



    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('MUP');



    // Y-axis  
    svg.append('g')
      .attr('transform', `translate(${padding.left},0)`)
      .call(d3.axisLeft(yScale).tickSize(0).ticks(ticksCount).tickFormat(d => d === 0 ? '' : d.toLocaleString('fr-FR')))
      .attr("font-family", "Mukta, sans-serif")
      .select('.domain')
      .attr('stroke', '#eee');

    svg.append('text')
      .attr('x', -height / 2)
      .attr('y', 0)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('transform', 'rotate(-90)')
      .text('Meta procjena');

    const tooltip = d3.select('body')
      .selectAll('.tooltip-correlation')
      .data([null])
      .join('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('opacity', 0);

    svg.selectAll('circle')
      .data(filteredData)
      .join('circle')
      .attr('cx', d => xScale(d.residents))
      .attr('cy', d => yScale(d.api_reach_avg))
      .attr('r', 5)
      .attr('fill', '#1f77b4')
      .attr('opacity', 0.8)
      .on('mouseover', (event, d) => {
        const rangeData = barsData.find(rd => rd.lang === d.lang);
        tooltip.html(`
          <b>${d.lang}</b><br/>
          <b><span style="color:#ff7f0e;">MUP:</span></b> ${d.residents.toLocaleString('fr-FR')}<br/>
          <b><span style="color:#1976D2;">Meta API:</span></b>  ${d.api_reach_avg.toLocaleString('fr-FR')}<br/>
          <b>Moguće podrijetlo:</b> ${rangeData?.country || 'N/A'}
        `)
          .style('opacity', 1)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });



    const xMean = d3.mean(filteredData, d => d.residents)!;
    const yMean = d3.mean(filteredData, d => d.api_reach_avg)!;
    const numerator = d3.sum(filteredData, d => (d.residents - xMean) * (d.api_reach_avg - yMean));
    const denominator = d3.sum(filteredData, d => Math.pow(d.residents - xMean, 2));
    const slope = numerator / denominator;
    const intercept = yMean - slope * xMean;

    const xMin = d3.min(filteredData, d => d.residents)!;
    const xMaxVal = d3.max(filteredData, d => d.residents)!;
    const regressionLine = [
      { residents: xMin, api_reach_avg: slope * xMin + intercept },
      { residents: xMaxVal, api_reach_avg: slope * xMaxVal + intercept }
    ];

    const line = d3.line<{ residents: number; api_reach_avg: number }>()
      .x(d => xScale(d.residents))
      .y(d => yScale(d.api_reach_avg));

    svg.append('path')
      .datum(regressionLine)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#ff6b6b')
      .attr('stroke-width', 2);

    svg.selectAll('line.residual')
      .data(filteredData)
      .join('line')
      .attr('class', 'residual')
      .attr('x1', d => xScale(d.residents))
      .attr('y1', d => yScale(d.api_reach_avg))
      .attr('x2', d => xScale(d.residents))
      .attr('y2', d => yScale(slope * d.residents + intercept))
      .attr('stroke', '#ffa500')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4 2')
      .attr('opacity', 0.6);


    const r = numerator / Math.sqrt(
      d3.sum(filteredData, d => Math.pow(d.residents - xMean, 2)) *
      d3.sum(filteredData, d => Math.pow(d.api_reach_avg - yMean, 2))
    );

    svg.append('text')
      .attr('x', width - padding.right - 5)
      .attr('y', padding.top + 12)
      .attr('text-anchor', 'end')
      .attr('fill', '#ff6b6b')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(`r = ${r.toFixed(2)}`);

    // circle labels on top
    svg.selectAll('text.label')
      .data(filteredData)
      .join('text')
      .attr('class', 'label')
      .attr('font-size', '10px')
      .attr('x', d => xScale(d.residents) + 10)
      .attr('y', d => yScale(d.api_reach_avg) + 2)
      .attr('pointer-events', 'none')
      .text(d => d.lang);

  }, [data]);

  useEffect(() => {
  if (!barsRef.current) return;

  const svg = d3.select(barsRef.current);
  svg.selectAll('*').remove();

  const width = 400;
  const height = 400;
  const padding = { top: 20, right: 30, bottom: 30, left: 60 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Y scale for languages (vertical bands)
  const yScale = d3.scaleBand()
    .domain(barsData.map(d => d.lang))
    .range([padding.top, padding.top + plotHeight])
    .padding(0.3);

  // X scale for values (horizontal)
  const xMax = Math.max(
    d3.max(barsData, d => d.residents) ?? 0,
    d3.max(barsData, d => d.api_reach_avg ?? 0) ?? 0,
    d3.max(barsData, d => d.adsAvg ?? 0) ?? 0
  ) * 1.1;

  const xScale = d3.scaleLinear()
    .domain([0, xMax])
    .range([padding.left, padding.left + plotWidth]);

  const tooltip = d3.select('body')
    .selectAll('.tooltip-bar')
    .data([null])
    .join('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('opacity', 0);

  const showTooltip = (event: any, d: any) => {
    tooltip.html(`
      <b>${d.lang}</b><br/>
      <b><span style="color:#ff7f0e;">MUP:</span></b> ${d.residents.toLocaleString('fr-FR')}<br/>
      <b><span style="color:#1976D2;">Meta API:</span></b> ${d.api_reach_avg?.toLocaleString('fr-FR')} (${d.api_reach_min?.toLocaleString('fr-FR')} - ${d.api_reach_max?.toLocaleString('fr-FR')})<br/>
      <b><span style="color:#63B3ED;">MetaManager:</span></b> ${d.adsAvg.toLocaleString('fr-FR')} (${d.adsMin.toLocaleString('fr-FR')} - ${d.adsMax.toLocaleString('fr-FR')})<br/>
      <b>Moguće podrijetlo:</b> ${d.country}
    `)
      .style('opacity', 1)
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY - 28 + 'px');
  };

  const moveTooltip = (event: any) => {
    tooltip
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY - 28 + 'px');
  };

  const hideTooltip = () => {
    tooltip.style('opacity', 0);
  };

  // --- Compute bar positions dynamically ---
  const spacing = 0.05; // gap between bars
  const mupHeightRatio = 0.3;
  const apiHeightRatio = 0.3;
  const mmHeightRatio = 1 - mupHeightRatio - apiHeightRatio - 2 * spacing;

  svg.selectAll('rect.residents')
    .data(barsData)
    .join('rect')
    .attr('class', 'residents')
    .attr('x', padding.left)
    .attr('y', d => (yScale(d.lang) ?? 0) + spacing * yScale.bandwidth())
    .attr('width', d => xScale(d.residents) - padding.left)
    .attr('height', d => mupHeightRatio * yScale.bandwidth())
    .attr('fill', '#ff7f0e')
    .attr('opacity', 0.8)
    .on('mouseover', showTooltip)
    .on('mousemove', moveTooltip)
    .on('mouseout', hideTooltip);

  svg.selectAll('rect.apireach')
    .data(barsData.filter(d => d.api_reach_avg !== null))
    .join('rect')
    .attr('class', 'apireach')
    .attr('x', padding.left)
    .attr('y', d => {
      const band = yScale.bandwidth();
      return (yScale(d.lang) ?? 0) + spacing * band + mupHeightRatio * band + spacing * band;
    })
    .attr('width', d => xScale(d.api_reach_avg!) - padding.left)
    .attr('height', d => apiHeightRatio * yScale.bandwidth())
    .attr('fill', '#1976D2')
    .attr('opacity', 0.8)
    .on('mouseover', showTooltip)
    .on('mousemove', moveTooltip)
    .on('mouseout', hideTooltip);

  svg.selectAll('rect.metamanager')
    .data(barsData.filter(d => d.adsAvg > 0))
    .join('rect')
    .attr('class', 'metamanager')
    .attr('x', padding.left)
    .attr('y', d => {
      const band = yScale.bandwidth();
      return (yScale(d.lang) ?? 0) + spacing * band + mupHeightRatio * band + spacing * band + apiHeightRatio * band + spacing * band;
    })
    .attr('width', d => xScale(d.adsAvg) - padding.left)
    .attr('height', d => mmHeightRatio * yScale.bandwidth())
    .attr('fill', '#63B3ED')
    .attr('opacity', 0.8)
    .on('mouseover', showTooltip)
    .on('mousemove', moveTooltip)
    .on('mouseout', hideTooltip);

  // --- Whiskers ---
  svg.selectAll('line.whisker')
    .data(barsData.filter(d => d.api_reach_min && d.api_reach_max))
    .join('line')
    .attr('class', 'whisker')
    .attr('x1', d => xScale(d.api_reach_min!))
    .attr('x2', d => xScale(d.api_reach_max!))
    .attr('y1', d => (yScale(d.lang) ?? 0) + spacing * yScale.bandwidth() + mupHeightRatio * yScale.bandwidth() + spacing * yScale.bandwidth() + apiHeightRatio * yScale.bandwidth() / 2)
    .attr('y2', d => (yScale(d.lang) ?? 0) + spacing * yScale.bandwidth() + mupHeightRatio * yScale.bandwidth() + spacing * yScale.bandwidth() + apiHeightRatio * yScale.bandwidth() / 2)
    .attr('stroke', '#1976D2')
    .attr('stroke-width', 1.5)
    .attr('opacity', 0.8);

  svg.selectAll('line.whisker-metamanager')
    .data(barsData.filter(d => d.adsMin && d.adsMax))
    .join('line')
    .attr('class', 'whisker-metamanager')
    .attr('x1', d => xScale(d.adsMin))
    .attr('x2', d => xScale(d.adsMax))
    .attr('y1', d => {
      const band = yScale.bandwidth();
      return (yScale(d.lang) ?? 0) + spacing * band + mupHeightRatio * band + spacing * band + apiHeightRatio * band + spacing * band + mmHeightRatio * band / 2;
    })
    .attr('y2', d => {
      const band = yScale.bandwidth();
      return (yScale(d.lang) ?? 0) + spacing * band + mupHeightRatio * band + spacing * band + apiHeightRatio * band + spacing * band + mmHeightRatio * band / 2;
    })
    .attr('stroke', '#63B3ED')
    .attr('stroke-width', 1.5)
    .attr('opacity', 0.8);

  // --- Axes ---
  svg.append('g')
    .attr('transform', `translate(0,${padding.top + plotHeight})`)
    .call(d3.axisBottom(xScale).tickSize(0).ticks(4).tickFormat(d => d.toLocaleString('fr-FR')))
    .attr("font-family", "Mukta, sans-serif")
    .select('.domain')
    .attr('stroke', '#eee');

  svg.append('g')
    .attr('transform', `translate(${padding.left},0)`)
    .call(d3.axisLeft(yScale).tickSize(0))
    .attr("font-family", "Mukta, sans-serif")
    .select('.domain')
    .attr('stroke', '#eee');

}, [barsData]);


  return (
    <div className='mt-15'>

      <div ref={containerRef} style={{ display: 'flex', gap: '50px', flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap' }}>

        <div style={{ flex: '1 1 400px' }}>
          <h3 style={{ paddingTop: 0, paddingBottom: '10px', paddingRight: '10px', fontSize: '14px', fontWeight: 'bold' }}>
            Usporedba službenih podataka MUP-a s procjenom publike prema jeziku na temelju Meta Graph API (tamnoplavo) i Meta Ads Managera (svijetloplavo)
          </h3>
          <svg
            ref={barsRef}
            width={chartWidth}
            height={chartHeight}
            viewBox="0 0 400 400"
            style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
          />
        </div>

        <div style={{ flex: '1 1 400px' }}>
          <h3 style={{ paddingTop: 0, paddingBottom: '10px', paddingRight: '10px', fontSize: '14px', fontWeight: 'bold' }}>
            Korelacija službenih podataka MUP-a s procjenom publike prema jeziku na temelju Meta Graph API
          </h3>
          <svg
            ref={scatterRef}
            width={chartWidth}
            height={chartHeight}
            viewBox="0 0 400 400"
            style={{ display: 'block', maxWidth: '100%', height: 'auto', overflow: 'visible' }}
          />
        </div>
      </div>
    </div>
  );
};

export default MetaPlot;