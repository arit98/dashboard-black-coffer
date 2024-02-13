import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const generateLine = (xScale, yScale, property) => {
    const line = d3.line()
        .x(d => xScale(d.source) + xScale.bandwidth() / 2)
        .y(d => yScale(d[property]));

    return line;
}

const LineChart = ({ data }) => {
    const svgRef = useRef();
    useEffect(() => {
        if (data.length > 0) {
            const chartContainer = d3.select(svgRef.current);

            chartContainer.selectAll('*').remove();

            const svg = chartContainer.append('svg')
                .attr('width', 2460)
                .attr('height', 400);

            const margin = { top: 20, right: 20, bottom: 170, left: 40 }; // Increased bottom margin for the legend
            const width = +svg.attr('width') - margin.left - margin.right;
            const height = +svg.attr('height') - margin.top - margin.bottom;

            const x = d3.scaleBand()
                .rangeRound([0, width])
                .padding(0.1)
                .domain(data.map(d => d.source));

            const yRelevance = d3.scaleLinear()
                .rangeRound([height, 0])
                .domain([0, d3.max(data, d => d.relevance)]);

            const yLikelihood = d3.scaleLinear()
                .rangeRound([height, 0])
                .domain([0, d3.max(data, d => d.likelihood)]);

            const yIntensity = d3.scaleLinear()
                .rangeRound([height, 0])
                .domain([0, d3.max(data, d => d.intensity)]);

            const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            g.append('g')
                .attr('class', 'axis axis-x')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '.15em')
                .attr('transform', 'rotate(-65)');

            g.append('g')
                .attr('class', 'axis axis-y relevance')
                .call(d3.axisLeft(yRelevance).ticks(5).tickSize(-width));

            g.append('g')
                .attr('class', 'axis axis-y likelihood');

            g.append('g')
                .attr('class', 'axis axis-y intensity');

            g.selectAll('.line-relevance')
                .data([data])
                .enter().append('path')
                .attr('class', 'line-relevance')
                .attr('stroke', 'steelblue')
                .attr('stroke-width', 1)
                .attr('d', generateLine(x, yRelevance, 'relevance'))
                .attr('fill', 'none');

            g.selectAll('.line-likelihood')
                .data([data])
                .enter().append('path')
                .attr('class', 'line-likelihood')
                .attr('stroke', 'orange')
                .attr('stroke-width', 1)
                .attr('d', generateLine(x, yLikelihood, 'likelihood'))
                .attr('fill', 'none');

            g.selectAll('.line-intensity')
                .data([data])
                .enter().append('path')
                .attr('class', 'line-intensity')
                .attr('stroke', 'maroon')
                .attr('stroke-width', 1)
                .attr('d', generateLine(x, yIntensity, 'intensity'))
                .attr('fill', 'none');

            g.selectAll('.dot-relevance')
                .data(data)
                .enter().append('circle')
                .attr('class', 'dot-relevance')
                .attr('cx', d => x(d.source) + x.bandwidth() / 2)
                .attr('cy', d => yRelevance(d.relevance))
                .attr('r', 3.5)
                .attr('fill', 'steelblue');

            g.selectAll('.dot-likelihood')
                .data(data)
                .enter().append('circle')
                .attr('class', 'dot-likelihood')
                .attr('cx', d => x(d.source) + x.bandwidth() / 2)
                .attr('cy', d => yLikelihood(d.likelihood))
                .attr('r', 3.5)
                .attr('fill', 'orange');

            g.selectAll('.dot-intensity')
                .data(data)
                .enter().append('circle')
                .attr('class', 'dot-intensity')
                .attr('cx', d => x(d.source) + x.bandwidth() / 2)
                .attr('cy', d => yIntensity(d.intensity))
                .attr('r', 3.5)
                .attr('fill', 'maroon');

            const legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', `translate(${margin.left},${height + margin.bottom - 20})`); // Adjusted y position for the legend

            legend.selectAll('.legend-item')
                .data(['Relevance', 'Likelihood', 'Intensity'])
                .enter().append('g')
                .attr('class', 'legend-item')
                .attr('transform', (d, i) => `translate(${i * 140}, 10)`); // Adjusted x position for legend items

            legend.selectAll('.legend-item')
                .each(function (d) {
                    const item = d3.select(this);
                    item.append('rect')
                        .attr('width', 10)
                        .attr('height', 10)
                        .attr('fill', d === 'Relevance' ? 'steelblue' : d === 'Likelihood' ? 'orange' : 'maroon')
                        .attr('x', 0)
                        .attr('y', 0);
                    item.append('text')
                        .attr('x', 15)
                        .attr('y', 9)
                        .text(d);
                });
        }
    }, [data]);

    return (
        <svg ref={svgRef} className='h-[25rem] w-full bg-cardOverlay backdrop-blur-md drop-shadow-lg rounded-xl' />
    );
};

export default LineChart;