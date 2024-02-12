import React, { useEffect, useState } from 'react';
import DataService from '../services/DataService';
import DonutChart from '../components/dashboard/DonutChart';
import BarChart from '../components/dashboard/BarChart';
import LineChart from '../components/dashboard/LineChart';
import PieChart from '../components/dashboard/PieChart';
import DirectedGraph from '../components/dashboard/DirectedGraph';
import Heatmap from '../components/dashboard/HeatMap';
import AreaChart from '../components/dashboard/AreaChart';

const Dashboard = () => {

    const [data, setData] = useState([]);

    const loadData = async () => {
        try {
            const response = await DataService.getData();
            // console.log('Fetched data:', response.data);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className='h-screen m-6 flex flex-wrap gap-6 items-center z-[50]'>
            <div className='flex items-center justify-center flex-col'>
                <BarChart key={data.id} data={data.filter(d => d.intensity!='' && d.country != '' && d.sector != '')} />
                <p>Bar Chart</p>
            </div>
            <div className='flex items-center justify-center flex-col'>
                <DonutChart key={data.id} data={data.slice(1, 20).filter(d => d.intensity != '' && d.topic != '')} />
                <p>Donut Chart</p>
            </div>
            <div className='flex items-center justify-center flex-col'>
                <LineChart key={data.id} data={data.slice(1, 150).filter((d) => d.intensity != '' && d.relevance!='' && d.likelihood!='' && d.source!='')} />
                <p>Line Chart</p>
            </div>
            <div className='flex items-center justify-center flex-col'>
                <PieChart key={data.id} data={data.slice(1, 20).filter(d => d.intensity != '' && d.source != '')} />
                <p>Pie Chart</p>
            </div>
            <div className='flex items-center justify-center flex-col'>
                <Heatmap key={data.id} data={data.filter(d=>d.intensity!='' && d.region!='' && d.sector!='')} />
                <p>Heat Map</p>
            </div>
            <div className='flex items-center justify-center flex-col'>
                <AreaChart key={data.id} data={data.slice(1,200).filter(d=>d.intensity!='' && d.date!='')} />
                <p>Area Chart</p>
            </div>
            <div className='flex w-full items-center justify-center flex-col'>
                <DirectedGraph key={data.id} data={data.slice(1,200).filter(d=>d.intensity!='' && d.date!='')} />
                <p>Directed Graph</p>
            </div>
        </div>
    );
};

export default Dashboard;
