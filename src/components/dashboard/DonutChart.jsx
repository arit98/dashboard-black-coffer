import React, { useEffect } from 'react'
import * as d3 from 'd3'
import '../../scrollbar.css'

const DonutChart = ({ data }) => {

    useEffect(() => {
        const width = 500;
        const height = 500;
        const radius = Math.max(width, height) / 2;

        const arc = d3.arc()
            .innerRadius(radius * 0.67)
            .outerRadius(radius - 1);

        const pie = d3.pie()
            .padAngle(1 / radius)
            .sort(null)
            .value(d => d.intensity);

        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.source))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

        const svg = d3.select('#donut')
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        svg.selectAll('*').remove()
        svg.append("g")
            .selectAll()
            .data(pie(data))
            .join("path")
            .attr("fill", d => color(d.data.topic))
            .attr("d", arc)
            .append("title")
            .text(d => `${d.data.topic}: ${d.data.intensity}`);

        svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("class", 'text-[12px] font-[600]')
            .attr("text-anchor", "middle")
            .selectAll()
            .data(pie(data))
            .join("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .call(text => text.append("tspan")
                .attr("y", "-0.4em")
                .text(d => d.data.topic))
            .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .attr("fill-opacity", 0.7)
                )

        const legendData = Array.from(new Set(data.map(d => d.topic))).map(topic => {
            return { topic: topic };
        });

        const legend = d3.select("#legend-donut")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("height", legendData.length * 24);

        const legendItems = legend.selectAll(".legend-item")
            .data(legendData)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legendItems.append("rect")
            .attr("x", 0)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", d => color(d.topic));

        legendItems.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .text(d => d.topic);
    }, [data]);

    return (
        <div className='flex w-full h-[25rem] bg-cardOverlay backdrop-blur-md drop-shadow-lg rounded-xl p-4'>
            <svg id='donut' className='w-[70rem]'></svg>
            <svg className="p-4" id="legend-donut"></svg>
        </div>
    )
}

export default DonutChart