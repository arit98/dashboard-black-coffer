import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// generate line func
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
            //select the tag
            const chartContainer = d3.select(svgRef.current);

            chartContainer.selectAll('*').remove();

            // append the svg
            const svg = chartContainer.append('svg')
                .attr('width', 2460)
                .attr('height', 400);

            // declaring length and margin
            const margin = { top: 20, right: 20, bottom: 170, left: 40 };
            const width = +svg.attr('width') - margin.left - margin.right;
            const height = +svg.attr('height') - margin.top - margin.bottom;

            // declaring x axis
            const x = d3.scaleBand()
                .rangeRound([0, width])
                .padding(0.1)
                .domain(data.map(d => d.source));

            // declaring y axis
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
                .attr('transform', 'rotate(-30)')
                .style('text-anchor', 'end');

            g.append('g')
                .attr('class', 'axis axis-y relevance')
                .call(d3.axisLeft(yRelevance).ticks(10).tickSize(-width));

            g.append('g')
                .attr('class', 'axis axis-y likelihood')
            // .call(d3.axisLeft(yLikelihood).ticks(5).tickSize(-width));

            g.append('g')
                .attr('class', 'axis axis-y intensity')
            // .call(d3.axisLeft(yIntensity).ticks(5).tickSize(-width));

            g.selectAll('.line-relevance')
                .data([data])
                .enter().append('path')
                .attr('class', 'line-relevance')
                .attr('stroke', 'blue')
                .attr('stroke-width', 1)
                .attr('d', generateLine(x, yRelevance, 'relevance'))
                .attr('fill', 'none')

            g.selectAll('.line-likelihood')
                .data([data])
                .enter().append('path')
                .attr('class', 'line-likelihood')
                .attr('stroke', 'green')
                .attr('stroke-width', 1)
                .attr('d', generateLine(x, yLikelihood, 'likelihood'))
                .attr('fill', 'none')

            g.selectAll('.line-intensity')
                .data([data])
                .enter().append('path')
                .attr('class', 'line-intensity')
                .attr('stroke', 'red')
                .attr('stroke-width', 1)
                .attr('d', generateLine(x, yIntensity, 'intensity'))
                .attr('fill', 'none')

            g.selectAll('.dot-relevance')
                .data(data)
                .enter().append('circle')
                .attr('class', 'dot-relevance')
                .attr('cx', d => x(d.source) + x.bandwidth() / 2)
                .attr('cy', d => yRelevance(d.relevance))
                .attr('r', 2.5)
                .attr('fill', 'blue');

            g.selectAll('.dot-likelihood')
                .data(data)
                .enter().append('circle')
                .attr('class', 'dot-likelihood')
                .attr('cx', d => x(d.source) + x.bandwidth() / 2)
                .attr('cy', d => yLikelihood(d.likelihood))
                .attr('r', 2.5)
                .attr('fill', 'green');

            g.selectAll('.dot-intensity')
                .data(data)
                .enter().append('circle')
                .attr('class', 'dot-intensity')
                .attr('cx', d => x(d.source) + x.bandwidth() / 2)
                .attr('cy', d => yIntensity(d.intensity))
                .attr('r', 2.5)
                .attr('fill', 'red');
                
            const legendColors = ['blue', 'green', 'red'];
            const legendLabels = ['Relevance', 'Likelihood', 'Intensity'];

            const legend = g.append('g')
                .attr('transform', `translate(${width - 120},${-10})`)
                .selectAll('g')
                .data(legendColors)
                .enter().append('g')
                .attr('transform', (d, i) => `translate(0,${i * 20})`);

            legend.append('rect')
                .attr('width', 18)
                .attr('height', 18)
                .attr('fill', d => d);

            legend.append('text')
                .attr('x', 24)
                .attr('y', 9)
                .attr('dy', '0.32em')
                .text((d, i) => legendLabels[i]);
        }
    }, [data]);

    return (
        <svg className='w-[59rem] p-4 h-[25rem] bg-cardOverlay backdrop-blur-md drop-shadow-lg rounded-xl' ref={svgRef} />
    );
};

export default LineChart;
