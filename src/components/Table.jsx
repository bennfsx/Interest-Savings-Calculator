import React, { useState, useEffect } from "react";
import styles from "./Table.module.css";
import TableStyle from 'react-bootstrap/Table';

const Table = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.airtable.com/v0/appETAOnMCK006o6N/InterestCalculator', {
          headers: {
            Authorization: 'Bearer patvMJsFSeycxRJiT.0a334de1aedd5f7ff42ce8d7db915df4c27917c34bc79c7805b1ccdaff50484b'
          }
        });
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData.records);
        } else {
          console.error('Failed to fetch data from Airtable:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data from Airtable:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.tableContainer}>
      <TableStyle striped bordered hover variant="dark" > 
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Account Balance</th>
            <th>Annual Amount</th>
            <th>Monthly Amount</th>
            <th>Accumulated Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{record.fields.date}</td>
              <td>S${parseFloat(record.fields.accountBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td>S${parseFloat(record.fields.annualAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td>S${parseFloat(record.fields.monthlyAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td>S${(parseFloat(record.fields.accountBalance) + parseFloat(record.fields.annualAmount)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            </tr>
          ))}
        </tbody>
      </TableStyle>
    </div>
  );
};

export default Table;
