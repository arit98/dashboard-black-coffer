import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DirectedGraph = ({ data }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [forceStrength, setForceStrength] = useState(-100);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const graphData = data.map((item) => ({
      region: item.region,
      intensity: item.intensity,
    }));

    const simulation = d3.forceSimulation(graphData)
      .force('charge', d3.forceManyBody().strength(forceStrength))
      .force('link', d3.forceLink().id((d) => d.region))
      .force('center', d3.forceCenter(containerWidth / 2, containerHeight / 2));

    const links = data.map((item) => ({
      source: item.region,
      target: 'Central Node',
      intensity: item.intensity,
    }));

    const link = svg
      .selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .style('stroke', 'gray')
      .style('stroke-width', (d) => d.intensity);

    const node = svg
      .selectAll('.node')
      .data(graphData)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .style('fill', 'steelblue');

    const nodeLabels = svg
      .selectAll('.node-label')
      .data(graphData)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('dy', '0.35em')
      .text((d) => d.region);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

      nodeLabels.attr('x', (d) => d.x).attr('y', (d) => d.y);
    });
  }, [data, forceStrength]);

  const handleForceStrengthChange = (event) => {
    setForceStrength(parseInt(event.target.value));
  };

  return (
    <div
      ref={containerRef}
      className='w-full h-[25rem] bg-cardOverlay backdrop-blur-md drop-shadow-lg rounded-xl'
      style={{ position: 'relative' }}
    >
      <svg ref={svgRef} width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }} />
      <div className='flex items-center flex-row mt-[25rem]'>
        <label htmlFor="forceStrength">Force Strength:</label>
        <input
          type="range"
          id="forceStrength"
          name="forceStrength"
          min="-1000"
          max="0"
          step="10"
          value={forceStrength}
          onChange={handleForceStrengthChange}
        />
      </div>
    </div>
  );
};

export default DirectedGraph;
