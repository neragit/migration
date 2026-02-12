// components/CorrelationPlot.tsx
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface LangData {
  lang: string;
  fbReach: number;
  residents: number;
}

interface Props {
  data: LangData[];
}

const additionalData = [
  { lang: 'Bosnian', min: 61800, max: 72700, country: 'Bosna i Hercegovina' },
  { lang: 'Macedonian', min: 49400, max: 58100, country: 'Sjeverna Makedonija' },
  { lang: 'Serbian', min: 38000, max: 44700, country: 'Srbija, Kosovo, Bosna i Hercegovina' },
  { lang: 'Nepali', min: 18100, max: 21300, country: 'Nepal' },
  { lang: 'Russian', min: 13800, max: 16300, country: 'Ukrajina, Uzbekistan, Russia' },
  { lang: 'Filipino', min: 12900, max: 15100, country: 'Filipini' },
  { lang: 'Albanian', min: 10900, max: 12800, country: 'Albanija, Kosovo, Sjeverna Makedonija' },
  { lang: 'Ukranian', min: 7700, max: 9000, country: 'Ukrajina' },
  { lang: 'Arabic', min: 6100, max: 7200, country: 'Egipat, Middle East / North Africa' },
  { lang: 'Hindi', min: 5000, max: 5900, country: 'Indija' },
  { lang: 'Turkish', min: 3700, max: 4300, country: 'Turska' },
  { lang: 'Bengali', min: 3100, max: 3700, country: 'Bangladeš, Indija' },
  { lang: 'Uzbek', min: 1600, max: 1900, country: 'Uzbekistan' },
  { lang: 'Punjabi', min: 1800, max: 2100, country: 'Pakistan' },
];

// Rows to skip for English and Croatian
const specialData = [
  { lang: 'Croatian', min: 2400000, max: 2800000, country: 'Croatia (native & expat)' },
  { lang: 'English', min: 2400000, max: 2800000, country: 'Global / Philippines, India, Pakistan, etc.' },
];




