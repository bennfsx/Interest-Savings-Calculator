import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Display from "./components/Display";
import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <Router>
      <Suspense fallback={<h1>Loading...</h1>}>
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Display />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
