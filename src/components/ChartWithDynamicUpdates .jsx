import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { LinearScale, CategoryScale } from 'chart.js';
import styles from "./ChartWithDynamicUpdates .module.css";

const ChartWithDynamicUpdates = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState("");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Account Balance",
        data: [],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    fetchData(); // Fetch initial data when component mounts
  }, []);

  const fetchData = async () => {
    try {
      // Fetch data from API
      const response = await fetch('https://api.airtable.com/v0/appETAOnMCK006o6N/InterestCalculator', {
        headers: {
          Authorization: 'Bearer patvMJsFSeycxRJiT.0a334de1aedd5f7ff42ce8d7db915df4c27917c34bc79c7805b1ccdaff50484b'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRowData(data.records);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const handleRowSelect = (event) => {
    const selectedRowId = event.target.value;
    setSelectedRow(selectedRowId);
    generateChartData(selectedRowId);
  };

  const generateChartData = (selectedRowId) => {
    const selectedRowData = rowData.find(row => row.id === selectedRowId);
    if (selectedRowData) {
      const labels = [];
      const data = [];
      let currentAmount = parseFloat(selectedRowData.fields.accountBalance);
      const monthlyIncrement = parseFloat(selectedRowData.fields.monthlyAmount);
    console.log("Monthly Increment:", monthlyIncrement);

  
      // Generate data for 12 months
// Generate data for 12 months
for (let i = 0; i < 12; i++) {
    labels.push(`Month ${i + 1}`);
    data.push(currentAmount);
    console.log(`Month ${i + 1}: ${currentAmount}`);
    currentAmount += monthlyIncrement;
  }
  
  
      console.log("Labels:", labels);
      console.log("Data:", data);
  
      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Account Balance",
            data: data,
            fill: false,
            borderColor: "rgba(75,192,192,1)",
            tension: 0.1,
          },
        ],
      });
    }
  };
  

  return (
    <div>
        <div className={styles.chartcontainer}>
      <h2>Account Balance Over Time</h2>
      <select value={selectedRow} onChange={handleRowSelect}>
        <option value="">Select a row</option>
        {rowData.map(row => (
          <option key={row.id} value={row.id}>{row.fields.tag}</option>
        ))}
      </select>
      

        <Line data={chartData} />
        </div>
      
    </div>
  );
};

export default ChartWithDynamicUpdates;
