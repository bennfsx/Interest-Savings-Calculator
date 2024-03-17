import React from 'react';
import Table from "./Table.jsx"
// import FinancialGoal from './FinancialGoal.jsx';
import ChartWithDynamicUpdates from './ChartWithDynamicUpdates .jsx';


const Dashboard = () => {
    return (
        <><Table></Table>
        {/* <FinancialGoal></FinancialGoal> */}
        <ChartWithDynamicUpdates></ChartWithDynamicUpdates>
        
        </>
    );
};

export default Dashboard;