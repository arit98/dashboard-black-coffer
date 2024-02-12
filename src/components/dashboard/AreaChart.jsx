import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AreaChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        // Format date to match 'January, 20 2017 03:51:25'
        const parseDate = d3.timeParse('%B, %d %Y %H:%M:%S');
        data.forEach(d => {
            d.added = parseDate(d.added);
        });

        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d3.timeFormat('%d-%b-%Y')(d.added)))
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, d => d.intensity)]);

        const area = d3.area()
            .x(d => xScale(d3.timeFormat('%d-%b-%Y')(d.added)))
            .y0(height)
            .y1(d => yScale(d.intensity));

        svg.append('path')
            .datum(data)
            .attr('fill', 'steelblue')
            .attr('d', area);

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')

        svg.append('g')
            .call(d3.axisLeft(yScale));

        // Legends
        const legends = svg.append('g')
            .attr('transform', `translate(${width - 120},${margin.top})`);

        legends.append('text')
            .text('Intensity')
            .attr('x', 50)
            .attr('y', 10)
            .attr('font-size', '12px')
            .attr('fill', 'black');

        legends.append('rect')
            .attr('x', 20)
            .attr('y', -5)
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', 'steelblue');

    }, [data]);

    return (
        <svg className='h-[25rem] w-[39rem] font-extralight bg-cardOverlay backdrop-blur-md drop-shadow-lg rounded-xl' ref={svgRef}></svg>
    );
};

export default AreaChart;
