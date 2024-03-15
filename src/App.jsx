import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Display from "./components/Display";

const App = () => {
  return (
    <Router>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          <Route path="/" element={<Display />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