const CorrelationPlot: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [showResiduals, setShowResiduals] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    const filteredData = data.filter(d => d.fbReach > 0);
    const excludedData = data.filter(d => d.fbReach <= 0);


    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 500;
    const height = 500; // make SVG square

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Determine max domain for square axes
    const xMax = d3.max(filteredData, d => d.residents) ?? 0;
    const yMax = d3.max(filteredData, d => d.fbReach) ?? 0;
    const maxDomain = Math.max(xMax, yMax) * 1.1;

    // Square plotting area
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const plotSize = Math.min(plotWidth, plotHeight); // make plot square

    const xScale = d3.scaleLinear()
      .domain([0, maxDomain])
      .range([margin.left, margin.left + plotSize]);

    const yScale = d3.scaleLinear()
      .domain([0, maxDomain])
      .range([margin.top + plotSize, margin.top]); // invert y-axis


    const ticksCount = 6;

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(ticksCount))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .text('2025 Residents');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(ticksCount))
      .append('text')
      .attr('x', -height / 2)
      .attr('y', -50)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('FB Reach Avg');

    const tooltip = d3.select('body')
      .selectAll('.tooltip-correlation')
      .data([null])
      .join('div')
      .attr('class', 'tooltip-correlation')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('color', '#333')
      .style('opacity', 0);

    // Bubbles with hover tooltip
    svg.selectAll('circle')
      .data(filteredData)
      .join('circle')
      .attr('cx', d => xScale(d.residents))
      .attr('cy', d => yScale(d.fbReach))
      .attr('r', 8)
      .attr('fill', '#1f77b4')
      .on('mouseover', (event, d) => {
        tooltip.html(`
          <b>${d.lang}</b><br/>
          <b>MUP 2025:</b> ${d.residents}<br/>
          <b>Meta 2026:</b> ${d.fbReach} (range avg)
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

    // Bubbles
    svg.selectAll('circle')
      .data(filteredData)
      .join('circle')
      .transition()
      .duration(1000)
      .attr('cx', d => xScale(d.residents))
      .attr('cy', d => yScale(d.fbReach))
      .attr('r', 8)
      .attr('fill', '#1f77b4');

    // Labels
    svg.selectAll('text.label')
      .data(filteredData)
      .join('text')
      .transition()
      .duration(1000)
      .attr('class', 'label')
      .attr('x', d => xScale(d.residents) + 10)
      .attr('y', d => yScale(d.fbReach) + 4)
      .text(d => d.lang)
      .attr('font-size', '12px')
      .attr('fill', '#333');

    // Linear regression
    const xMean = d3.mean(filteredData, d => d.residents)!;
    const yMean = d3.mean(filteredData, d => d.fbReach)!;
    const numerator = d3.sum(filteredData, d => (d.residents - xMean) * (d.fbReach - yMean));
    const denominator = d3.sum(filteredData, d => Math.pow(d.residents - xMean, 2));
    const slope = numerator / denominator;
    const intercept = yMean - slope * xMean;

    const xMin = d3.min(filteredData, d => d.residents)!;
    const xMaxVal = d3.max(filteredData, d => d.residents)!;
    const regressionLine = [
      { residents: xMin, fbReach: slope * xMin + intercept },
      { residents: xMaxVal, fbReach: slope * xMaxVal + intercept }
    ];

    const line = d3.line<{ residents: number; fbReach: number }>()
      .x(d => xScale(d.residents))
      .y(d => yScale(d.fbReach));

    svg.append('path')
      .datum(regressionLine)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 2);

    // Residual lines
    if (showResiduals) {
      svg.selectAll('line.residual')
        .data(filteredData)
        .join('line')
        .attr('class', 'residual')
        .attr('x1', d => xScale(d.residents))
        .attr('y1', d => yScale(d.fbReach))
        .attr('x2', d => xScale(d.residents))
        .attr('y2', d => yScale(slope * d.residents + intercept))
        .attr('stroke', 'orange')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4 2');
    }

    // Correlation coefficient
    const r = numerator / Math.sqrt(
      d3.sum(filteredData, d => Math.pow(d.residents - xMean, 2)) *
      d3.sum(filteredData, d => Math.pow(d.fbReach - yMean, 2))
    );

    svg.append('text')
      .attr('x', width - margin.right - 10)
      .attr('y', margin.top)
      .attr('text-anchor', 'end')
      .attr('fill', 'red')
      .attr('font-size', '14px')
      .text(`r = ${r.toFixed(2)}`);

  }, [data, showResiduals]);

  const excludedData = data.filter(d => d.fbReach <= 0);

  return (
    <div style={{ display: 'flex', gap: '0px' }}>
      <div>
        <button onClick={() => setShowResiduals(!showResiduals)} style={{ marginBottom: '10px' }}>
          {showResiduals ? 'Hide Residuals' : 'Show Residuals'}
        </button>
        <svg ref={svgRef} width={700} height={500} />
      </div>


      <div style={{ maxWidth: '400px', fontSize: '10px' }}>

        <table style={{ borderCollapse: 'collapse', width: '100%' }}>

          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Lang</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Min</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Max</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Likely Country of Origin(s)</th>
              <th style={{ border: '1px solid #ccc', padding: '4px' }}>Meta outliers (excluded)</th>
            </tr>
          </thead>
          <tbody>
            {additionalData.map(d => {
              const isExcluded = excludedData.some(ed => ed.lang === d.lang);
              return (
                <tr key={d.lang}>
                  <td style={{ border: '1px solid #ccc', padding: '4px' }}>{d.lang}</td>
                  <td style={{ border: '1px solid #ccc', padding: '4px' }}>{d.min}</td>
                  <td style={{ border: '1px solid #ccc', padding: '4px' }}>{d.max}</td>
                  <td style={{ border: '1px solid #ccc', padding: '4px' }}>{d.country}</td>
                  <td style={{ border: '1px solid #ccc', padding: '4px' }}>
                    {isExcluded ? (d.lang === 'Russian' ? 'Too big' : 'Too small') : ''}
                  </td>
                </tr>
              );
            })}

            {/* blank row for separation */}
            <tr><td colSpan={5} style={{ border: 'none', height: '10px' }}></td></tr>

            {specialData.map(d => {
              const isExcluded = excludedData.some(ed => ed.lang === d.lang);
              return (
                <tr key={d.lang}>
                  <td style={{ border: '1px solid #ccc', padding: '4px' }}>{d.lang}</td>
                  <td style={{ border: '1px solid #ccc', padding: '4px' }}>{d.min}</td>
                  <td style={{ border: '1px solid #ccc', padding: '4px' }}>{d.max}</td>
                  <td style={{ border: '1px solid #ccc', padding: '4px' }}>{d.country}</td>
                  <td style={{ border: '1px solid #ccc', padding: '4px' }}>
                    {isExcluded ? (d.lang === 'Russian' ? 'Too big' : 'Too small') : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>

      </div>

    </div>

  )
}

export default CorrelationPlot;

