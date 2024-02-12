import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DirectedGraph = ({ data }) => {
  const svgRef = useRef();
  const [forceStrength, setForceStrength] = useState(-100);

  useEffect(() => {
    // set up the SVG tag
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear existing content

    // extracting data from backend
    const graphData = data.map((item) => ({
      region: item.region,
      intensity: item.intensity,
    }));

    // create a force simulation
    const simulation = d3.forceSimulation(graphData)
      .force('charge', d3.forceManyBody().strength(forceStrength))
      .force('link', d3.forceLink().id((d) => d.region))
      .force('center', d3.forceCenter(300, 150));

    //draw links
    const links = data.map((item) => ({
      source: item.region,
      target: 'Central Node', // Add a central node to connect all regions
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

    // Ddraw nodes
    const node = svg
      .selectAll('.node')
      .data(graphData)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .style('fill', 'steelblue');

    // Add node labels
    const nodeLabels = svg
      .selectAll('.node-label')
      .data(graphData)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('dy', '0.35em')
      .text((d) => d.region);

    // Update simulation on tick
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
    <div>
      <svg className='h-[25rem] bg-cardOverlay backdrop-blur-md drop-shadow-lg rounded-xl' ref={svgRef} width={700} height={400} />
      <div style={{ margin: '20px' }}>
        <label htmlFor="forceStrength">Force Strength:</label>
        <input
          type="range"
          id="forceStrength"
          name="forceStrength"
          min="-1000"
          max="0"
          step="10" // Set the step to control the granularity of the values
          value={forceStrength}
          onChange={handleForceStrengthChange}
        />
      </div>
    </div>
  );
};

export default DirectedGraph;
