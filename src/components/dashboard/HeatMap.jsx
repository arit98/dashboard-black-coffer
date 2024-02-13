import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Heatmap = ({ data }) => {
  const svgRef = useRef();
  const legendRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) {
      console.error('No data provided for the heatmap.');
      return;
    }

    const svg = d3.select(svgRef.current);
    if (!svg) {
      console.error('SVG element not found.');
      return;
    }

    svg.selectAll('*').remove();

    const chartData = data.map((item) => ({
      region: item.region,
      sector: item.sector,
      intensity: item.intensity,
    }));

    const margin = { top: 30, right: 30, bottom: 60, left: 140 };
    const width = 700 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const xScale = d3
      .scaleBand()
      .domain(chartData.map((d) => d.region))
      .range([margin.left, width + margin.left])
      .padding(0.1);

    const yScale = d3
      .scaleBand()
      .domain(chartData.map((d) => d.sector))
      .range([height + margin.top, margin.top])
      .padding(0.1);

    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(chartData, (d) => d.intensity)]);

    svg
      .selectAll('rect')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.region))
      .attr('y', (d) => yScale(d.sector))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .style('fill', (d) => colorScale(d.intensity));

    svg
      .append('g')
      .attr('transform', `translate(0,${height + margin.top})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svg.append('g').attr('transform', `translate(${margin.left}, 0)`).call(d3.axisLeft(yScale));

    const legendSvg = d3.select(legendRef.current);
    if (!legendSvg) {
      console.error('Legend SVG element not found.');
      return;
    }

    legendSvg.selectAll('*').remove();

    const legendWidth = 200;
    const legendHeight = 20;
    const legend = legendSvg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const legendScale = d3.scaleLinear().domain([0, d3.max(chartData, (d) => d.intensity)]).range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale).ticks(5).tickFormat(d3.format('.2s')).tickSize(0);

    legend.append('g').call(legendAxis);

    const defs = legendSvg.append('defs');
    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'legendGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    linearGradient
      .selectAll('stop')
      .data(colorScale.ticks().map((t, i, n) => ({ offset: `${(100 * i) / n.length}%`, color: colorScale(t) })))
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);

    legend
      .append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legendGradient)');

    legendSvg
      .append('text')
      .attr('x', margin.left)
      .attr('y', margin.top - 10)
      .style('font-size', '12px')
      .text('Intensity');

  }, [data]);

  return (
    <div className='h-[25rem] w-full pl-6 bg-cardOverlay backdrop-blur-md drop-shadow-lg rounded-xl'>
      <svg
        className='h-[25rem] w-[46rem]'
        ref={svgRef}
      />
      <svg className='-mt-20 ml-24' ref={legendRef} width={800} height={50} />
    </div>
  );
};

export default Heatmap;
