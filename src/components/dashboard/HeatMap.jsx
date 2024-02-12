import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Heatmap = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear existing content

    // Extract relevant data for the chart
    const chartData = data.map((item) => ({
      region: item.region,
      sector: item.sector,
      intensity: item.intensity,
    }));

    // Set up dimensions and scales
    const margin = { top: 30, right: 30, bottom: 30, left: 140 };
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

    // Draw rectangles
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

    // Draw x-axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height + margin.top})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Draw y-axis
    svg.append('g').attr('transform', `translate(${margin.left}, 0)`).call(d3.axisLeft(yScale));
  }, [data]);

  return <svg className='h-[25rem] w-[45rem] pl-6 bg-cardOverlay backdrop-blur-md drop-shadow-lg rounded-xl' ref={svgRef} />;
};

export default Heatmap;
