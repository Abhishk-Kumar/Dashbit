import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const DataDisplay = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [colorPalette, setColorPalette] = useState(['#4CAF50', '#FF9800', '#2196F3']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const drawBarChart = (chartId, xKey, yKey, title, xLabel, yLabel) => {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(chartId).selectAll("*").remove();

    const svg = d3.select(chartId)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d[xKey]))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[yKey]) || 0])
      .nice()
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d => d || "Unknown"));

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d[xKey]))
      .attr('y', d => y(d[yKey]))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d[yKey]))
      .attr('fill', (d, i) => colorPalette[i % colorPalette.length])
      .on('mouseover', function(event, d) {
        d3.select(this).style('fill', 'orange');
        const [x, y] = d3.pointer(event);
        d3.select('#tooltip')
          .style('left', x + 'px')
          .style('top', y + 'px')
          .style('display', 'inline-block')
          .html(`${xLabel}: ${d[xKey]}<br>${yLabel}: ${d[yKey]}`);
      })
      .on('mouseout', function() {
        d3.select(this).style('fill', (d, i) => colorPalette[i % colorPalette.length]);
        d3.select('#tooltip').style('display', 'none');
      });

    // Add chart title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(title);
    
    // Add y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yLabel);
    
    // Add x-axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .style("text-anchor", "middle")
      .text(xLabel);
  };

  const drawPieChart = () => {
    const width = 400;
    const height = 400;
    const radius = Math.min (width, height) / 2;

    d3.select("#pie-chart").selectAll("*").remove();

    const svg = d3.select('#pie-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(colorPalette);

    const topicsData = Array.from(d3.rollups(data, v => v.length, d => d.Topic), ([topic, value]) => ({ topic, value }));

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg.selectAll('.arc')
      .data(pie(topicsData))
      .enter().append('g')
      .attr('class', 'arc')
      .append('path')
      .attr('d', arc)
      .style('fill', d => color(d.data.topic))
      .on('mouseover', function(event, d) {
        d3.select(this).style('fill', 'orange');
        const [x, y] = d3.pointer(event);
        d3.select('#tooltip')
          .style('left', x + 'px')
          .style('top', y + 'px')
          .style('display', 'inline-block')
          .html(`Topic: ${d.data.topic}<br>Count: ${d.data.value}`);
      })
      .on('mouseout', function() {
        d3.select(this).style('fill', d => color(d.data.topic));
        d3.select('#tooltip').style('display', 'none');
      });

    // Add chart title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Topic Distribution Pie Chart");
  };

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}. Please try refreshing the page or check the server status.</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  drawBarChart('#bar-chart-intensity', 'Year', 'Intensity', 'Yearly Intensity Bar Chart', 'Year', 'Intensity');
  drawBarChart('#bar-chart-likelihood', 'Year', 'Likelihood', 'Yearly Likelihood Bar Chart', 'Year', 'Likelihood');
  drawBarChart('#bar-chart-relevance', 'Year', 'Relevance', 'Yearly Relevance Bar Chart', 'Year', 'Relevance');
  drawPieChart();

  const colorPalettes = [
    { name: 'Default', colors: ['#4CAF50', '#FF9800', '#2196F3'] },
    { name: 'Bright', colors: ['#FF69B4', '#33CC33', '#6666CC'] },
    { name: 'Pastel', colors: ['#C9E4CA', '#F7D2C4', '#C5CAE9'] },
  ];

  const handleColorPaletteChange = (event) => {
    const selectedPalette = colorPalettes.find((palette) => palette.name === event.target.value);
    setColorPalette(selectedPalette.colors);
  };

  return (
    <div>
      <h1>Data Visualization</h1>
      <select value={colorPalettes.find((palette) => palette.colors.join(',') === colorPalette.join(',')).name} onChange={handleColorPaletteChange}>
        {colorPalettes.map((palette) => (
          <option key={palette.name} value={palette.name}>
            {palette.name}
          </option>
        ))}
      </select>
      <div id="bar-chart-intensity" style={{ marginBottom: '40px' }}>
        <h2>Yearly Intensity Bar Chart</h2>
      </div>
      <div id="bar-chart-likelihood" style={{ marginBottom: '40px' }}>
        <h2>Yearly Likelihood Bar Chart</h2>
      </div>
      <div id="bar-chart-relevance" style={{ marginBottom: '40px' }}>
        <h2>Yearly Relevance Bar Chart</h2>
      </div>
      <div id="pie-chart">
        <h2>Topic Distribution Pie Chart</h2>
      </div>
      <div id="tooltip" style={{ display: 'none', position: 'absolute', backgroundColor: 'white', padding: '10px', border: '1px solid #ddd' }}></div>
    </div>
  );
};

export default DataDisplay;











