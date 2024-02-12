import React, { useEffect } from 'react'
import * as d3 from 'd3'

const PieChart = ({ data }) => {
    useEffect(() => {
        if (data.length > 0) {
            const width = 500;
            const height = 500;

            const color = d3.scaleOrdinal()
                .domain(data.map(d => d.intensity))
                .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

            const pie = d3.pie()
                .sort(null)
                .value(d => d.intensity);

            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(Math.min(width, height) / 2 - 1);

            const labelRadius = arc.outerRadius()() * 0.8;

            const arcLabel = d3.arc()
                .innerRadius(labelRadius)
                .outerRadius(labelRadius);

            const arcs = pie(data);

            const svg = d3.select('#pie')
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

            svg.append("g")
                .attr("stroke", "white")
                .selectAll()
                .data(arcs)
                .join("path")
                .attr("fill", d => color(d.data.source))
                .attr("d", arc)
                .append("title")
                .text(d => `${d.data.source}: ${d.data.relevance}`)

            svg.append("g")
                .attr("text-anchor", "middle")
                .selectAll()
                .data(arcs)
                .join("text")
                .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
                .call(text => text.append("tspan")
                    .attr("y", "-0.4em")
                    .attr("font-weight", "bold")
                    .text(d => d.data.source))
                    .attr('class', 'font-bold')
                .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                    .attr("x", 0)
                    .attr("y", "0.7em")
                    .attr("fill-opacity", 0.7)
                    .text(d => d.data.intensity))
                    .attr('font-size', '11px')            
        }
    })
    return (
        <svg className='w-[25rem] p-4 bg-cardOverlay backdrop-blur-md drop-shadow-lg rounded-xl' id='pie' />
    )
}

export default PieChart