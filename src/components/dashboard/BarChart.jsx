import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GroupedBarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); 
    const chartData = data.map((item) => ({
      country: item.country,
      sector: item.sector,
      intensity: item.intensity,
    }));

    const width = 730;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 50, left: 90 };

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.country))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear().domain([0, d3.max(chartData, (d) => d.intensity)]).range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    svg
      .selectAll('rect')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.country) + xScale.bandwidth() / 4)
      .attr('y', (d) => yScale(d.intensity))
      .attr('width', xScale.bandwidth() / 2)
      .attr('height', (d) => height - margin.bottom - yScale(d.intensity))
      .attr('fill', (d) => colorScale(d.sector));

    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-0.5em')
      .attr('dy', '-0.5em')
      .attr('transform', 'rotate(-45)');

    svg.append('g').attr('transform', `translate(${margin.left}, 0)`).call(d3.axisLeft(yScale));
    const sectors = [...new Set(data.map((d) => d.sector))];
    const legend = svg.append('g').attr('transform', `translate(${width - margin.right},${margin.top})`);

    legend
      .selectAll('rect')
      .data(sectors)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d, i) => i * 20)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d) => colorScale(d))

    legend
      .selectAll('text')
      .data(sectors)
      .enter()
      .append('text')
      .attr('x', 15)
      .attr('y', (d, i) => i * 20 + 10)
      .attr('dy', '0.35em')
      .text((d) => d)
  }, [data]);

  return <svg className='h-[25rem] w-full bg-cardOverlay backdrop-blur-md drop-shadow-lg rounded-xl' ref={svgRef} width={500} height={300} />;
};

export default GroupedBarChart;
